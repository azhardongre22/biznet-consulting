import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const app = express();
app.set("trust proxy", true);

const PORT = Number(process.env.PORT || 3001);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

// Public URL where unsubscribe / confirm links resolve. In dev the Vite
// proxy forwards /api/* to this server; in production this should be the
// site origin (e.g. https://biznetconsulting.ae).
const PUBLIC_SITE_URL = (
  process.env.PUBLIC_SITE_URL || "http://localhost:5173"
).replace(/\/+$/, "");

const COMPANY = {
  name: "Biznet Consulting",
  address: "Oud Metha Offices Building, Office 324, Dubai",
  email: "hello@biznetconsulting.com",
  phone: "+971 52 748 8855",
};

const CONSENT_TEXT =
  "By subscribing you consent to receive marketing emails from Biznet Consulting. You may withdraw consent at any time via the unsubscribe link in any email.";

// Toggle double opt-in. When false, new subscribers are saved as
// "confirmed" on submit and the welcome email is sent immediately.
// When true, the legacy double opt-in flow is used (pending -> confirm
// link -> welcome).
const REQUIRE_DOUBLE_OPT_IN = process.env.REQUIRE_DOUBLE_OPT_IN === "true";

app.use(
  cors({
    origin: true,
    credentials: false,
  })
);
app.use(express.json({ limit: "200kb" }));
// Required by /api/newsletter/unsubscribe POST (RFC 8058 one-click) which
// browsers/MUAs send as application/x-www-form-urlencoded.
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

function clientIp(req) {
  return (
    (req.headers["x-forwarded-for"] || "")
      .toString()
      .split(",")[0]
      .trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    null
  );
}

// Simple in-memory IP rate limiter (sliding window). Resets on restart —
// fine for a low-traffic marketing site; swap for redis if scaled out.
function createRateLimiter({ windowMs, max }) {
  const hits = new Map();
  return function check(ip) {
    if (!ip) return { ok: true, remaining: max };
    const now = Date.now();
    const entry = hits.get(ip) || [];
    const fresh = entry.filter((t) => now - t < windowMs);
    if (fresh.length >= max) {
      return { ok: false, retryAfterMs: windowMs - (now - fresh[0]) };
    }
    fresh.push(now);
    hits.set(ip, fresh);
    if (hits.size > 5000) {
      // Best-effort cleanup of cold entries.
      for (const [k, v] of hits) {
        if (v.every((t) => now - t > windowMs)) hits.delete(k);
      }
    }
    return { ok: true, remaining: max - fresh.length };
  };
}

const newsletterLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

// Serialize subscriber file writes to avoid lost updates under concurrent requests.
let subscriberWriteQueue = Promise.resolve();
function withSubscriberLock(fn) {
  const next = subscriberWriteQueue.then(fn, fn);
  subscriberWriteQueue = next.catch(() => {});
  return next;
}

async function readSubscribers() {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err?.code === "ENOENT") return [];
    throw err;
  }
}

async function writeSubscribers(list) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${SUBSCRIBERS_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, SUBSCRIBERS_FILE);
}

function findByEmail(list, email) {
  const normalized = email.toLowerCase();
  return list.find((s) => s.email?.toLowerCase() === normalized);
}

function findByToken(list, field, token) {
  if (!token) return undefined;
  return list.find((s) => s[field] === token);
}

// Upsert a subscription. Behavior:
//   - existing confirmed           -> no change ("already subscribed")
//   - new / pending / unsubscribed -> (re-)open. If autoConfirm is true,
//                                     the record is set to "confirmed"
//                                     immediately; otherwise "pending"
//                                     with a fresh confirm token for the
//                                     double opt-in flow.
//
// Returns { status, action, record } describing what to do next.
async function upsertSubscription({
  email,
  ip,
  userAgent,
  consent,
  autoConfirm = false,
}) {
  return withSubscriberLock(async () => {
    const list = await readSubscribers();
    const existing = findByEmail(list, email);
    const now = new Date().toISOString();
    const initialStatus = autoConfirm ? "confirmed" : "pending";

    if (existing) {
      if (existing.status === "confirmed") {
        return { status: "confirmed", action: "noop", record: existing };
      }
      existing.status = initialStatus;
      existing.confirmToken = autoConfirm ? null : generateToken();
      existing.unsubscribeToken = existing.unsubscribeToken || generateToken();
      existing.requestedAt = now;
      existing.confirmedAt = autoConfirm ? now : null;
      existing.unsubscribedAt = null;
      existing.ip = ip || existing.ip || null;
      existing.userAgent = userAgent || existing.userAgent || null;
      existing.consent = consent || existing.consent || null;
      await writeSubscribers(list);
      return {
        status: initialStatus,
        action: autoConfirm ? "reconfirmed" : "resent",
        record: existing,
      };
    }

    const record = {
      email,
      status: initialStatus,
      requestedAt: now,
      confirmedAt: autoConfirm ? now : null,
      unsubscribedAt: null,
      confirmToken: autoConfirm ? null : generateToken(),
      unsubscribeToken: generateToken(),
      ip: ip || null,
      userAgent: userAgent || null,
      consent: consent || null,
    };
    list.push(record);
    await writeSubscribers(list);
    return { status: initialStatus, action: "created", record };
  });
}

async function confirmSubscription(token) {
  return withSubscriberLock(async () => {
    const list = await readSubscribers();
    const sub = findByToken(list, "confirmToken", token);
    if (!sub) return { ok: false, reason: "not_found" };
    if (sub.status === "unsubscribed") {
      return { ok: false, reason: "unsubscribed", record: sub };
    }
    const alreadyConfirmed = sub.status === "confirmed";
    sub.status = "confirmed";
    sub.confirmedAt = sub.confirmedAt || new Date().toISOString();
    // Burn the confirm token so the link is single-use.
    sub.confirmToken = null;
    if (!alreadyConfirmed) await writeSubscribers(list);
    return { ok: true, alreadyConfirmed, record: sub };
  });
}

async function unsubscribeByToken(token) {
  return withSubscriberLock(async () => {
    const list = await readSubscribers();
    const sub = findByToken(list, "unsubscribeToken", token);
    if (!sub) return { ok: false, reason: "not_found" };
    const alreadyUnsubscribed = sub.status === "unsubscribed";
    sub.status = "unsubscribed";
    sub.unsubscribedAt = sub.unsubscribedAt || new Date().toISOString();
    // Keep the record (legal/audit). Burn confirm token defensively.
    sub.confirmToken = null;
    if (!alreadyUnsubscribed) await writeSubscribers(list);
    return { ok: true, alreadyUnsubscribed, record: sub };
  });
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function createTransporter() {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || "").trim());
}

function sanitizeText(value, maxLen) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .slice(0, maxLen);
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/contact", async (req, res) => {
  try {
    const firstName = sanitizeText(req.body?.firstName, 80);
    const lastName = sanitizeText(req.body?.lastName, 80);
    const name = sanitizeText(req.body?.name, 160);
    const email = sanitizeText(req.body?.email, 160);
    const phone = sanitizeText(req.body?.phone, 60);
    const message = sanitizeText(req.body?.message, 4000);
    const source = sanitizeText(req.body?.source, 40);

    const derivedName = name || [firstName, lastName].filter(Boolean).join(" ");

    if (!derivedName) {
      return res.status(400).json({ ok: false, error: "Name is required." });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: "Valid email is required." });
    }
    if (!message || message.length < 3) {
      return res.status(400).json({ ok: false, error: "Message is required." });
    }

    const MAIL_FROM = requireEnv("MAIL_FROM");
    const MAIL_TO = requireEnv("MAIL_TO");

    const transporter = createTransporter();

    const subject = `Website Enquiry${source ? ` (${source})` : ""} - ${derivedName}`;
    const text = [
      "New website enquiry",
      "",
      `Name: ${derivedName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      source ? `Source: ${source}` : null,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    await transporter.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject,
      text,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("POST /api/contact failed:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to submit. Please try again later." });
  }
});

app.post("/api/newsletter", async (req, res) => {
  try {
    const ip = clientIp(req);

    // Anti-bot honeypot: hidden field that humans never fill. If present
    // and non-empty, silently accept (don't leak the trap).
    const honeypot = sanitizeText(req.body?.website || req.body?.hp_field, 200);
    if (honeypot) {
      return res.json({ ok: true, status: "pending" });
    }

    const limit = newsletterLimiter(ip);
    if (!limit.ok) {
      res.setHeader("Retry-After", Math.ceil(limit.retryAfterMs / 1000));
      return res.status(429).json({
        ok: false,
        error: "Too many subscription attempts. Please try again later.",
      });
    }

    const email = sanitizeText(req.body?.email, 160);
    if (!email || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ ok: false, error: "Valid email is required." });
    }

    // PDPL: explicit consent required. Default to true only if the
    // frontend's consent line is visibly shown next to the form (it is in
    // Footer.jsx). The client may also send consent=true explicitly.
    const consentGiven =
      req.body?.consent === undefined ? true : Boolean(req.body.consent);
    if (!consentGiven) {
      return res.status(400).json({
        ok: false,
        error: "Consent is required to subscribe.",
      });
    }

    // PDPL: subscribers must be 18+ for general marketing. We assume the
    // frontend gates this; reject explicit minors if the flag is present.
    if (req.body?.isMinor === true) {
      return res.status(400).json({
        ok: false,
        error: "You must be 18 or older to subscribe.",
      });
    }

    const userAgent = sanitizeText(req.headers["user-agent"], 400);
    const consent = {
      givenAt: new Date().toISOString(),
      text: CONSENT_TEXT,
      source: sanitizeText(req.body?.source, 60) || "website",
      page: sanitizeText(req.body?.page, 400) || null,
    };

    const result = await upsertSubscription({
      email,
      ip,
      userAgent,
      consent,
      autoConfirm: !REQUIRE_DOUBLE_OPT_IN,
    });

    if (result.status === "confirmed" && result.action === "noop") {
      // Already on the list — say so cleanly.
      return res.json({
        ok: true,
        status: "already_subscribed",
        message:
          "This email is already subscribed. You can unsubscribe from any newsletter you receive.",
      });
    }

    const MAIL_FROM = requireEnv("MAIL_FROM");
    const MAIL_TO = requireEnv("MAIL_TO");
    const transporter = createTransporter();

    const unsubscribeUrl = `${PUBLIC_SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(result.record.unsubscribeToken)}`;

    const tasks = [];

    if (REQUIRE_DOUBLE_OPT_IN) {
      // Double opt-in: send confirmation link, no welcome yet.
      const confirmUrl = `${PUBLIC_SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(result.record.confirmToken)}`;
      tasks.push(
        transporter
          .sendMail({
            from: MAIL_FROM,
            to: email,
            subject: "Please confirm your subscription to Biznet Consulting",
            text: buildConfirmText({ confirmUrl, unsubscribeUrl }),
            html: buildConfirmHtml({ confirmUrl, unsubscribeUrl }),
            headers: {
              "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${COMPANY.email}?subject=unsubscribe>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          })
          .catch((err) =>
            console.error(
              "Newsletter confirmation email failed:",
              err?.message || err,
            ),
          ),
      );
    } else {
      // Single opt-in: send the welcome email immediately.
      tasks.push(
        transporter
          .sendMail({
            from: MAIL_FROM,
            to: email,
            subject: "Welcome to the Biznet Consulting newsletter",
            text: buildWelcomeText({ unsubscribeUrl }),
            html: buildWelcomeHtml({ unsubscribeUrl }),
            headers: {
              "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${COMPANY.email}?subject=unsubscribe>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          })
          .catch((err) =>
            console.error(
              "Newsletter welcome email failed:",
              err?.message || err,
            ),
          ),
      );
    }

    if (result.action === "created" || result.action === "reconfirmed") {
      // Admin notification on initial sign-up (and on re-activation after
      // an unsubscribe). Not sent on plain resends in double-opt-in mode.
      tasks.push(
        transporter
          .sendMail({
            from: MAIL_FROM,
            to: MAIL_TO,
            replyTo: email,
            subject: REQUIRE_DOUBLE_OPT_IN
              ? `Newsletter — pending confirmation: ${email}`
              : `Newsletter — new subscriber: ${email}`,
            text: [
              REQUIRE_DOUBLE_OPT_IN
                ? "A visitor requested a newsletter subscription. Awaiting their click on the confirmation link."
                : "A visitor subscribed to the newsletter.",
              "",
              `Email: ${email}`,
              `Time: ${result.record.requestedAt}`,
              ip ? `IP: ${ip}` : null,
              consent.page ? `Page: ${consent.page}` : null,
            ]
              .filter(Boolean)
              .join("\n"),
          })
          .catch((err) =>
            console.error(
              "Newsletter admin email failed:",
              err?.message || err,
            ),
          ),
      );
    }

    await Promise.all(tasks);

    if (REQUIRE_DOUBLE_OPT_IN) {
      return res.json({
        ok: true,
        status: "pending",
        message:
          "Almost there — check your inbox to confirm your subscription. The link expires after first use.",
      });
    }

    return res.json({
      ok: true,
      status: "subscribed",
      message:
        "You're subscribed — a welcome email is on its way. Thank you for joining.",
    });
  } catch (err) {
    console.error("POST /api/newsletter failed:", err?.message || err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to submit. Please try again later." });
  }
});

// Step 2 of double opt-in: confirms a pending subscription. Returns a
// branded HTML page so the link is friendly when clicked from email.
app.get("/api/newsletter/confirm", async (req, res) => {
  const token = sanitizeText(req.query?.token, 200);
  if (!token) {
    return res
      .status(400)
      .type("html")
      .send(
        buildResultPage({
          title: "Invalid link",
          body: "This confirmation link is missing its token. Please subscribe again from the site.",
          tone: "error",
        }),
      );
  }

  try {
    const result = await confirmSubscription(token);
    if (!result.ok) {
      const msg =
        result.reason === "unsubscribed"
          ? "This address was unsubscribed. Please subscribe again from the site to receive emails."
          : "This confirmation link is invalid or has already been used.";
      return res
        .status(400)
        .type("html")
        .send(
          buildResultPage({
            title: "Link no longer valid",
            body: msg,
            tone: "error",
          }),
        );
    }

    // Fire-and-forget the welcome email + admin "now confirmed" ping.
    if (!result.alreadyConfirmed) {
      const sub = result.record;
      const unsubscribeUrl = `${PUBLIC_SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`;
      try {
        const MAIL_FROM = requireEnv("MAIL_FROM");
        const MAIL_TO = requireEnv("MAIL_TO");
        const transporter = createTransporter();

        transporter
          .sendMail({
            from: MAIL_FROM,
            to: sub.email,
            subject: "Welcome to the Biznet Consulting newsletter",
            text: buildWelcomeText({ unsubscribeUrl }),
            html: buildWelcomeHtml({ unsubscribeUrl }),
            headers: {
              "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${COMPANY.email}?subject=unsubscribe>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          })
          .catch((err) =>
            console.error(
              "Welcome email after confirm failed:",
              err?.message || err,
            ),
          );

        transporter
          .sendMail({
            from: MAIL_FROM,
            to: MAIL_TO,
            subject: `Newsletter — confirmed: ${sub.email}`,
            text: [
              "A subscriber confirmed their email.",
              "",
              `Email: ${sub.email}`,
              `Confirmed at: ${sub.confirmedAt}`,
            ].join("\n"),
          })
          .catch(() => {});
      } catch (e) {
        console.error("Transporter setup failed on confirm:", e?.message || e);
      }
    }

    return res.type("html").send(
      buildResultPage({
        title: result.alreadyConfirmed
          ? "Already confirmed"
          : "Subscription confirmed",
        body: result.alreadyConfirmed
          ? "Your subscription was already active. You'll keep receiving our updates."
          : "Thank you for confirming. You're now subscribed to insights, releases, and announcements from Biznet Consulting.",
        tone: "success",
      }),
    );
  } catch (err) {
    console.error("GET /api/newsletter/confirm failed:", err?.message || err);
    return res
      .status(500)
      .type("html")
      .send(
        buildResultPage({
          title: "Something went wrong",
          body: "We couldn't confirm your subscription right now. Please try again in a moment.",
          tone: "error",
        }),
      );
  }
});

// Unsubscribe (GET — link clicks from emails).
app.get("/api/newsletter/unsubscribe", async (req, res) => {
  const token = sanitizeText(req.query?.token, 200);
  if (!token) {
    return res
      .status(400)
      .type("html")
      .send(
        buildResultPage({
          title: "Invalid link",
          body: "This unsubscribe link is missing its token.",
          tone: "error",
        }),
      );
  }
  try {
    const result = await unsubscribeByToken(token);
    if (!result.ok) {
      return res
        .status(400)
        .type("html")
        .send(
          buildResultPage({
            title: "Link no longer valid",
            body: "This unsubscribe link is invalid or has already been used.",
            tone: "error",
          }),
        );
    }
    return res.type("html").send(
      buildResultPage({
        title: result.alreadyUnsubscribed
          ? "Already unsubscribed"
          : "You've been unsubscribed",
        body: result.alreadyUnsubscribed
          ? "This address was already unsubscribed from our newsletter."
          : "You will no longer receive newsletter emails from Biznet Consulting. We're sorry to see you go.",
        tone: "success",
      }),
    );
  } catch (err) {
    console.error(
      "GET /api/newsletter/unsubscribe failed:",
      err?.message || err,
    );
    return res
      .status(500)
      .type("html")
      .send(
        buildResultPage({
          title: "Something went wrong",
          body: "We couldn't process the unsubscribe right now. Please try again in a moment.",
          tone: "error",
        }),
      );
  }
});

// RFC 8058 one-click unsubscribe: MUAs POST with no body to the URL from
// the List-Unsubscribe header when "List-Unsubscribe-Post" is present.
app.post("/api/newsletter/unsubscribe", async (req, res) => {
  const token =
    sanitizeText(req.query?.token, 200) ||
    sanitizeText(req.body?.token, 200);
  if (!token) return res.status(400).json({ ok: false });
  try {
    await unsubscribeByToken(token);
    return res.json({ ok: true });
  } catch (err) {
    console.error(
      "POST /api/newsletter/unsubscribe failed:",
      err?.message || err,
    );
    return res.status(500).json({ ok: false });
  }
});

function buildConfirmText({ confirmUrl, unsubscribeUrl }) {
  return [
    "Please confirm your subscription to the Biznet Consulting newsletter.",
    "",
    "Click the link below to confirm:",
    confirmUrl,
    "",
    "If you didn't request this, you can ignore this email — we won't add you to our list.",
    "",
    "Consent recorded:",
    CONSENT_TEXT,
    "",
    `— ${COMPANY.name}`,
    COMPANY.address,
    `${COMPANY.email} · ${COMPANY.phone}`,
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
}

function buildConfirmHtml({ confirmUrl, unsubscribeUrl }) {
  return wrapEmailHtml({
    eyebrow: "Please confirm",
    heading: `One more <span style="color:#5aa9d6;font-style:italic;">step.</span>`,
    body: `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#b6c8d9;">Please confirm your subscription to the Biznet Consulting newsletter. We use double opt-in to keep our list clean and compliant with UAE PDPL.</p>
      <p style="margin:0 0 28px;font-size:15px;line-height:1.75;color:#b6c8d9;">Click the button below to confirm:</p>
      <p style="margin:0 0 28px;text-align:left;">
        <a href="${confirmUrl}" style="display:inline-block;background:#d3ad49;color:#06101c;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:700;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;">Confirm subscription &rarr;</a>
      </p>
      <p style="margin:0 0 16px;font-size:13px;line-height:1.7;color:#7C878E;">If the button doesn't work, paste this link into your browser:<br/>
        <a href="${confirmUrl}" style="color:#5aa9d6;word-break:break-all;">${confirmUrl}</a>
      </p>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#7C878E;">If you didn't request this, you can ignore this email &mdash; you won't be added to our list.</p>
    `,
    unsubscribeUrl,
  });
}

function buildWelcomeText({ unsubscribeUrl }) {
  return [
    "Thank you for confirming your subscription to the Biznet Consulting newsletter.",
    "",
    "You'll be among the first to receive project insights, releases, and announcements from our team.",
    "",
    `— ${COMPANY.name}`,
    COMPANY.address,
    `${COMPANY.email} · ${COMPANY.phone}`,
    "",
    `Unsubscribe at any time: ${unsubscribeUrl}`,
  ].join("\n");
}

function buildWelcomeHtml({ unsubscribeUrl }) {
  return wrapEmailHtml({
    eyebrow: "Newsletter",
    heading: `Welcome to <span style="color:#5aa9d6;font-style:italic;">Biznet.</span>`,
    body: `
      <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#b6c8d9;">Thank you for confirming. You'll be among the first to receive project insights, releases, and announcements from our team.</p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#b6c8d9;">Great projects are not created by chance &mdash; they are constructed through vision, structure, and decisive execution. We're glad to have you along.</p>
    `,
    unsubscribeUrl,
  });
}

function wrapEmailHtml({ eyebrow, heading, body, unsubscribeUrl }) {
  const year = new Date().getFullYear();
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#020812;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#eef3f8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#020812;padding:48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:linear-gradient(135deg,rgba(14,65,116,0.35) 0%,rgba(56,73,103,0.18) 100%);border:1px solid rgba(255,255,255,0.10);border-radius:12px;padding:40px 36px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.42em;text-transform:uppercase;color:#d3ad49;">${eyebrow}</p>
                <h1 style="margin:0 0 20px;font-size:28px;line-height:1.25;font-weight:300;color:#eef3f8;">${heading}</h1>
                ${body}
                <div style="height:1px;background:rgba(255,255,255,0.12);margin:28px 0;"></div>
                <p style="margin:0 0 8px;font-size:12px;line-height:1.7;color:#7C878E;letter-spacing:0.04em;">
                  ${COMPANY.name}<br/>
                  ${COMPANY.address}<br/>
                  <a href="mailto:${COMPANY.email}" style="color:#d3ad49;text-decoration:none;">${COMPANY.email}</a> &middot; ${COMPANY.phone}
                </p>
                <p style="margin:12px 0 0;font-size:11px;line-height:1.7;color:#7C878E;">
                  You're receiving this because you subscribed at ${PUBLIC_SITE_URL}. &copy; ${year} ${COMPANY.name}.<br/>
                  <a href="${unsubscribeUrl}" style="color:#7C878E;text-decoration:underline;">Unsubscribe</a> &nbsp;&middot;&nbsp;
                  <a href="${PUBLIC_SITE_URL}/privacy-policy" style="color:#7C878E;text-decoration:underline;">Privacy</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildResultPage({ title, body, tone }) {
  const accent = tone === "success" ? "#5aa9d6" : "#d3ad49";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title} — ${COMPANY.name}</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;background:#020812;color:#eef3f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px}
  .card{max-width:520px;width:100%;background:linear-gradient(135deg,rgba(14,65,116,0.35) 0%,rgba(56,73,103,0.18) 100%);border:1px solid rgba(255,255,255,0.10);border-radius:12px;padding:44px 36px;text-align:center}
  .eyebrow{font-size:11px;letter-spacing:0.42em;text-transform:uppercase;color:${accent};margin:0 0 12px}
  h1{font-weight:300;font-size:32px;line-height:1.2;margin:0 0 16px}
  p{font-size:15px;line-height:1.75;color:#b6c8d9;margin:0 0 12px}
  a.btn{display:inline-block;margin-top:18px;background:#d3ad49;color:#06101c;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:700;font-size:11px;letter-spacing:0.22em;text-transform:uppercase}
  .meta{margin-top:28px;font-size:11px;color:#7C878E}
</style>
</head>
<body>
  <div class="card">
    <p class="eyebrow">${tone === "success" ? "Confirmed" : "Notice"}</p>
    <h1>${title}</h1>
    <p>${body}</p>
    <a class="btn" href="${PUBLIC_SITE_URL}">Return to ${COMPANY.name} &rarr;</a>
    <p class="meta">${COMPANY.name} &middot; ${COMPANY.address}</p>
  </div>
</body>
</html>`;
}

// Admin: retrieve the subscriber list. Protected by a bearer token in
// the Authorization header (NEWSLETTER_API_KEY env var).
function requireAdmin(req, res) {
  const expected = process.env.NEWSLETTER_API_KEY;
  if (!expected) {
    res.status(503).json({
      ok: false,
      error: "Admin endpoint not configured (NEWSLETTER_API_KEY missing).",
    });
    return false;
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (token !== expected) {
    res.status(401).json({ ok: false, error: "Unauthorized." });
    return false;
  }
  return true;
}

function summarize(list) {
  const counts = { pending: 0, confirmed: 0, unsubscribed: 0, total: list.length };
  for (const s of list) {
    if (counts[s.status] !== undefined) counts[s.status]++;
  }
  return counts;
}

// Strip token secrets from records before returning to admin/exports.
function redact(s) {
  const { confirmToken, unsubscribeToken, ...rest } = s;
  return rest;
}

app.get("/api/subscribers", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const list = await readSubscribers();
    const status = sanitizeText(req.query?.status, 20).toLowerCase();
    const filtered = status
      ? list.filter((s) => s.status === status)
      : list;
    res.json({
      ok: true,
      stats: summarize(list),
      count: filtered.length,
      subscribers: filtered.map(redact),
    });
  } catch (err) {
    console.error("GET /api/subscribers failed:", err?.message || err);
    res.status(500).json({ ok: false, error: "Failed to read subscribers." });
  }
});

app.get("/api/subscribers.csv", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const list = await readSubscribers();
    const status = sanitizeText(req.query?.status, 20).toLowerCase();
    // For a newsletter send, callers almost always want only confirmed
    // addresses. Default to confirmed; pass ?status=all (or any other)
    // to override.
    const filtered =
      !status || status === "confirmed"
        ? list.filter((s) => s.status === "confirmed")
        : status === "all"
          ? list
          : list.filter((s) => s.status === status);

    const escape = (v) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = [
      "email",
      "status",
      "requestedAt",
      "confirmedAt",
      "unsubscribedAt",
      "ip",
      "userAgent",
      "consentText",
      "consentSource",
      "consentPage",
    ];
    const lines = [header.join(",")];
    for (const s of filtered) {
      lines.push(
        [
          s.email,
          s.status,
          s.requestedAt,
          s.confirmedAt,
          s.unsubscribedAt,
          s.ip,
          s.userAgent,
          s.consent?.text,
          s.consent?.source,
          s.consent?.page,
        ]
          .map(escape)
          .join(","),
      );
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="subscribers.csv"',
    );
    res.send(lines.join("\n"));
  } catch (err) {
    console.error("GET /api/subscribers.csv failed:", err?.message || err);
    res.status(500).send("Failed to read subscribers.");
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

