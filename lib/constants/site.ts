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
  titlePrefix: "Top picks in",
  focusCityLabel: "Palakkad",
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
  stats: [
    { value: "$2.4B+", label: "Total Sales" },
    { value: "1.5k+", label: "Properties Sold" },
    { value: "120+", label: "Expert Agents" },
    { value: "99%", label: "Client Satisfaction" },
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

export const CONTACT = {
  email: "contact@therealbusiness.com",
  supportEmail: "support@therealbusiness.com",
  phone: "+1 (555) 123-4567",
  phoneSecondary: "+1 (555) 987-6543",
  /** WhatsApp link for quick contact (wa.me with country code + number, no + or spaces) */
  whatsappUrl: "https://wa.me/15551234567",
  whatsappLabel: "Chat on WhatsApp",
  /** Primary contact CTA label (e.g. contact form, contact page link) */
  contactUsLabel: "Contact us",
  address: {
    line1: "123 Luxury Avenue, Suite 500",
    city: "New York, NY 10022",
  },
  workingHours: {
    weekdays: "Monday - Friday: 9:00 AM - 6:00 PM",
    saturday: "Saturday: 10:00 AM - 4:00 PM",
  },
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

export type SocialPlatform = "facebook" | "instagram" | "x" | "linkedin" | "youtube";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
  ariaLabel: string;
}

/** Social media links — update hrefs to your real profiles. Used in footer, contact, etc. */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/therealbusiness",
    ariaLabel: "Facebook",
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/therealbusiness",
    ariaLabel: "Instagram",
  },
  {
    platform: "x",
    label: "X",
    href: "https://x.com/therealbusiness",
    ariaLabel: "X (Twitter)",
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/therealbusiness",
    ariaLabel: "LinkedIn",
  },
  {
    platform: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@therealbusiness",
    ariaLabel: "YouTube",
  },
];
