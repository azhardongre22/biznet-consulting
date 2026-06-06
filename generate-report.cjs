/* eslint-disable */
// One-off generator for the Arabic website change report.
// Run: node generate-report.cjs
const fs = require("fs");
const path = require("path");

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  LevelFormat,
  PageNumber,
  Header,
  Footer,
} = require("docx");

// ---------- Helpers --------------------------------------------------------

const ACCENT = "0E4174"; // Biznet brand blue
const MUTED = "5F6F7A";
const SOFT_BG = "EEF3F8";
const BORDER = "D5DCE4";

const cellBorder = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: BORDER,
};
const cellBorders = {
  top: cellBorder,
  bottom: cellBorder,
  left: cellBorder,
  right: cellBorder,
};

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, color: ACCENT })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        italics: !!opts.italic,
        bold: !!opts.bold,
        color: opts.color,
      }),
    ],
  });
}

// Multi-run paragraph
function pp(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: opts.align || AlignmentType.LEFT,
    children: runs.map((r) =>
      typeof r === "string"
        ? new TextRun(r)
        : new TextRun({
            text: r.text,
            bold: !!r.bold,
            italics: !!r.italic,
            color: r.color,
            font: r.font,
          })
    ),
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 60 },
    children: [new TextRun(text)],
  });
}

function spacer() {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun(" ")],
  });
}

// Cell with optional shading and Arabic flag (right-align + RTL run)
function cell(content, opts = {}) {
  const text = typeof content === "string" ? content : "";
  const para = new Paragraph({
    alignment: opts.arabic ? AlignmentType.RIGHT : AlignmentType.LEFT,
    bidirectional: !!opts.arabic,
    children: [
      new TextRun({
        text,
        bold: !!opts.bold,
        color: opts.color,
        rightToLeft: !!opts.arabic,
        font: opts.font,
      }),
    ],
  });

  return new TableCell({
    borders: cellBorders,
    width: { size: opts.width, type: WidthType.DXA },
    shading: opts.shade
      ? { fill: opts.shade, type: ShadingType.CLEAR, color: "auto" }
      : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [para],
  });
}

// 3-column table: Item | Before | After
function diffTable(rows) {
  const W_ITEM = 2600;
  const W_BEFORE = 3380;
  const W_AFTER = 3380;
  const total = W_ITEM + W_BEFORE + W_AFTER;

  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: [W_ITEM, W_BEFORE, W_AFTER],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell("Item", { width: W_ITEM, bold: true, shade: SOFT_BG }),
          cell("Before", { width: W_BEFORE, bold: true, shade: SOFT_BG }),
          cell("After", { width: W_AFTER, bold: true, shade: SOFT_BG }),
        ],
      }),
      ...rows.map(
        (r) =>
          new TableRow({
            children: [
              cell(r.item, { width: W_ITEM }),
              cell(r.before, { width: W_BEFORE, arabic: !!r.beforeAr }),
              cell(r.after, { width: W_AFTER, arabic: !!r.afterAr }),
            ],
          })
      ),
    ],
  });
}

// 2-column status table: Item | Status
function statusTable(rows) {
  const W_ITEM = 6360;
  const W_STATUS = 3000;
  const total = W_ITEM + W_STATUS;

  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: [W_ITEM, W_STATUS],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell("Item", { width: W_ITEM, bold: true, shade: SOFT_BG }),
          cell("Status", { width: W_STATUS, bold: true, shade: SOFT_BG }),
        ],
      }),
      ...rows.map(
        (r) =>
          new TableRow({
            children: [
              cell(r.item, { width: W_ITEM }),
              cell(r.status, {
                width: W_STATUS,
                color: r.status.startsWith("Done") ? "1F7A3D" : "9C5A1C",
                bold: true,
              }),
            ],
          })
      ),
    ],
  });
}

// ---------- Document body --------------------------------------------------

const children = [];

// Title block
children.push(
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: "Biznet Consulting",
        bold: true,
        size: 28,
        color: MUTED,
      }),
    ],
  })
);
children.push(
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: "Arabic Website — Change Report",
        bold: true,
        size: 44,
        color: ACCENT,
      }),
    ],
  })
);
children.push(
  pp(
    [
      { text: "Project: ", bold: true, color: MUTED },
      "Biznet-Phase 1   ",
      { text: "Date: ", bold: true, color: MUTED },
      new Date().toISOString().slice(0, 10),
    ]
  )
);
children.push(spacer());

// Executive summary
children.push(h1("1. Executive Summary"));
children.push(
  p(
    "This report documents the Arabic-language fixes applied to the Biznet Consulting marketing site in response to stakeholder feedback. Changes span three areas: (a) Arabic copy corrections including formal-MSA register, hamza diacritics, punctuation, and word-order fixes; (b) layout / direction handling so the site flows right-to-left in Arabic while keeping a small set of visual elements LTR by design; and (c) a small number of structural changes (Contact form simplified to Name / Email / Message; CeoMessageLanding page made English-only)."
  )
);
children.push(
  p(
    "Every text change was verified against the current state of src/i18n/translations.js. Layout changes were verified against the live component source. The project builds cleanly (npx vite build, 0 errors)."
  )
);

// Files touched
children.push(h1("2. Files Touched"));
[
  "src/i18n/translations.js — All Arabic copy edits + Contact-form translation keys",
  "src/i18n/LanguageContext.jsx — Re-enabled RTL for Arabic",
  "src/components/WhoWeAreSection.jsx — Restored RTL word swap on slides 2 and 3",
  "src/components/ExploreGrid.jsx — Right-aligned card content in Arabic",
  "src/components/Navbar.jsx — Forced LTR on the nav itself; numbers move to the right in Arabic menu",
  "src/components/SuccessStories.jsx — Forced LTR on the milestone marquee",
  "src/components/Footer.jsx — Right-aligned newsletter + contact blocks; phones/email wrapped dir=\"ltr\"",
  "src/components/CEOMessage.jsx — Brightness/contrast filter added to the portrait",
  "src/pages/ContactUsPage.jsx — Reduced form to Name / Email / Message; right-aligned in Arabic",
  "src/pages/CeoMessageLanding.jsx — Removed language context; page is now English-only",
].forEach((line) => children.push(bullet(line)));
children.push(spacer());

// ----- General feedback ---------------------------------------------------
children.push(h1("3. General Feedback"));

children.push(
  statusTable([
    {
      item: "Language consistency — formal Arabic (MSA) throughout",
      status: "Done",
    },
    {
      item: "Arabic text aligned right-to-left (document dir=\"rtl\" when ar)",
      status: "Done",
    },
    {
      item: "Periods at end of sentences (slide 3 reflowed; legacy/upcoming reflowed)",
      status: "Done",
    },
    {
      item: "Contact-form fields reordered to Name, Email, Message — right-aligned",
      status: "Done",
    },
    {
      item: "Font consistency review",
      status: "Pending input",
    },
  ])
);
children.push(spacer());
children.push(
  p(
    "Font consistency: no font swaps were made in this round; the existing font stack (Ivy Presto / Aktiv Grotesk) is shared between English and Arabic. If specific elements still read inconsistently in Arabic, please flag the element so we can target it.",
    { italic: true, color: MUTED }
  )
);

// ----- Section-by-section text changes -----------------------------------
children.push(h1("4. Section-by-Section Copy Changes"));

children.push(h2("4.1  \"Who We Are\" Section (منو نحن → من نحن)"));
children.push(
  diffTable([
    {
      item: "Slide 1 discover label",
      before: "منو نحن",
      beforeAr: true,
      after: "من نحن",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.2  \"What We Do\" Section (ماذا نفعل → ماذا نعمل)"));
children.push(
  diffTable([
    {
      item: "Slide 3 rightWord",
      before: "نفعل",
      beforeAr: true,
      after: "نعمل",
      afterAr: true,
    },
    {
      item: "Slide 3 discover label",
      before: "ماذا نفعل؟",
      beforeAr: true,
      after: "ماذا نعمل؟",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.3  \"Our Scope of Work\" Paragraph (مجال عملنا)"));
children.push(
  diffTable([
    {
      item: "Closing clause",
      before: "…ونصقل التوجُّه، ونتّخذ القرارات بثقةٍ محسوبة.",
      beforeAr: true,
      after: "…ونصقل المهارات، ونتّخذ القرارات بثقةٍ محسوبة.",
      afterAr: true,
    },
    {
      item: "(bonus) hamza on الاستراتيجية",
      before: "نجمع بين الاستراتيجية…",
      beforeAr: true,
      after: "نجمع بين الإستراتيجية…",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.4  \"What We Do\" Paragraph (ماذا نعمل)"));
children.push(
  diffTable([
    {
      item: "Opening sentence — period → comma",
      before: "نحوّل الطموح إلى واقع. من تطوير…",
      beforeAr: true,
      after: "نحوّل الطموح إلى واقع، من تطوير…",
      afterAr: true,
    },
    {
      item: "Comma after السكنية removed",
      before: "…المشاريع التجارية والسكنية، إلى العلامة…",
      beforeAr: true,
      after: "…المشاريع التجارية والسكنية إلى العلامة…",
      afterAr: true,
    },
    {
      item: "Re-worded تربط بيزنت clause",
      before: "…تربط بِيزنت بين الاستراتيجية والتنفيذ…",
      beforeAr: true,
      after: "…بِيزنت تربط بين الإستراتيجية والتنفيذ…",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.5  \"A Tour in Biznet\" (جولة في بيزنت)"));
children.push(
  diffTable([
    {
      item: "Department names removed from lead",
      before: "جولة في بِيزنت — المشاريع، والخدمات، والرؤى، وأبرز ما يُكتب عنها.",
      beforeAr: true,
      after: "جولة في بِيزنت.",
      afterAr: true,
    },
    {
      item: "Card order: Services first, Projects second",
      before: "01 أحدث المشاريع / 02 خدماتنا",
      beforeAr: true,
      after: "01 خدماتنا / 02 أحدث المشاريع",
      afterAr: true,
    },
    {
      item: "Hamza on الاستشارات (services-related copy)",
      before: "خدمات استشارية…  /  بِيزنت للاستشارات",
      beforeAr: true,
      after: "خدمات إستشارية…  /  بِيزنت للإستشارات",
      afterAr: true,
    },
    {
      item: "Hamza on الاشتراك (subscribe / consent copy)",
      before: "جارٍ الاشتراك  /  إلغاء الاشتراك  /  تمّ اشتراكك",
      beforeAr: true,
      after: "جارٍ الإشتراك  /  إلغاء الإشتراك  /  تمّ إشتراكك",
      afterAr: true,
    },
    {
      item: "Consent voice — يمكنني → يمكنك",
      before: "…ويمكنني إلغاء الاشتراك…",
      beforeAr: true,
      after: "…ويمكنك إلغاء الإشتراك…",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.6  Newsletter (النشرة الإخبارية)"));
children.push(
  diffTable([
    {
      item: "رؤى → رؤية, drop و before الإصدارات",
      before: "اشترك لتصلك رؤى المشاريع، والإصدارات، والإعلانات.",
      beforeAr: true,
      after: "اشترك لتصلك رؤية المشاريع، الإصدارات، والإعلانات.",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.7  Our Services (خدماتنا)"));
children.push(
  diffTable([
    {
      item: "Hamza on استشارية",
      before: "خدمات استشارية متكاملة",
      beforeAr: true,
      after: "خدمات إستشارية متكاملة",
      afterAr: true,
    },
    {
      item: "المشاريع المتينة → المشاريع القوية",
      before: "تحتاج المشاريع المتينة إلى أساسٍ سليم.",
      beforeAr: true,
      after: "تحتاج المشاريع القوية إلى أساسٍ سليم.",
      afterAr: true,
    },
    {
      item: "Branding & Positioning slide rewording",
      before: "نُدرك كيف ينبغي أن يُسمَّى، ويُموضَع، ويُقدَّم، ويُتواصَل بشأنه",
      beforeAr: true,
      after: "نعرف كيف ينبغي أن يُسمَّى، ويتموضع، ويتقدّم، ونتواصل بشأنه",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.8  Legacy in Progress (إرث قيد التشكُّل)"));
children.push(
  diffTable([
    {
      item: "تخطيط متأنٍّ → تخطيط متأني",
      before: "وتخطيطٍ متأنٍّ، ورؤيةٍ بعيدة المدى",
      beforeAr: true,
      after: "وتخطيطٍ متأني، ورؤيةٍ بعيدة المدى",
      afterAr: true,
    },
    {
      item: "Same fix in upcoming projects p2",
      before: "بتخطيطٍ متأنٍّ، وفهمٍ عميق للسوق",
      beforeAr: true,
      after: "بتخطيطٍ متأني، وفهمٍ عميق للسوق",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.9  Press Releases (البيانات الصحفية)"));
children.push(
  diffTable([
    {
      item: "لتصلك → ليصلك",
      before: "انضمّ إلى القائمة لتصلك كلّ جديدٍ فور نشره.",
      beforeAr: true,
      after: "انضمّ إلى القائمة ليصلك كلّ جديدٍ فور نشره.",
      afterAr: true,
    },
  ])
);
children.push(spacer());

children.push(h2("4.10  The Visionary (صاحب الرؤية)"));
children.push(
  diffTable([
    {
      item: "Shadda removed from Al Hammadi",
      before: "إسماعيل الحمّادي",
      beforeAr: true,
      after: "إسماعيل الحمادي",
      afterAr: true,
    },
    {
      item: "Portrait too dark — brightness boost",
      before: "<img className=\"… saturate-[0.9] …\" />",
      after: "<img style={{ filter: 'brightness(1.18) contrast(1.04)' }} … />",
    },
    {
      item: "Text direction RTL in Arabic",
      before: "<html dir=\"ltr\"> hard-coded",
      after: "<html dir=\"rtl\"> when language === \"ar\"",
    },
  ])
);
children.push(spacer());

// ----- Layout / direction --------------------------------------------------
children.push(h1("5. Layout & Direction Handling"));

children.push(h2("5.1  Document-level RTL"));
children.push(
  p(
    "LanguageContext.jsx now derives dir from the active language and writes it to <html> via useEffect. The previous build had dir hard-coded to ltr regardless of language."
  )
);

children.push(h2("5.2  Sections kept LTR by design"));
children.push(
  statusTable([
    {
      item: "Navbar (logo, burger, EN/AR pill, menu pills) — locked LTR",
      status: "Done",
    },
    {
      item: "WhoWeAre slide 1 — brand wordmark BIZNESS NETWORK stays LTR",
      status: "Done",
    },
    {
      item: "SuccessStories marquee — image carousel stays LTR",
      status: "Done",
    },
    {
      item: "Phone numbers / email — wrapped in dir=\"ltr\" so + and digits render correctly",
      status: "Done",
    },
  ])
);
children.push(spacer());

children.push(h2("5.3  Sections that flip to RTL in Arabic"));
children.push(
  statusTable([
    {
      item: "WhoWeAre slides 2 & 3 — heading words swap so reading order is ماذا نعمل (right-to-left)",
      status: "Done",
    },
    {
      item: "ExploreGrid card content — heading, body, Discover button right-aligned; index marker and accent bar move to the right edge",
      status: "Done",
    },
    {
      item: "Navbar menu numbers (01–04) — move from left-4 to right-4 in Arabic",
      status: "Done",
    },
    {
      item: "Footer newsletter + contact blocks — eyebrows, body copy, inputs, consent label right-aligned",
      status: "Done",
    },
    {
      item: "ContactUsPage — left column copy and the form (Name / Email / Message) right-aligned",
      status: "Done",
    },
  ])
);
children.push(spacer());

// ----- Structural ----------------------------------------------------------
children.push(h1("6. Structural Changes"));

children.push(h3("6.1  Contact form simplified"));
children.push(
  p(
    "ContactUsPage.jsx previously had five fields: First Name, Last Name, Email, Phone Number, Message. Per the spec it now has three: Name, Email, Message. State shape, validation function, and translation keys were all updated in lockstep. The footer's contact form was already three-field and is now single-column for both languages."
  )
);

children.push(h3("6.2  CeoMessageLanding made English-only"));
children.push(
  p(
    "src/pages/CeoMessageLanding.jsx no longer reads from the language context. The useLanguage import was removed and all t(\"…\") calls were replaced with a local CEO_LANDING_COPY object holding the English strings (eyebrow, quote, ceoName, ceoTitle, newsletter, emailPlaceholder, consent, ok, consentRequired). The page no longer switches when the user toggles Arabic site-wide."
  )
);

children.push(h3("6.3  Translation key rename"));
children.push(
  p(
    "contactPage keys firstName / lastName / phone (and their error counterparts) were removed; a single name key plus errors.nameRequired was added in both English and Arabic blocks. A grep confirmed no other component references the removed keys."
  )
);

// ----- Items not addressed ------------------------------------------------
children.push(h1("7. Items Not Addressed in This Round"));
children.push(
  statusTable([
    {
      item: "Font consistency — no font swaps were performed; flag specific elements if needed",
      status: "Pending input",
    },
    {
      item: "Address line — still hard-coded English (\"Oud Metha Offices Building, Office 324\") in both EN and AR translations",
      status: "Pending decision",
    },
    {
      item: "CEO portrait brightness — set to 1.18; bump to 1.25 if it still reads dark",
      status: "Pending review",
    },
  ])
);
children.push(spacer());

// ----- Verification -------------------------------------------------------
children.push(h1("8. Verification"));
[
  "All Arabic strings verified against the current src/i18n/translations.js (lines 733–1140).",
  "No stale references to removed translation keys (grep for contactPage.firstName / lastName / phone returned no matches).",
  "Project builds cleanly: npx vite build → ✓ built (0 errors, only chunk-size and eval warnings from third-party libs).",
  "Recommended manual QA: toggle EN/AR and verify (a) navbar stays LTR; (b) slide 3 heading reads ماذا نعمل right-to-left; (c) explore grid card content sits on the right; (d) footer phones still render as +971 52 748 8855; (e) contact page form is single-column Name/Email/Message in both languages.",
].forEach((line) => children.push(bullet(line)));

// ---------- Document assembly --------------------------------------------

const doc = new Document({
  creator: "Biznet Phase 1",
  title: "Biznet Arabic Website — Change Report",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } }, // 11pt
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, color: ACCENT, font: "Calibri" },
        paragraph: {
          spacing: { before: 320, after: 160 },
          outlineLevel: 0,
        },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, color: "1F2A3A", font: "Calibri" },
        paragraph: {
          spacing: { before: 240, after: 120 },
          outlineLevel: 1,
        },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, color: "1F2A3A", font: "Calibri" },
        paragraph: {
          spacing: { before: 200, after: 80 },
          outlineLevel: 2,
        },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: 720, hanging: 360 } },
            },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // US Letter
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Biznet Consulting — Arabic Website Change Report",
                  color: MUTED,
                  size: 18,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", color: MUTED, size: 18 }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  color: MUTED,
                  size: 18,
                }),
                new TextRun({ text: " of ", color: MUTED, size: 18 }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  color: MUTED,
                  size: 18,
                }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

const outPath = path.join(
  __dirname,
  "Biznet-Arabic-Website-Change-Report.docx"
);

Packer.toBuffer(doc)
  .then((buf) => {
    fs.writeFileSync(outPath, buf);
    console.log("Wrote", outPath, "(", buf.length, "bytes )");
  })
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
