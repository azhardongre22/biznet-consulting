// Biznet project portfolio — sourced from the "Biznet Projects" folder
// (project name, type, scope and location from each project's notes).
// Images live in src/assets/images/projects/<slug>-<n>.webp.

import alAweerVilla1Img from "../assets/images/projects/al-aweer-villa-1.webp";
import alAweerVilla2Img from "../assets/images/projects/al-aweer-villa-2.webp";
import alGarhoudOffices1Img from "../assets/images/projects/al-garhoud-offices-1.webp";
import alMuteenaResidences1Img from "../assets/images/projects/al-muteena-residences-1.webp";
import alMuteenaResidences2Img from "../assets/images/projects/al-muteena-residences-2.webp";
import alefNoon1Img from "../assets/images/projects/alef-noon-1.webp";
import classicArchedVilla1Img from "../assets/images/projects/classic-arched-villa-1.webp";
import cubicModernVilla1Img from "../assets/images/projects/cubic-modern-villa-1.webp";
import hipRoofClassicVilla1Img from "../assets/images/projects/hip-roof-classic-villa-1.webp";
import naddAlShibaVilla11Img from "../assets/images/projects/nadd-al-shiba-villa-1-1.webp";
import naddAlShibaVilla21Img from "../assets/images/projects/nadd-al-shiba-villa-2-1.webp";
import naddAlShibaVilla31Img from "../assets/images/projects/nadd-al-shiba-villa-3-1.webp";
import neoClassicalVilla1Img from "../assets/images/projects/neo-classical-villa-1.webp";
import primiero1Img from "../assets/images/projects/primiero-1.webp";
import sapphire1Img from "../assets/images/projects/sapphire-1.webp";
import sharjahVilla1Img from "../assets/images/projects/sharjah-villa-1.webp";
import singleStoreyClassicVilla1Img from "../assets/images/projects/single-storey-classic-villa-1.webp";
import ummNahadVilla1Img from "../assets/images/projects/umm-nahad-villa-1.webp";
import wadiAlShabakVilla11Img from "../assets/images/projects/wadi-al-shabak-villa-1-1.webp";
import wadiAlShabakVilla21Img from "../assets/images/projects/wadi-al-shabak-villa-2-1.webp";
import wadiAlShabakVilla31Img from "../assets/images/projects/wadi-al-shabak-villa-3-1.webp";
import warsanWarehouse1Img from "../assets/images/projects/warsan-warehouse-1.webp";

// `stat` = confirmed portfolio figure (also on the About page);
// `cover` = the project image used for the category on the homepage.
export const PROJECT_CATEGORIES = [
  {
    id: "residential-buildings",
    label: "Residential Buildings",
    badge: "Residential",
    title: "Residential Buildings",
    headline: "Spaces Designed for Everyday Living.",
    intro:
      "Residential and mixed-use developments shaped through early-stage planning, design coordination and project execution.",
    stat: "20+ developments",
    cover: { image: primiero1Img, alt: "Primiero — a residential tower in Al Furjan", focus: "center" },
  },
  {
    id: "commercial-industrial",
    label: "Commercial & Industrial",
    badge: "Commercial",
    title: "Commercial & Industrial",
    headline: "Developments Built Around Commercial Purpose.",
    intro:
      "Retail, office and logistics projects planned around functional requirements, development objectives and practical execution.",
    stat: "30+ projects",
    cover: { image: alGarhoudOffices1Img, alt: "A two-storey commercial and office building in Al Garhoud", focus: "center" },
  },
  {
    id: "private-villas",
    label: "Private Villas",
    badge: "Private Villa",
    title: "Private Villas",
    headline: "Personal Spaces. Carefully Managed.",
    intro:
      "Private residences shaped around individual requirements, with project management spanning design coordination, approvals, construction progress and handover.",
    stat: "80+ villas",
    cover: { image: naddAlShibaVilla11Img, alt: "A contemporary private villa in white render and timber", focus: "center" },
  },
];

/** Link to a category section on the projects page. */
export const projectCategoryPath = (id) => `/projects#${id}`;

// `focus` = optional CSS object-position for the card crop.
export const PROJECTS = [
  // ── Residential buildings ──────────────────────────────────────────────────
  {
    slug: "alef-noon-residence",
    category: "residential-buildings",
    name: "Alef Noon Residence",
    type: "Residential & Commercial Building",
    scope: "G+4P+16",
    location: "Jumeirah Village Circle",
    images: [alefNoon1Img],
  },
  {
    slug: "primiero",
    category: "residential-buildings",
    name: "Primiero",
    type: "Residential & Commercial Building",
    scope: "2B+G+1P+17",
    location: "Al Furjan",
    images: [primiero1Img],
  },
  {
    slug: "sapphire",
    category: "residential-buildings",
    name: "Sapphire",
    type: "Residential Building",
    images: [sapphire1Img],
  },

  {
    slug: "al-muteena-residences",
    category: "residential-buildings",
    name: "One Al Muteena Residences",
    type: "Residential Building",
    location: "Al Muteena",
    images: [alMuteenaResidences1Img, alMuteenaResidences2Img],
  },

  // ── Commercial & industrial ────────────────────────────────────────────────
  {
    slug: "al-garhoud-offices",
    category: "commercial-industrial",
    name: "Al Garhoud Commercial Building",
    type: "Commercial & Offices Building",
    scope: "G+M",
    location: "Al Garhoud",
    images: [alGarhoudOffices1Img],
  },
  {
    slug: "warsan-warehouse",
    category: "commercial-industrial",
    name: "Warsan Warehouses",
    type: "Warehouses",
    scope: "G+M",
    location: "Warsan",
    images: [warsanWarehouse1Img],
  },

  // ── Private villas ─────────────────────────────────────────────────────────
  {
    slug: "nadd-al-shiba-villa-1",
    category: "private-villas",
    name: "Nadd Al Shiba Villa I",
    type: "Private Villa",
    scope: "G+1",
    location: "Nadd Al Shiba 4",
    images: [naddAlShibaVilla11Img],
  },
  {
    slug: "nadd-al-shiba-villa-2",
    category: "private-villas",
    name: "Nadd Al Shiba Villa II",
    type: "Private Villa",
    scope: "G+1",
    location: "Nadd Al Shiba 4",
    images: [naddAlShibaVilla21Img],
  },
  {
    slug: "nadd-al-shiba-villa-3",
    category: "private-villas",
    name: "Nadd Al Shiba Villa III",
    type: "Private Villa",
    scope: "G+1",
    location: "Nadd Al Shiba First",
    images: [naddAlShibaVilla31Img],
  },
  {
    slug: "al-aweer-villa-1",
    category: "private-villas",
    name: "Al Aweer Villa I",
    type: "Private Villa",
    scope: "G+1",
    location: "Al Aweer",
    images: [alAweerVilla1Img],
  },
  {
    slug: "al-aweer-villa-2",
    category: "private-villas",
    name: "Al Aweer Villa II",
    type: "Private Villa",
    scope: "G+1",
    location: "Al Aweer",
    images: [alAweerVilla2Img],
  },
  {
    slug: "wadi-al-shabak-villa-1",
    category: "private-villas",
    name: "Wadi Al Shabak Villa I",
    type: "Private Villa",
    scope: "G+1",
    location: "Wadi Al Shabak",
    images: [wadiAlShabakVilla11Img],
  },
  {
    slug: "wadi-al-shabak-villa-2",
    category: "private-villas",
    name: "Wadi Al Shabak Villa II",
    type: "Private Villa",
    scope: "G+1",
    location: "Wadi Al Shabak",
    images: [wadiAlShabakVilla21Img],
  },
  {
    slug: "wadi-al-shabak-villa-3",
    category: "private-villas",
    name: "Wadi Al Shabak Villa III",
    type: "Private Villa",
    scope: "G+1",
    location: "Wadi Al Shabak",
    images: [wadiAlShabakVilla31Img],
  },
  {
    slug: "sharjah-villa",
    category: "private-villas",
    name: "Sharjah Villa",
    type: "Private Villa",
    scope: "G+1",
    location: "Sharjah",
    images: [sharjahVilla1Img],
  },
  {
    slug: "umm-nahad-villa",
    category: "private-villas",
    name: "Umm Nahad Villa",
    type: "Private Villa",
    scope: "G+1",
    location: "Umm Nahad Third",
    images: [ummNahadVilla1Img],
  },
  {
    slug: "classic-arched-villa",
    category: "private-villas",
    name: "Classic Arched Villa",
    type: "Private Villa",
    images: [classicArchedVilla1Img],
  },
  {
    slug: "cubic-modern-villa",
    category: "private-villas",
    name: "Cubic Modern Villa",
    type: "Private Villa",
    images: [cubicModernVilla1Img],
  },
  {
    slug: "neo-classical-villa",
    category: "private-villas",
    name: "Neo-Classical Villa",
    type: "Private Villa",
    images: [neoClassicalVilla1Img],
  },
  {
    slug: "hip-roof-classic-villa",
    category: "private-villas",
    name: "Hip-Roof Classic Villa",
    type: "Private Villa",
    images: [hipRoofClassicVilla1Img],
  },
  {
    slug: "single-storey-classic-villa",
    category: "private-villas",
    name: "Single-Storey Classic Villa",
    type: "Private Villa",
    images: [singleStoreyClassicVilla1Img],
  },
];
