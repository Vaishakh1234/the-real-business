/**
 * Site-wide constants: social links, contact, and legal URLs.
 * Use these everywhere (footer, contact page, forms, etc.) for a single source of truth.
 */

export const SITE_NAME = "The Real Business";

/** Public “post property” page (WhatsApp-led contact). */
export const POST_PROPERTY_HREF = "/post-property" as const;

/** Hero search bar link target (ctaSource ignored — post-property page is static). */
export function postPropertyHrefWithCta(_ctaSource: string | undefined): string {
  return POST_PROPERTY_HREF;
}

/** Home hero — Palakkad-first brokerage positioning */
export const HOME_HERO = {
  titleLine1: "Plots, land & homes",
  titleLine2: "in Palakkad.",
} as const;

/** Line above the hero search fields (hover shows preview image). */
export const HOME_HERO_SEARCH_PROMPT =
  "Are you looking for a property to invest in Palakkad?" as const;

/** Hero search card — hover preview (`public/images/…`). */
export const HOME_HERO_MODAL_IMAGE = "/images/home-modal-1.png" as const;

/** Home page — post-hero listings grid (newest active, fixed count). */
export const HOME_EXPLORE = {
  eyebrow: "Featured listings",
  /** Title line: `{titlePrefix} {focusCityLabel}` e.g. "Top picks in Palakkad". */
  titlePrefix: "Top picks in Palakkad",
  focusCityLabel: "for you",
  subtitle:
    "Our newest active listings across the market — Palakkad-first brokerage, always.",
  /** Max cards shown (2 columns × 3 rows). */
  listingGridLimit: 6,
  /** Prefix for generated listing reference codes (The Real Business). */
  listingRefPrefix: "TRB",
} as const;

/** Page size for `/properties` infinite scroll (`limit` on `/api/properties`). */
export const PUBLIC_PROPERTIES_PAGE_SIZE = 8;

/** Free-text search on `/properties` — matches title, address, city, and listing_ref. */
export const PROPERTIES_LISTING_SEARCH_PLACEHOLDER =
  "Search for properties" as const;

/** Typewriter hints for public search (navbar solid bar, hero panel). */
export const PUBLIC_SEARCH_TYPEWRITER_HINTS = [
  "Search Ottapalam, Chittur, Mannarkkad…",
  "Try “plots near Palakkad town”",
  "Flats, villas, commercial — type here",
  "Land for sale in district…",
] as const;

/** About page and company story — single source of truth for mission, vision, stats, etc. */
export const ABOUT = {
  tagline: "Your trusted partner in premium real estate.",
  shortStory:
    "Founded on integrity and a passion for exceptional properties, we have been the cornerstone of premium real estate consulting for over two decades. We specialize in curating experiences that go beyond simple transactions.",
  storyParagraphs: [
    "Our journey began with a single vision: to redefine what it means to live well. Today we stand as a trusted leader, connecting discerning clients with exceptional homes and investments.",
    "We combine local market expertise with the highest standards of service—whether you are buying, selling, renting, or investing. Your goals and peace of mind are at the centre of everything we do.",
  ],
  mission:
    "To provide unparalleled real estate services that empower our clients to achieve their lifestyle and investment goals through expertise, transparency, and personalized care.",
  vision:
    "To be the benchmark for excellence in real estate in our markets, continuously innovating and building long-term relationships built on trust and results.",
  yearsExperience: 25,
  /** Shown on About, Services, and marketing strips — aligned with `yearsExperience`. */
  stats: [
    { value: "25+", label: "Years in Palakkad real estate" },
    { value: "500+", label: "Clients & families served" },
    { value: "150+", label: "Successful transactions" },
    { value: "99%", label: "Client satisfaction" },
  ],
  values: [
    {
      title: "Integrity",
      description:
        "Honest pricing and clear facts you can trust at every stage.",
      image: "/images/home-pillars/7daa8b9f-11e6-4af2-a4e4-26e5cb5b01b6.png",
      imageAlt:
        "Illustration of two people shaking hands by a home, with a shield icon and signed checklist — trust and agreement.",
    },
    {
      title: "Excellence",
      description:
        "Strong listings, prepared viewings, and diligent follow-through.",
      image: "/images/home-pillars/f7b0b7b3-09d7-424b-a0a0-9d60476a6083.png",
      imageAlt:
        "Illustration of a professional beside a home with five stars overhead — quality and premium service.",
    },
    {
      title: "Innovation",
      description:
        "Modern tools and market insight for faster, clearer decisions.",
      image: "/images/home-pillars/f17333d4-6143-46d0-a0a2-985f33d716e3.png",
      imageAlt:
        "Illustration of someone browsing property listings on a tablet with floating listing cards — digital tools.",
    },
    {
      title: "Client First",
      description:
        "Your timeline, budget, and goals guide every recommendation.",
      image: "/images/home-pillars/a9dba943-dd0f-4cb8-9ef1-f318a708c983.png",
      imageAlt:
        "Illustration of an agent handing house keys to a happy couple in front of a home.",
    },
  ],
  /** Home + about — values section header (SEO-aware, Palakkad-focused) */
  coreValuesIntro: {
    eyebrow: "Brokerage principles",
    title: "Integrity and care in Palakkad real estate",
    subtitle:
      "Palakkad-focused brokerage for plots, land, and homes—with transparent communication and local expertise.",
  },
} as const;

/** Lucide icon keys — mapped on About + Services for “Why choose us”. */
export type AboutWhyChooseUsIconKey =
  | "Shield"
  | "MapPin"
  | "Users"
  | "Award";

export const ABOUT_WHY_CHOOSE_US = [
  {
    title: "Transparency",
    description:
      "Clear expectations on fees, timelines, and next steps — no jargon, no surprises.",
    iconKey: "Shield" as const,
  },
  {
    title: "Local expertise",
    description:
      "We know Palakkad towns, roads, and micro-markets — not generic national averages.",
    iconKey: "MapPin" as const,
  },
  {
    title: "Client-first",
    description:
      "Your budget and goals drive every recommendation; we are in it for the long term.",
    iconKey: "Users" as const,
  },
  {
    title: "Track record",
    description:
      "Years of successful deals and repeat clients who trust us with their next move.",
    iconKey: "Award" as const,
  },
] as const;

export const ABOUT_FAQ = [
  {
    question: `How long has ${SITE_NAME} been operating in Palakkad?`,
    answer: `We bring over ${ABOUT.yearsExperience} years of experience in Palakkad real estate, helping families and investors with plots, land, homes, and rentals across the district.`,
  },
  {
    question: "Which areas do you cover?",
    answer:
      "We focus on Palakkad district and surrounding towns — from Palakkad town to Ottapalam, Chittur, Mannarkkad, and nearby localities. Tell us your preferred area and we will shortlist options that fit.",
  },
  {
    question: "Do buyers pay a brokerage fee?",
    answer:
      "Fee structures depend on the engagement and property type. We explain costs clearly before you commit so there are no surprises. Contact us for a straightforward breakdown for your situation.",
  },
  {
    question: "Can you help with documentation and legal steps?",
    answer:
      "We coordinate with your advocate on title checks, encumbrance, and registration timelines. We are brokers, not lawyers — we make sure paperwork aligns with the deal you agreed.",
  },
  {
    question: "Do you list rental properties as well as sales?",
    answer:
      "Yes. We assist landlords and tenants with listings, viewings, and lease basics so rentals stay straightforward.",
  },
  {
    question: "How do I get started?",
    answer:
      "Browse our properties online, use the contact form, or reach out by email. We will listen to your goals and suggest a clear next step — whether that is a site visit, a valuation conversation, or a shortlist of listings.",
  },
] as const;

/** Lucide icon keys — mapped in `app/(public)/services/page.tsx` */
export type ServiceIconKey =
  | "LandPlot"
  | "Home"
  | "Key"
  | "LineChart"
  | "Scale"
  | "Handshake";

export const SERVICES = [
  {
    title: "Plot & Land Brokerage",
    description:
      "Residential plots, agricultural land, and development parcels across Palakkad district — with honest guidance on location, access, and fair market value.",
    details: [
      "Shortlisting plots by budget and locality",
      "Site visits and boundary checks with owners",
      "Comparable sales insight for pricing",
      "Support through negotiation and handover",
    ],
    iconKey: "LandPlot" as const,
  },
  {
    title: "Residential Sales & Purchases",
    description:
      "Homes, villas, and flats in Palakkad — from first viewing to registration, with clear communication at every step.",
    details: [
      "Buyer and seller representation",
      "Listing prep and serious buyer matching",
      "Offer and agreement coordination",
      "Coordination with advocates when needed",
    ],
    iconKey: "Home" as const,
  },
  {
    title: "Rental Assistance",
    description:
      "Help for landlords and tenants: listings, viewings, and lease basics so rentals stay straightforward.",
    details: [
      "Tenant and landlord introductions",
      "Viewing schedules and follow-up",
      "Guidance on rent and deposit norms",
      "Renewal and handover support",
    ],
    iconKey: "Key" as const,
  },
  {
    title: "Property Valuation Guidance",
    description:
      "Market-aware pricing advice using local demand, recent deals, and property condition — not generic online estimates.",
    details: [
      "Sale and rental price bands",
      "Investment and hold vs sell perspective",
      "Updates when the market shifts",
      "Documentation you can share with family or lenders",
    ],
    iconKey: "LineChart" as const,
  },
  {
    title: "Legal & Documentation Support",
    description:
      "We work with your advocate on title checks, encumbrance, and registration steps so paperwork matches the deal you agreed.",
    details: [
      "Title and history review coordination",
      "Sale deed and registration timelines",
      "Encumbrance and tax receipt pointers",
      "Clarity on roles: broker vs legal counsel",
    ],
    iconKey: "Scale" as const,
  },
  {
    title: "Post-Sale Support",
    description:
      "After the keys — help with handover, utility transfers, and pointing you to the right people for maintenance or resale later.",
    details: [
      "Possession and handover checklist",
      "Utility and society introductions where applicable",
      "Ongoing relationship for your next move",
      "Referrals to trusted partners when needed",
    ],
    iconKey: "Handshake" as const,
  },
] as const;

export const SERVICES_PROCESS = [
  {
    step: "01",
    title: "Consult",
    description:
      "We listen to your goals, budget, and timeline — whether you are buying, selling, or renting in Palakkad.",
  },
  {
    step: "02",
    title: "Evaluate",
    description:
      "Site visits, owner meetings, and market checks so decisions are grounded in what is on the ground.",
  },
  {
    step: "03",
    title: "Execute",
    description:
      "Offers, agreements, and coordination with advocates and banks — we stay close until terms are clear.",
  },
  {
    step: "04",
    title: "Support",
    description:
      "Through registration, handover, and beyond — your long-term partner for property in the district.",
  },
] as const;

/** Hero imagery for marketing pages (Unsplash — allowed in `next.config` remotePatterns) */
export const PAGE_HERO_IMAGES = {
  about:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80",
  services:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
} as const;

/** Services page — hero subtitle under “Our Services” */
export const SERVICES_HERO_TAGLINE =
  "Plots, land, and homes in Palakkad — buying, selling, leasing, and guidance from a brokerage that meets owners and buyers in person." as const;

/** `/team` — centered hero and philosophy (Palakkad-first brokerage). */
export const TEAM_PAGE_INTRO = {
  eyebrow: "Our Team",
  title: "We are the people behind The Real Business",
  subtitle:
    "Our approach is straightforward — work with people who know Palakkad, care about getting it right, and stay with you long after the deal is done.",
} as const;

/** Team members for `/team` — core leadership (three); roles aligned with SERVICES. */
export const TEAM = [
  {
    name: "Arjun Menon",
    role: "Founder and Lead Broker",
    description:
      "Two decades of hands-on experience in Palakkad plots, land, and residential property.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Priya Nair",
    role: "Head of Residential Sales",
    description:
      "Guides buyers and sellers through every step, from viewings to registration.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Vishnu Krishnan",
    role: "Plot and Land Specialist",
    description:
      "Deep knowledge of taluks, survey boundaries, and fair pricing across the district.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
  },
] as const;

/** Contact strip below team grid on `/team`. */
export const TEAM_CONTACT_STRIP = {
  eyebrow: "Get in touch",
  title: "Talk to our team in Palakkad",
  subtitle:
    "Buying, selling, or renting — tell us what you need and we will point you to the right next step.",
} as const;

/** Spotlight quote on `/team` — culture and on-the-ground approach. */
export const TEAM_TESTIMONIAL = {
  quote:
    "What sets us apart is that we meet every owner and walk every property before we ever recommend it. In Palakkad, that personal touch is everything.",
  name: "Arjun Menon",
  role: "Founder and Lead Broker",
  image:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80",
} as const;

export const CONTACT = {
  email: "info.therealbusiness@gmail.com",
  /** Phone number (leave empty until confirmed). */
  phone: "" as string,
  /** WhatsApp link for quick contact (wa.me with country code + number, no + or spaces). */
  whatsappUrl: "",
  whatsappLabel: "Chat on WhatsApp",
  /** Primary contact CTA label (e.g. contact form, contact page link) */
  contactUsLabel: "Contact us",
  address: {
    line1: "Palakkad",
    city: "Kerala, India",
  },
  workingHours: {
    weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
    saturday: "Saturday: 10:00 AM - 4:00 PM",
  },
} as const;

/** Floating rule-based chat widget (all public pages). */
export const CHATBOT = {
  botName: "Leon",
  assistantLabel: "The Real Business",
  bubbleAriaLabel: "Open chat with Leon",
  successMessage:
    "Thank you — we received your details. Our team will reach out shortly.",
  startNewLabel: "Start a new conversation",
  /** Feature flags for future use (flows live in `components/chatbot/chatFlows.ts`). */
  enabled: true,
} as const;

/** Ask Leon — expert Q&A / quick-help section (home page). */
export const ASK_LEON = {
  title: "Ask Leon",
  tagline: "Got a question?",
  description:
    "Leon is our lead real estate advisor. Get quick answers about neighborhoods, pricing, or your next move—no obligation.",
  ctaLabel: "Chat with Leon",
  /** Use WhatsApp as primary; fallback to contact page. */
  useWhatsApp: true,
} as const;

export const LEGAL_LINKS = {
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "x"
  | "linkedin"
  | "youtube"
  | "whatsapp";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
  ariaLabel: string;
}

/** Social media links — used in footer, contact sidebar, etc. */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/therealbusiness.co",
    ariaLabel: "Instagram",
  },
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/therealbusiness",
    ariaLabel: "Facebook",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/therealbusiness",
    ariaLabel: "LinkedIn",
  },
  {
    platform: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/919876543210",
    ariaLabel: "WhatsApp",
  },
  {
    platform: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@therealbusinessyt",
    ariaLabel: "YouTube",
  },
].filter((link) => link.href !== "") as SocialLink[];
