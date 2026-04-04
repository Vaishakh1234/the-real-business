/**
 * Site-wide constants: social links, contact, and legal URLs.
 * Use these everywhere (footer, contact page, forms, etc.) for a single source of truth.
 */

export const SITE_NAME = "The Real Business";

/** Full-page canvas for `/about` — warm cream (editorial reference). */
export const ABOUT_PAGE_BACKGROUND = "#F8F3ED" as const;

/** Public “post property” page (WhatsApp-led contact). */
export const POST_PROPERTY_HREF = "/post-property" as const;

/** Hero search bar link target (ctaSource ignored — post-property page is static). */
export function postPropertyHrefWithCta(_ctaSource: string | undefined): string {
  return POST_PROPERTY_HREF;
}

/** Home hero — Palakkad-first marketing, consultancy & transaction support */
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
    "Our newest active listings — real estate marketing, consultancy, and buying & selling support across Palakkad.",
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
  /** About page second section — headline + intro above the stat grid. */
  experienceSection: {
    headline: "From visibility to clarity — and all the way to closing.",
    intro:
      "We combine marketing that reaches serious buyers, consultancy that explains trade-offs and pricing, and hands-on support through negotiation, paperwork, and handover. Palakkad-first expertise in every conversation.",
  },
  /** Shown on About (with descriptions), Services strip (value + label only), and marketing. */
  stats: [
    {
      value: "150+",
      label: "Marketing & listing projects",
      description:
        "Campaigns and listings shaped for serious buyers — with honest positioning and local context.",
    },
    {
      value: "500+",
      label: "Clients advised & supported",
      description:
        "Owners, buyers, and investors who rely on our consultancy and transaction support across the district.",
    },
    {
      value: "25+",
      label: "Years in Palakkad real estate",
      description:
        "Deep knowledge of towns, roads, documentation norms, and how deals actually close here.",
    },
    {
      value: "99%",
      label: "Client satisfaction",
      description:
        "Built on clear fees, steady updates, and relationships that continue after registration.",
    },
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
    eyebrow: "How we work",
    title: "Integrity across marketing, consultancy & deals",
    subtitle:
      "Palakkad-focused real estate marketing, property consultancy, and buying & selling support—with transparent communication and local expertise.",
  },
  /** About page — dark band with cream trust cards (icon, title, body). */
  trustedPartnerSection: {
    title: "Your partner for marketing, advice & every deal",
    cards: [
      {
        iconKey: "UserSearch" as const,
        title: "Strategic marketing",
        description:
          "Listings and outreach built to reach serious buyers and tenants — not generic noise — across Palakkad and nearby towns.",
      },
      {
        iconKey: "Users" as const,
        title: "Expert consultancy",
        description:
          "Pricing, investment angles, and documentation context so you decide with confidence before you sign or list.",
      },
      {
        iconKey: "Clock" as const,
        title: "Transaction support",
        description:
          "From shortlists and viewings to offers, advocate coordination, and handover — steady communication at every step.",
      },
      {
        iconKey: "UserCircle" as const,
        title: "Client-first",
        description:
          "Your timeline, budget, and goals drive the plan — we adapt marketing, advice, and support to match.",
      },
    ],
  },
} as const;

export type AboutTrustedPartnerIconKey =
  (typeof ABOUT.trustedPartnerSection.cards)[number]["iconKey"];

/** Lucide icon keys — mapped on About + Services for “Why choose us”. */
export type AboutWhyChooseUsIconKey =
  | "Shield"
  | "MapPin"
  | "Users"
  | "Award";

export const ABOUT_WHY_CHOOSE_US = [
  {
    title: "Marketing-first reach",
    description:
      "We position your property where serious buyers look — with messaging and presentation that reflect real value in Palakkad.",
    iconKey: "Shield" as const,
  },
  {
    title: "Local market intelligence",
    description:
      "Taluks, access roads, and comparable deals — advice grounded in what is happening on the ground, not generic estimates.",
    iconKey: "MapPin" as const,
  },
  {
    title: "End-to-end support",
    description:
      "Consultancy when you need clarity, marketing when you need visibility, and hands-on help through buying or selling.",
    iconKey: "Users" as const,
  },
  {
    title: "Proven results",
    description:
      "Repeat clients and referrals from owners and investors who trust us for the next listing or purchase.",
    iconKey: "Award" as const,
  },
] as const;

export const ABOUT_FAQ = [
  {
    question: `What real estate marketing services do you offer in Palakkad?`,
    answer: `We help owners and developers market residential plots, land, houses, villas, and commercial space across Palakkad — including listing strategy, digital and channel promotion, presentation guidance, and outreach to serious buyers. Tell us your asset and timeline and we will propose a practical marketing plan.`,
  },
  {
    question: "How does property consultancy help buyers and sellers?",
    answer:
      "Consultancy covers pricing bands, investment fit, comparables in your locality, and documentation context before you list or offer. We explain trade-offs in plain language and align advice with your budget and goals — we are advisors and brokers, not a substitute for your advocate on legal opinion.",
  },
  {
    question: "Do you help with property buying and selling in Kerala?",
    answer:
      "Yes. We support buyers and sellers in Palakkad district with search and shortlisting, viewings, negotiation, agreement coordination, and handover — working alongside your advocate for title checks and registration. We also help with rental placement when that fits your plan.",
  },
  {
    question: "Which areas in Palakkad do you cover?",
    answer:
      "We focus on Palakkad district — Palakkad town, Ottapalam, Chittur, Mannarkkad, and surrounding localities. Share your preferred area and we will tailor marketing, consultancy, or buyer support to match.",
  },
  {
    question: "How long has The Real Business been operating in Palakkad?",
    answer: `We bring over ${ABOUT.yearsExperience} years of experience in Palakkad real estate across marketing, consultancy, and transaction support for families, owners, and investors.`,
  },
  {
    question: "Do buyers or sellers pay fees — and when are they explained?",
    answer:
      "Fees depend on whether you are marketing a property, taking consultancy-only input, or engaging us for a full buy or sell mandate. We explain costs upfront before you commit so there are no surprises.",
  },
  {
    question: "Can you help with documentation and legal steps?",
    answer:
      "We coordinate with your advocate on title checks, encumbrance certificates, sale deeds, and registration timelines. We are brokers and consultants, not lawyers — we keep paperwork aligned with the deal you agreed.",
  },
  {
    question: "Do you work with NRI buyers and sellers?",
    answer:
      "Yes. We support NRIs with clear written updates, virtual walkthroughs where possible, and coordination with family or advocates on the ground in Palakkad for viewings, marketing decisions, and closing.",
  },
  {
    question: "What should I prepare before listing or marketing my property?",
    answer:
      "Gather title documents, tax receipts, and prior sale or partition records your advocate may need. We align on realistic pricing, presentation, and channels before your property is promoted so buyers see consistent, accurate information.",
  },
  {
    question: "How do I get started with The Real Business?",
    answer:
      "Use the contact form, browse our listings, or email us. We will clarify whether you need marketing, consultancy, buying or selling support — or a combination — and give you a clear next step.",
  },
] as const;

/** Dedicated FAQ page (`/faq`) — two-column marketing layout + newsletter CTA. */
export const FAQ_PAGE_ITEMS = [
  {
    question: `What services does ${SITE_NAME} provide in Palakkad?`,
    answer:
      "We offer real estate marketing for owners and developers, property consultancy for pricing and investment decisions, and full buying and selling support — shortlisting, viewings, negotiation, and coordination with advocates through registration. We also assist with rentals when that fits your goals.",
  },
  {
    question: `How can I search for properties on ${SITE_NAME}?`,
    answer:
      "Use the search bar on our home and properties pages to filter by area, type, and budget. Save favourites to your wishlist and contact us for a curated shortlist or site visit. We add local context on value, access, and documentation so listings translate into confident decisions.",
  },
  {
    question: `Does ${SITE_NAME} charge any fees for marketing or consultancy?`,
    answer:
      "Fees depend on the scope — marketing campaigns, consultancy-only engagements, or a full buy or sell mandate. We explain costs clearly before you commit. Contact us for a breakdown tailored to your property and goals.",
  },
  {
    question: `Can I list or market my property with ${SITE_NAME} as an owner?`,
    answer:
      "Yes. Reach out via our post-property flow or contact page. We discuss positioning, presentation, channels, and pricing, then promote your property to serious buyers with transparent updates throughout.",
  },
  {
    question: "Do you help with legal papers?",
    answer:
      "We coordinate with your advocate on title checks, encumbrance certificates, sale deeds, and registration. We are brokers and consultants, not lawyers — we keep paperwork aligned with the deal you agreed.",
  },
  {
    question: `How can I schedule a property visit through ${SITE_NAME}?`,
    answer:
      "Tell us which listing interests you via the contact form, email, or phone. We confirm with the owner, propose visit times, and join you so boundaries, access, and condition are clear before you offer.",
  },
  {
    question: "How do I find a property that fits my budget and area?",
    answer:
      "Share your budget, preferred localities in Palakkad district, and property type. We shortlist matches, explain trade-offs with consultancy-style clarity, and support you through offer and closing if you choose.",
  },
] as const;

/** Newsletter strip on `/faq` — headline and supporting line. */
export const FAQ_NEWSLETTER = {
  title: "Stay Updated on Latest Property",
  subtitle: "Never miss a beat — stay updated on new listings and market insight.",
} as const;

/** About page newsletter CTA — glass / modern home accent (bottom-right, dusk). */
export const ABOUT_NEWSLETTER_BG_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80" as const;

/** Lucide icon keys — mapped in `app/(public)/services/page.tsx` */
export type ServiceIconKey = "Megaphone" | "Briefcase" | "Handshake";

export const SERVICES = [
  {
    title: "Real Estate Marketing",
    description:
      "Get your Palakkad property in front of serious buyers and investors — with clear positioning, professional presentation, and promotion that matches how people actually search and decide.",
    details: [
      "Digital property promotion and listing optimization",
      "Messaging and channel strategy for plots, homes, and commercial space",
      "Professional presentation guidance (details, media, USPs buyers expect)",
      "Targeted buyer and investor outreach",
      "Competitive positioning against similar stock in the district",
      "Developer and landowner branding support where it fits the mandate",
    ],
    iconKey: "Megaphone" as const,
  },
  {
    title: "Property Consultancy",
    description:
      "Independent, Palakkad-grounded advice before you list, offer, or allocate capital — so decisions reflect local demand, documentation reality, and your personal goals.",
    details: [
      "Market analysis and investment advisory for residential and land assets",
      "Property valuation guidance using comparables and on-site context",
      "Documentation and process consultation (with your advocate for legal opinion)",
      "Land-use, access, and development considerations explained plainly",
      "NRI advisory: remote updates, timelines, and coordination with family on the ground",
      "Portfolio review: hold, sell, or reposition with realistic scenarios",
    ],
    iconKey: "Briefcase" as const,
  },
  {
    title: "Property Buying & Selling Support",
    description:
      "End-to-end help from shortlist to registration — negotiation, agreements, and handover with steady communication and advocate coordination.",
    details: [
      "Buyer search, shortlisting, and seller listing management",
      "Viewings, owner meetings, and boundary or access clarity",
      "Offer strategy, negotiation, and deal structuring",
      "Agreement milestones and advocate coordination through registration",
      "Post-transaction handover and possession checklist",
      "Rental placement for landlords and tenants when required",
    ],
    iconKey: "Handshake" as const,
  },
] as const;

export const SERVICES_PROCESS = [
  {
    step: "01",
    title: "Discover",
    description:
      "We capture your goals — marketing a listing, getting consultancy before a decision, or buying or selling in Palakkad — plus budget, timeline, and constraints.",
  },
  {
    step: "02",
    title: "Strategize",
    description:
      "A tailored plan: how to market, what price band fits, or which steps to close — always aligned with local market reality.",
  },
  {
    step: "03",
    title: "Execute",
    description:
      "We run the campaign, deliver the advice, or drive the transaction — viewings, outreach, negotiation, and paperwork alignment with your advocate.",
  },
  {
    step: "04",
    title: "Deliver",
    description:
      "Results you can measure — visibility, clarity, or a registered deal — plus ongoing support for your next move in the district.",
  },
] as const;

/** Hero imagery for marketing pages (Unsplash — allowed in `next.config` remotePatterns) */
export const PAGE_HERO_IMAGES = {
  about:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
  services:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
} as const;

/** About page — full-bleed image + cream overlay card (team / planning context). */
export const ABOUT_DREAMS_BANNER = {
  image:
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1920&q=80",
  headline: "Marketing, advice, and deals — one Palakkad partner",
  subtitle:
    "From promoting your property to consulting on price and closing the sale, we align visibility, clarity, and execution.",
  ctaLabel: "Get a quote",
  ctaHref: "/contact" as const,
  steps: [
    {
      n: "01",
      title: "Real estate marketing",
      body: "Reach serious buyers with positioning, channels, and presentation built for Palakkad’s market.",
    },
    {
      n: "02",
      title: "Property consultancy",
      body: "Pricing, investment fit, and documentation context before you commit — in plain language.",
    },
    {
      n: "03",
      title: "Buying & selling support",
      body: "Shortlists to registration: viewings, negotiation, advocate coordination, and handover.",
    },
  ],
} as const;

/** Services page — hero subtitle under “Our Services” */
export const SERVICES_HERO_TAGLINE =
  "Real estate marketing, property consultancy, and buying & selling support in Palakkad — local expertise from first conversation to closing." as const;

/** `/team` — centered hero and philosophy (Palakkad-first brokerage). */
export const TEAM_PAGE_INTRO = {
  eyebrow: "Our Team",
  title: "We are the people behind The Real Business",
  subtitle:
    "Marketing, consultancy, and transaction support — one team that knows Palakkad and stays with you after the deal is done.",
} as const;

/** About page — team grid headline (centered, matches editorial reference). */
export const ABOUT_TEAM_SECTION = {
  title: "Meet Our Team",
  description:
    "Local professionals for real estate marketing, property consultancy, and buying & selling support — honest advice at every step.",
} as const;

/** Team members for `/team` — core leadership (three); roles aligned with SERVICES. */
export const TEAM = [
  {
    name: "Arjun Menon",
    role: "Founder and Lead Broker",
    description:
      "Leads strategy across marketing, consultancy, and transactions for Palakkad plots, land, and homes.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Priya Nair",
    role: "Head of Real Estate Marketing",
    description:
      "Listings, campaigns, and buyer outreach — positioning properties so the right audience sees them.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Vishnu Krishnan",
    role: "Property Consultancy Lead",
    description:
      "Pricing, comparables, and district micro-markets — advisory grounded in taluks and on-ground checks.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
  },
] as const;

/** Contact strip below team grid on `/team`. */
export const TEAM_CONTACT_STRIP = {
  eyebrow: "Get in touch",
  title: "Talk to our team in Palakkad",
  subtitle:
    "Marketing a listing, needing consultancy, or buying or selling — we will map the right service and next step.",
} as const;

/** Spotlight quote on `/team` — culture and on-the-ground approach. */
export const TEAM_TESTIMONIAL = {
  quote:
    "We only market and recommend what we have seen and understood on the ground. That discipline — plus clear consultancy and transaction support — is how we earn trust in Palakkad.",
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
