// Single source of truth for Biznet's service divisions.
// Consumed by the service slider (for deep links) and the dedicated
// /services/:slug detail pages.
//
// Positioning: Biznet is an Integrated Real Estate Development & Project
// Advisory Consultancy — sitting between the landowner / developer /
// investor and the consultants, contractors, operators and marketing
// teams needed to deliver a project.

import ServiceBusinessFormation from "../assets/images/optimized/services images/Business formation.webp";
import ServiceLandFeasibility from "../assets/images/optimized/services images/Land feasibility.webp";
import ServiceProjectDevelopment from "../assets/images/optimized/services images/project development.webp";
import ServiceProjectManagement from "../assets/images/optimized/services images/project management.webp";
import ServiceBrandingMarketing from "../assets/images/optimized/services images/branding and marketing.webp";

export const servicesData = [
  {
    slug: "business-company-formation",
    num: "01",
    title: "Business & Company Formation",
    label: "BUSINESS & COMPANY FORMATION",
    tagline: "A clear base for confident business decisions.",
    image: ServiceBusinessFormation,
    intro:
      "Building strong foundations of businesses & company licensing, business feasibility, market evaluation, and investment planning to create a clear base for companies and businesses formulated in the UAE.",
    overview:
      "Biznet covers company formation, market entry, feasibility studies, financial planning, and investment evaluation to create a clear base for confident business and investment decisions.",
    stage: "Where it fits: Business Formation & Market Entry",
    problem:
      "Setting up in the UAE means navigating jurisdictions, licence types, ownership rules and approvals — and the wrong structure quietly costs you in tax, cost and flexibility later.",
    solution:
      "We assess your activity, ownership and objectives, then handle jurisdiction selection, licensing, structuring and investment planning end to end — so the entity is right from day one.",
    offerings: [
      {
        title: "Company & Business Formation",
        text: "End-to-end setup to establish and structure your company in the UAE.",
      },
      {
        title: "Market Entry Planning",
        text: "Market entry planning and opportunity review for a considered route in.",
      },
      {
        title: "Feasibility & Viability",
        text: "Feasibility studies and business viability assessment before you commit.",
      },
      {
        title: "Financial Planning",
        text: "Financial planning that gives the venture a clear, durable base.",
      },
      {
        title: "Investment Evaluation",
        text: "Evaluating investment potential ahead of capital commitment.",
      },
    ],
    sectorsLabel: "Trade licence routes",
    sectors: [
      "Commercial",
      "Professional",
      "Industrial",
      "Tourism",
      "Agricultural",
      "Crafts",
      "E-commerce / e-Trader",
      "Mainland",
      "Free zone",
    ],
    process: [
      { title: "Discovery & Objectives", text: "Understand the venture, ownership and commercial intent." },
      { title: "Jurisdiction & Structure", text: "Select the right jurisdiction, licence and corporate structure." },
      { title: "Licensing & Documentation", text: "Handle registration, approvals and documentation." },
      { title: "Investment Planning", text: "Model the financials and investment approach." },
      { title: "Activation", text: "Banking, visas and operational go-live." },
    ],
    outcome:
      "A compliant, well-structured and investment-ready UAE entity — the foundation for feasibility, development and everything that follows.",
  },
  {
    slug: "feasibility-viability",
    num: "02",
    title: "Feasibility & Viability",
    label: "FEASIBILITY & VIABILITY",
    tagline: "The right direction, defined before execution.",
    image: ServiceLandFeasibility,
    intro:
      "Evaluating opportunities through feasibility studies, market understanding, best-use assessment, and early development planning to define the right direction before execution.",
    overview:
      "Biznet evaluates land, property, and development opportunities through feasibility studies, best-use assessment, market demand, and early planning to define the right concept, audience, unit mix, and execution direction before development begins.",
    stage: "Where it fits: Land / Asset → Feasibility → Development Strategy",
    problem:
      "Committing capital to land or a development before you know its best use — or whether the numbers hold — is where projects quietly lose money and momentum.",
    solution:
      "We test demand, best use, unit mix and financial viability up front, so you move forward with a direction that has already been proven on paper.",
    offerings: [
      {
        title: "Feasibility & Viability Review",
        text: "Feasibility studies and viability review for the opportunity.",
      },
      {
        title: "Best-Use Assessment",
        text: "Best-use assessment for land, property or a development opportunity.",
      },
      {
        title: "Right Unit & Space Mix",
        text: "Identifying the right type of units and spaces based on market demand.",
      },
      {
        title: "Concept & Market Identity",
        text: "Defining the project idea, audience, value and market identity.",
      },
      {
        title: "Land Use & Planning Direction",
        text: "Land use, planning direction and early development structure.",
      },
      {
        title: "Pre-Execution Decisions",
        text: "Key decision planning for developers and investors before execution.",
      },
    ],
    process: [
      { title: "Market Research", text: "Demand, supply and competitive analysis." },
      { title: "Site & Asset Analysis", text: "Constraints, opportunities and best-use options." },
      { title: "Financial Modelling", text: "Appraisal, cash flow and return scenarios." },
      { title: "Best-Use Recommendation", text: "The optimal use and product mix." },
      { title: "Concept & Direction", text: "A clear concept and development direction." },
    ],
    outcome:
      "A defensible development direction — the optimal use, unit mix and market identity, agreed before development begins.",
  },
  {
    slug: "project-development",
    num: "03",
    title: "Project Development",
    label: "PROJECT DEVELOPMENT",
    tagline: "From concept to considered, high-performing spaces.",
    image: ServiceProjectDevelopment,
    intro:
      "Transforming concepts into structured developments through planning, design coordination, technical direction, and execution readiness.",
    overview:
      "Biznet develops projects from concept to execution, bringing together construction planning, design direction, materials, procurement, and experience planning to create spaces that perform commercially, function seamlessly, and feel considered from arrival through every stage of use.",
    stage: "Where it fits: Concept & Product Mix → Consultants / Contractors",
    problem:
      "A strong concept can still fail in translation — misaligned design, materials, cost and experience turn real potential into a compromised, over-budget build.",
    solution:
      "We carry the concept through design direction, specification, procurement and coordination — keeping it execution-ready, commercially sound and true to the intent.",
    offerings: [
      {
        title: "Construction & Execution Planning",
        text: "Construction, contractor and execution planning.",
      },
      {
        title: "Design Direction",
        text: "Interior, exterior, space and experience direction.",
      },
      {
        title: "Materials & Specification",
        text: "Material, finish, fixture and specification planning.",
      },
      {
        title: "Procurement & Cost",
        text: "BOQ preparation, procurement and cost direction.",
      },
      {
        title: "Experience Planning",
        text: "Hospitality, wellness, lifestyle and guest-experience planning.",
      },
      {
        title: "User Journey",
        text: "Arrival, movement, circulation and user-journey planning.",
      },
      {
        title: "Coordination",
        text: "Design, technical, contractor and site coordination.",
      },
      {
        title: "Delivery Controls",
        text: "Cost, timeline, quality and execution planning.",
      },
      {
        title: "Experiential Detailing",
        text: "Comfort, atmosphere, functionality and experiential detailing.",
      },
    ],
    process: [
      { title: "Concept & Brief", text: "Define the development concept and requirements." },
      { title: "Design Direction", text: "Set design, materials and experience direction." },
      { title: "Procurement & BOQ", text: "BOQ, procurement and cost direction." },
      { title: "Coordination", text: "Design, technical, contractor and site coordination." },
      { title: "Execution Readiness", text: "Prepare scope and teams for delivery." },
    ],
    outcome:
      "Spaces that perform commercially, function seamlessly and feel considered — from arrival through every stage of use.",
  },
  {
    slug: "project-management",
    num: "04",
    title: "Project Management",
    label: "PROJECT MANAGEMENT",
    tagline: "A seamless journey from planning to handover.",
    image: ServiceProjectManagement,
    intro:
      "Managing every stage of development through structured execution, quality control, cost management, timeline oversight, and project delivery.",
    overview:
      "Biznet drives project journeys from planning to handover — creating a seamless, hassle-free experience for clients through strong control over progress, quality, timelines, costs and delivery discipline.",
    stage: "Where it fits: Project Management → Construction & Delivery",
    problem:
      "Across consultants, contractors and suppliers, timelines slip, costs creep and quality drifts the moment there is no single point of control on the owner's side.",
    solution:
      "We run governance, alignment, cost and quality control from mobilisation to handover — one accountable team keeping progress, budget and delivery on track.",
    offerings: [
      {
        title: "Stakeholder Alignment",
        text: "Consultant, contractor, supplier and stakeholder alignment.",
      },
      {
        title: "Timeline & Progress",
        text: "Timeline, milestone and progress tracking.",
      },
      {
        title: "Cost Control",
        text: "Budget control and cost monitoring.",
      },
      {
        title: "Delivery Alignment",
        text: "Design, site and delivery alignment.",
      },
      {
        title: "Quality Assurance",
        text: "Quality checks across every stage of execution.",
      },
      {
        title: "Planning to Handover",
        text: "Structured project movement from planning to handover.",
      },
    ],
    sectorsLabel: "Project types we deliver",
    sectors: [
      "Residential developments",
      "Commercial spaces",
      "Hospitality projects",
      "Hotel apartments",
      "Private villas",
      "Educational institutions",
      "Malls",
      "Adventure parks",
      "Business projects",
      "Asset development",
      "Community developments",
    ],
    process: [
      { title: "Mobilisation", text: "Set up governance, teams and controls." },
      { title: "Alignment", text: "Consultant, contractor and stakeholder alignment." },
      { title: "Execution Control", text: "Progress, cost and quality control on site." },
      { title: "Reporting", text: "Timeline, milestone and budget reporting." },
      { title: "Handover", text: "Structured close-out and handover." },
    ],
    outcome:
      "A seamless, hassle-free delivery — with strong control over progress, quality, timelines, cost and delivery discipline.",
  },
  {
    slug: "branding-marketing",
    num: "05",
    title: "Branding & Marketing",
    label: "BRANDING & MARKETING",
    tagline: "Brands with presence, meaning and commercial value.",
    image: ServiceBrandingMarketing,
    intro:
      "Creating market-ready brands through positioning, communication, digital presence, content, campaigns, and brand experiences.",
    overview:
      "Biznet builds brands with presence, meaning, commercial value and a defined position in the market.",
    stage: "Where it fits: Market Positioning → Sales Support → Experience",
    problem:
      "Strong developments underperform in the market when the brand lacks a clear position, a compelling story and the presence to reach the right audience.",
    solution:
      "We build positioning, identity, digital presence and campaigns that give the project a defined market position, a clear narrative and real commercial pull.",
    offerings: [
      { title: "Naming & Positioning", text: "Naming and brand positioning." },
      { title: "Brand Story & Narrative", text: "Brand story, message and market narrative." },
      { title: "Visual Identity", text: "Visual identity direction." },
      { title: "Audience & Value", text: "Audience understanding and value definition." },
      { title: "Launch & Communication", text: "Launch planning and communication direction." },
      { title: "Digital & Campaigns", text: "Digital presence and campaign planning." },
      { title: "Performance Marketing", text: "Performance marketing and lead generation." },
      { title: "Influencer & Partnerships", text: "Influencer marketing and partnership direction." },
      { title: "Content Creation", text: "Content for brand, social and campaign communication." },
      { title: "Brand Shoots & Production", text: "Brand shoots, visual storytelling and production planning." },
      { title: "Events & Activations", text: "Event planning, launch activations and brand experiences." },
      { title: "Brand Voice", text: "A stronger voice for developments, businesses and investment-led projects." },
    ],
    process: [
      { title: "Brand Strategy", text: "Positioning, audience and narrative." },
      { title: "Identity & Story", text: "Name, visual identity and brand story." },
      { title: "Digital & Content", text: "Digital presence, content and campaigns." },
      { title: "Launch & Activation", text: "Launch planning, events and activations." },
      { title: "Performance", text: "Performance marketing and lead generation." },
    ],
    outcome:
      "A brand with presence, meaning, commercial value and a defined position in the market.",
  },
];

export const getServiceBySlug = (slug) =>
  servicesData.find((service) => service.slug === slug);

export default servicesData;
