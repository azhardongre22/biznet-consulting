// Canonical Biznet copy for the homepage, fitted into the editorial design.
// Service names and scope follow the official Biznet Consulting profile.
// Hrefs verified against the app router (App.jsx); services link to their
// clean service URLs (SERVICE_SECTIONS / servicePath).
// No invented project names, clients, metrics or testimonials.

import { IMG } from "./images";
import { PATHS, SERVICE_SECTIONS, servicePath } from "../../data/seoData";
import {
  PROJECT_CATEGORIES,
  projectCategoryPath,
} from "../../data/projectsData";

export const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "News & Insights", to: "/news-and-insights" },
  { label: "Contact", to: "/contact" },
];

export const HERO = {
  eyebrow: "",
  description:
    "From assessing opportunities to overseeing execution, Biznet Consulting brings feasibility studies, project development and project management together to guide projects from concept to completion.",
  services: SERVICE_SECTIONS.map((s) => ({
    label: s.title,
    to: servicePath(s.id),
  })),
  cta: { label: "Start a Conversation", to: "/contact" },
  image: IMG.heroDubai,
  imageAlt: "Dubai skyline illuminated at blue hour with high-rise buildings",
};

export const ABOUT = {
  eyebrow: "About Us",
  heading: "A Clear Direction for Every Project.",
  paragraphs: [
    "Every development begins with decisions that shape its outcome. Biznet Consulting works with investors, developers, landowners and private clients to evaluate opportunities, establish project direction and maintain oversight through key stages of development.",
  ],
  cta: { label: "Discover Biznet", to: "/about" },
  image: IMG.aboutConstruction,
  imageAlt: "Building under construction with cranes in Dubai",
};

export const PROCESS = {
  eyebrow: "How We Work",
  heading: "The Right Decisions, at the Right Stage.",
  items: [
    {
      number: "01",
      label: "Assess",
      description:
        "Understand the opportunity, objectives and project requirements.",
    },
    {
      number: "02",
      label: "Evaluate",
      description:
        "Examine feasibility, development options, costs and projected returns.",
    },
    {
      number: "03",
      label: "Define",
      description:
        "Establish project priorities, planning requirements and the route to execution.",
    },
    {
      number: "04",
      label: "Monitor",
      description: "Track progress, expenditure, timelines and key milestones.",
    },
  ],
};

// Concise services — each card links to its clean service URL.
export const SERVICES = {
  eyebrow: "What We Do",
  heading: "Our Services",
  intro:
    "Our services address the essential stages of a project, from evaluating its potential to maintaining control throughout execution.",
  cta: { label: "Explore All Services", to: "/services" },
  items: SERVICE_SECTIONS.map((s, i) => ({
    number: `0${i + 1}`,
    title: s.title,
    summary: s.summary,
    cta: s.cta,
    to: servicePath(s.id),
  })),
};

// Project TYPES — the three /projects categories (real project covers,
// deep-linking to their section).
const categoryCard = (id, summary) => {
  const c = PROJECT_CATEGORIES.find((cat) => cat.id === id);
  return {
    id,
    title: c.title,
    summary,
    image: c.cover.image,
    imageAlt: c.cover.alt,
    focus: c.cover.focus,
    to: projectCategoryPath(id),
  };
};

export const PROJECTS = {
  eyebrow: "Our Projects",
  heading: "Diverse Project Portfolio",
  intro:
    "Our work spans a range of development types, with each engagement shaped by its objectives, requirements and stage of progress.",
  cta: { label: "View All Projects", to: PATHS.projects },
  items: [
    {
      ...categoryCard(
        "residential-buildings",
        "Development planning and execution monitoring for residential projects.",
      ),
      title: "Residential Developments",
    },
    categoryCard(
      "commercial-industrial",
      "Planning and feasibility assessment for commercial and mixed-use opportunities.",
    ),
    categoryCard(
      "private-villas",
      "Project management for private construction (family residencies), from approvals through handover.",
    ),
  ],
};

export const CREDIBILITY = {
  eyebrow: "Who We Work With",
  heading: "Working Around Your Objectives",
  body: "Partners across your development journey",
  audiences: [
    {
      name: "Investors",
      description:
        "Assess development opportunities, financial viability and projected returns.",
    },
    {
      name: "Developers",
      description:
        "Establish project direction and maintain execution oversight.",
    },
    {
      name: "Landowners",
      description:
        "Evaluate land potential and identify suitable development options.",
    },
    {
      name: "Private Clients",
      description:
        "Maintain visibility over residential construction, progress and key decisions.",
    },
  ],
};

export const CLIENTS = {
  eyebrow: "Our Clients & Partners",
  heading: "Relationships Built on Trust.",
  body: "Trusted by clients and partners across real estate, investment and business development.",
};

export const INSIGHTS = {
  eyebrow: "News & Insights",
  heading: "Shaping Development",
  description:
    "Explore perspectives on development planning, feasibility, investment decisions and project delivery across the UAE.",
  cta: { label: "Explore All Articles", to: "/news-and-insights" },
};

export const FAQS = [
  {
    q: "What does Biznet Consulting do?",
    a: "Biznet Consulting is a UAE-based real estate development consultancy specialising in feasibility studies, project development and project management across residential, commercial & mixed-use developments.",
  },
  {
    q: "Where does Biznet operate?",
    a: "Biznet is based in Dubai, UAE, and works with investors, developers, landowners and private clients on development and construction projects.",
  },
  {
    q: "What is included in a feasibility study?",
    a: "Depending on the project scope, a feasibility study can cover highest and best use analysis, market assessment, financial modelling, cost and revenue projections, and investment return analysis.",
  },
  {
    q: "Does Biznet manage private construction projects?",
    a: "Yes. Private project management services can cover approvals, consultant and contractor coordination, construction monitoring, progress reporting and handover.",
  },
  {
    q: "When should I engage a development consultancy?",
    a: "Early involvement can help clarify project requirements, assess viability and establish a suitable direction before major commitments are made.",
  },
  {
    q: "How can I enquire about Biznet's services?",
    a: "Contact Biznet with an outline of your project, its current stage and your requirements to begin a conversation about the relevant services.",
  },
];

export const SOCIAL_CLOSING = {
  socialHeading: "Let's get Social",
  closingHeading: "Have a Project in Mind?",
  description:
    "Whether you are evaluating an opportunity, planning a development or overseeing construction, start by defining what your project needs next.",
  cta: { label: "Start a Conversation", to: "/contact" },
};
