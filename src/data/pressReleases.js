// Press release / news data source.
// A single article object powers the listing cards, the hero slider, the
// detail page hero, and the related-articles strip — so the source of truth
// stays here, never in the JSX.
//
// Fields:
//   slug        URL segment under /press-release/:slug
//   title       Card and detail headline
//   excerpt     ~2-sentence summary used on cards and slider
//   category    Short tag shown on the badge ("Advisory", "Leadership", …)
//   date        Human-friendly publication date
//   isoDate     ISO date used for sorting and <time>
//   author      Source/byline ("Biznet Newsroom", "Office of the CEO", …)
//   readTime    "~4 min read"
//   image       Hero/card image (Unsplash, large)
//   imageAlt    Accessible description
//   slideHeading  Optional, slightly punchier headline for the hero slider
//   slideCta      Optional CTA label for the slider button
//   featured     Boolean — appears in the slider + feature row
//   group        "press" | "ceo"  — drives which section it lands in
//   body         Array of paragraph strings, sub-headings ({h: "…"}),
//                pull-quotes ({quote: "…", by: "…"}), and lists ({list: […]})

export const PRESS_RELEASES = [
  {
    slug: "biznet-strengthens-integrated-advisory-uae",
    title:
      "Biznet Consulting strengthens its integrated advisory model across the UAE",
    excerpt:
      "An expanded service framework brings feasibility, planning, positioning and execution under one aligned partner — designed for developers, investors and landowners building for the long term.",
    category: "Corporate News",
    date: "May 28, 2026",
    isoDate: "2026-05-28",
    author: "Biznet Newsroom",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=86",
    imageAlt:
      "Dubai skyline at dusk with the Burj Khalifa rising above the city",
    slideHeading: "Stories worth sharing",
    slideKicker: "Corporate News",
    slideCta: "Read the announcement",
    featured: true,
    group: "press",
    body: [
      "Biznet Consulting has formally expanded its integrated advisory framework — a connected model that links feasibility, planning, positioning and execution under a single aligned partner. The expansion responds to a clear pattern across the UAE market: clients increasingly want a partner that owns the throughline from concept to handover, not a sequence of disconnected vendors.",
      {
        h: "One partner from concept to handover",
      },
      "Under the expanded framework, every engagement begins with a single question: what is this project meant to become? From there, market context, land use, financial feasibility, product relevance, brand narrative, and delivery oversight are aligned to one answer. The result is a project that is understood before it is visited — and a client team that retains decision clarity at every gate.",
      {
        quote:
          "We don't deliver advisory in silos. The strongest decisions are made when feasibility, brand, and execution sit at the same table from day one.",
        by: "Ismail Al Hammadi, Chief Executive Officer",
      },
      {
        h: "Built for developers, investors and landowners",
      },
      "The expanded framework is calibrated for three audiences. Developers gain a connected planning, positioning and execution partner. Investors gain structured feasibility, market entry support and risk-tested modelling. Landowners gain quiet, long-horizon guidance on how their asset is best placed in the market — without rushing it.",
      {
        list: [
          "Feasibility, market sizing and capital structure modelling",
          "Project direction, coordination and execution oversight",
          "Brand, naming, narrative and digital presence",
          "Investment formation and risk-tested decision support",
        ],
      },
      "The framework launches alongside a refreshed Biznet newsroom — the channel readers are on now — through which announcements, recognitions, partnerships and leadership commentary will be published.",
    ],
  },
  {
    slug: "uae-development-outlook-2026",
    title:
      "UAE development outlook 2026: positioning before product, not after",
    excerpt:
      "Why the strongest projects entering the market this year are the ones that defined their identity, audience and narrative before breaking ground.",
    category: "Market Outlook",
    date: "May 14, 2026",
    isoDate: "2026-05-14",
    author: "Biznet Research",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=2000&q=86",
    imageAlt:
      "Dubai Marina towers and waterfront skyline at golden hour",
    slideHeading: "Positioning before product",
    slideKicker: "Market Outlook",
    slideCta: "Read the outlook",
    featured: true,
    group: "press",
    body: [
      "A clear pattern has emerged across the UAE development pipeline in 2026: the projects gaining the strongest early traction are the ones whose positioning was defined before the first masterplan was finalised. Market context, target audience, narrative and identity were treated as inputs to design — not deliverables that arrived after.",
      {
        h: "The cost of late positioning",
      },
      "When positioning is added after a project is built, it can only describe the asset. When it is defined before, it can shape it — the floorplate ratios, the amenity mix, the build quality narrative, even the timing of market entry. The difference between the two compounds across the life of an asset.",
      "Biznet's research across recent UAE launches points to a consistent gap: projects with pre-positioned narratives reach price and absorption targets faster, and require less remediation work post-launch.",
      {
        quote:
          "A project is understood before it is visited. The job of positioning is to make sure that understanding is the one you intended.",
        by: "Biznet Advisory",
      },
      {
        h: "What pre-positioning looks like in practice",
      },
      "Effective pre-positioning is not a marketing exercise. It is a sequence of decisions about what the project is for, who it is for, what it competes with, and what it would never be confused with. Each of those decisions affects design, pricing, sales narrative and stakeholder communication.",
      {
        list: [
          "Defining the project's intended reading before architecture is locked",
          "Mapping audience adjacencies and the competitor set the project will sit against",
          "Setting the narrative the sales team will inherit",
          "Aligning brand, identity and digital presence to that narrative",
        ],
      },
      "The outlook continues to favour disciplined developers and the partners who plan with them — those willing to slow down at the front end to move faster, and more confidently, later.",
    ],
  },
  {
    slug: "biznet-feasibility-framework-2026",
    title:
      "Biznet introduces a structured feasibility framework for investment decisions",
    excerpt:
      "A new internal framework formalises how Biznet pressure-tests assumptions, models scenarios, and turns strong ideas into measured commitments.",
    category: "Feasibility",
    date: "April 22, 2026",
    isoDate: "2026-04-22",
    author: "Biznet Advisory",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2000&q=86",
    imageAlt:
      "Burj Khalifa and Downtown Dubai at twilight, viewed from the boulevard",
    slideHeading: "Decisions, modelled honestly",
    slideKicker: "Feasibility",
    slideCta: "How the framework works",
    featured: true,
    group: "press",
    body: [
      "Biznet has formalised the internal feasibility framework that underpins its advisory work — bringing structure to how assumptions are tested, scenarios are modelled, and recommendations are made. The framework is now applied across every feasibility engagement, from land-use studies to investment formation support.",
      {
        h: "From assumptions to commitments",
      },
      "Most feasibility work fails quietly: the spreadsheet is delivered, the headline IRR looks acceptable, and the underlying assumptions are never revisited. Biznet's framework treats every assumption as an input that must survive challenge — sensitivity analysis, scenario testing, and an honest read on the downside.",
      {
        quote:
          "A feasibility study is not a sales tool. It is a discipline. If it does not change your mind on at least one assumption, it has not done its job.",
        by: "Biznet Advisory",
      },
      {
        h: "What clients see",
      },
      "Each engagement produces a single, plain-language decision document. It explains what was assumed, what was tested, what the model is sensitive to, and what would have to change for the project to underperform. The number is the conclusion, not the report.",
      {
        list: [
          "Assumption-by-assumption pressure testing",
          "Three-scenario modelling with explicit downside read",
          "Capital structure and formation guidance",
          "Plain-language decision document for the principal",
        ],
      },
    ],
  },
  {
    slug: "biznet-brand-strategy-pre-launch",
    title:
      "Brand strategy as a pre-launch discipline: a Biznet field note",
    excerpt:
      "Naming, narrative, identity and digital presence work hardest when they are built around what the project is for — not added once the sales centre opens.",
    category: "Branding",
    date: "April 3, 2026",
    isoDate: "2026-04-03",
    author: "Biznet Brand",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=2000&q=86",
    imageAlt:
      "Sheikh Zayed Grand Mosque in Abu Dhabi at dusk with reflecting pools",
    slideHeading: "Brand built around purpose",
    slideKicker: "Branding",
    slideCta: "Read the field note",
    featured: true,
    group: "press",
    body: [
      "The most useful brand work happens before a project enters the market — when the central question of what the project is for is still being answered. Biznet's brand practice is structured around that window, treating naming, narrative, identity and digital presence as outputs of a clear strategic intent.",
      {
        h: "What pre-launch brand work actually does",
      },
      "It does not invent meaning. It captures the meaning that already exists inside the project's design and intent, and translates it into language and identity that the sales team, the partners and the buyer can all carry.",
      {
        quote:
          "A brand can't fix a project. It can make a good one legible — and legibility is what turns interest into commitment.",
        by: "Biznet Brand",
      },
      {
        h: "The four anchors",
      },
      {
        list: [
          "Naming that reads in two languages and survives translation",
          "Narrative that the sales team can repeat without reading it",
          "Identity that holds up at building scale, not just on a presentation slide",
          "Digital presence that mirrors how buyers actually research",
        ],
      },
      "Done well, the brand work is invisible — buyers describe the project the way the team intended, and the project does not need to over-explain itself.",
    ],
  },
  {
    slug: "biznet-project-management-philosophy",
    title:
      "Project management for outcome, not completion: a Biznet philosophy note",
    excerpt:
      "Why Biznet's project management practice measures success by what the asset becomes — not by whether the schedule was met.",
    category: "Development",
    date: "March 17, 2026",
    isoDate: "2026-03-17",
    author: "Biznet Newsroom",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1580674684089-5c8b0a99cb1c?auto=format&fit=crop&w=2000&q=86",
    imageAlt:
      "Aerial view of Dubai's downtown skyline with the Burj Khalifa centred at sunrise",
    slideHeading: "Outcome, not completion",
    slideKicker: "Development",
    slideCta: "Read the philosophy",
    featured: true,
    group: "press",
    body: [
      "Most project management practices measure success at handover: was it on time, was it on budget, did it meet specification. Biznet's practice measures it later — six months in, when the asset has had time to declare what it actually is. The question is not whether the project was completed. It is whether the project became what it was meant to become.",
      {
        h: "What changes when the bar moves",
      },
      "When the bar moves from completion to outcome, every decision along the way is judged differently. A value engineering call is not just about cost. A scope change is not just about programme. A finish substitution is not just about lead time. Each one is read against the outcome the project is meant to deliver.",
      {
        quote:
          "If the schedule was met but the asset is not what it was meant to be, the project did not finish — it just stopped.",
        by: "Biznet Project Direction",
      },
      {
        h: "How the practice is structured",
      },
      {
        list: [
          "Outcome briefs that travel with the project from day one",
          "Decision logs that record why, not just what",
          "Gate reviews tied to the outcome brief, not the deliverable list",
          "A quiet six-month post-handover read on whether the asset performed as intended",
        ],
      },
    ],
  },
  // CEO / Visionary posts — surfaced in the dedicated CEO Posts grid.
  {
    slug: "ceo-message-build-with-purpose",
    title: "Build with purpose, scale with precision",
    excerpt:
      "A note from our CEO on the discipline behind every Biznet engagement — and why growth is something you create, not chase.",
    category: "From the CEO",
    date: "May 5, 2026",
    isoDate: "2026-05-05",
    author: "Ismail Al Hammadi, CEO",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=2000&q=86",
    imageAlt:
      "Portrait-style executive photograph in a refined office environment",
    group: "ceo",
    body: [
      "At Biznet, we don't chase growth. We create it. The distinction matters. Chasing growth puts the market in the lead — you take what comes. Creating growth puts the project, the asset, the client in the lead — and the market follows what you build.",
      "Our focus is simple: build with purpose, scale with precision, and lead with impact. Each of those words is doing work. Purpose tells us why we start. Precision tells us how we execute. Impact tells us how we judge what we leave behind.",
      {
        quote:
          "The future isn't something we wait for. It's something we shape.",
        by: "Ismail Al Hammadi, CEO",
      },
      "That is the brief I give our team and the standard I ask our partners to hold us to. Everything else — the framework, the discipline, the calm — comes from that.",
    ],
  },
  {
    slug: "ceo-vision-shape-the-future",
    title: "The future isn't something we wait for — we shape it",
    excerpt:
      "On long-horizon thinking, integrated execution, and how the next decade will reward builders who plan deeply.",
    category: "Visionary Voice",
    date: "April 18, 2026",
    isoDate: "2026-04-18",
    author: "Ismail Al Hammadi, CEO",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=86",
    imageAlt:
      "Boardroom in soft natural light, conveying calm and considered leadership",
    group: "ceo",
    body: [
      "The most useful question I ask, in almost every meeting, is the simplest: what is this meant to become? Not in five months. In five years. In fifteen. When the answer is honest, every decision downstream becomes clearer.",
      "The next decade of UAE development will reward builders who plan deeply — who treat positioning, feasibility, brand and execution as one conversation, not four. Fragmented advisory delivers fragmented assets. Integrated advisory delivers assets that age well.",
      {
        quote:
          "The future is built in the decisions we choose to slow down for.",
        by: "Ismail Al Hammadi, CEO",
      },
      "That is the long horizon we plan against — and the work we are honoured to do alongside our clients and partners.",
    ],
  },
  {
    slug: "ceo-lead-with-impact",
    title: "Lead with impact: a discipline, not a slogan",
    excerpt:
      "Why integrated advisory protects long-term value, and how leadership alignment turns ambition into a deliverable outcome.",
    category: "Leadership Note",
    date: "March 11, 2026",
    isoDate: "2026-03-11",
    author: "Ismail Al Hammadi, CEO",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=86",
    imageAlt:
      "Executive in conversation, warm interior light, conveying considered leadership",
    group: "ceo",
    body: [
      "Impact is a word that gets used loosely. We try to use it carefully. For us, impact is what the asset, the client, or the partner is doing twelve months after we have stepped back. Not what they said at handover. What is actually true a year later.",
      "Leading with impact is therefore a discipline. It means designing the engagement so that the right outcome is the most likely outcome — and then staying close enough to make sure it is.",
      {
        quote:
          "Leadership alignment is the cheapest insurance a project can buy — and the most under-used.",
        by: "Ismail Al Hammadi, CEO",
      },
      "That is the standard we hold ourselves to. It is also the standard we ask our clients to hold us to.",
    ],
  },
];

export const PRESS_ARTICLES = PRESS_RELEASES.filter((p) => p.group === "press");
export const CEO_ARTICLES = PRESS_RELEASES.filter((p) => p.group === "ceo");

export function getArticleBySlug(slug) {
  return PRESS_RELEASES.find((p) => p.slug === slug) || null;
}

export function getRelatedArticles(slug, limit = 3) {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  return PRESS_RELEASES.filter(
    (p) => p.slug !== slug && p.group === current.group,
  ).slice(0, limit);
}
