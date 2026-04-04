import type { Metadata } from "next";
import Image from "next/image";
import {
  Award,
  Clock,
  MapPin,
  Shield,
  UserCircle,
  UserSearch,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  ABOUT,
  ABOUT_FAQ,
  ABOUT_PAGE_BACKGROUND,
  ABOUT_WHY_CHOOSE_US,
  CONTACT,
  PAGE_HERO_IMAGES,
  SITE_NAME,
  TEAM_TESTIMONIAL,
  type AboutTrustedPartnerIconKey,
  type AboutWhyChooseUsIconKey,
} from "@/lib/constants/site";
import { AboutDreamsImageSection } from "@/components/about/AboutDreamsImageSection";
import { AboutFaqSection } from "@/components/about/AboutFaqSection";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

const WHY_US_ICONS: Record<AboutWhyChooseUsIconKey, LucideIcon> = {
  Shield,
  MapPin,
  Users,
  Award,
};

const TRUSTED_PARTNER_ICONS: Record<AboutTrustedPartnerIconKey, LucideIcon> = {
  UserSearch,
  Users,
  Clock,
  UserCircle,
};

const aboutDescription = `${SITE_NAME} — real estate marketing, property consultancy, and buying & selling support in Palakkad, Kerala. Learn our mission, local expertise, and how we help owners, buyers, and investors.`;

export const metadata: Metadata = {
  title: "About Us — Real Estate Marketing & Property Consultancy in Palakkad",
  description: aboutDescription,
  keywords: [
    "The Real Business",
    "real estate marketing Palakkad",
    "property consultancy Kerala",
    "property buying selling support Palakkad",
    "Palakkad real estate",
    "property consultant Palakkad",
    "about us",
  ],
  openGraph: {
    title:
      "About Us — Real Estate Marketing & Property Consultancy in Palakkad",
    description: aboutDescription,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    images: [
      {
        url: PAGE_HERO_IMAGES.about,
        width: 1920,
        height: 1080,
        alt: "Palakkad real estate — professional property and brokerage setting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "About Us — Real Estate Marketing & Property Consultancy in Palakkad",
    description: aboutDescription,
    images: [PAGE_HERO_IMAGES.about],
  },
};

function AboutJsonLd() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    description: aboutDescription,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Palakkad",
      containedInPlace: { "@type": "Country", name: "India" },
    },
  };
  if (origin) {
    org.url = origin;
    org.logo = `${origin}/logo-icon-bg.png`;
  }
  if (CONTACT.email) {
    org.email = CONTACT.email;
  }
  if (CONTACT.phone) {
    org.telephone = CONTACT.phone;
  }
  if (CONTACT.address.line1) {
    org.address = {
      "@type": "PostalAddress",
      addressLocality: CONTACT.address.line1,
      addressRegion: CONTACT.address.city,
      addressCountry: "IN",
    };
  }
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ABOUT_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </>
  );
}

export default function AboutPage() {
  const foundingYear = new Date().getFullYear() - ABOUT.yearsExperience;

  return (
    <>
      <AboutJsonLd />

      <div
        className="min-h-screen"
        style={{ backgroundColor: ABOUT_PAGE_BACKGROUND }}
      >
        <div className={publicContentFrameClass}>
          {/* ── Hero ── */}
          <section className="pb-10 pt-6 sm:pb-12 sm:pt-8 md:pt-10 lg:pb-14 lg:pt-12">
            <h1 className="max-w-4xl font-heading text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] leading-[1.12] tracking-tight text-brand-charcoal">
              <span className="font-normal italic">Real estate marketing,</span>{" "}
              <span className="font-bold">
                consultancy &amp; deals in Palakkad.
                <br className="hidden sm:block" />
                Trusted since {foundingYear}.
              </span>
            </h1>

            <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 md:grid-cols-3 md:gap-10 lg:mt-12">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px] md:max-w-none">
                At {SITE_NAME}, we help you market properties to the right
                audience, consult on price and strategy with Palakkad-grounded
                insight, and support every step of buying or selling — with
                transparency and a long-term view.
              </p>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-brand-charcoal sm:text-base">
                  Mission
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {ABOUT.mission}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-brand-charcoal sm:text-base">
                  Vision
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {ABOUT.vision}
                </p>
              </div>
            </div>
          </section>

          {/* ── Dreams banner (image + card) ── */}
          <AboutDreamsImageSection />

          {/* ── Our Story + At a Glance ── */}
          <section
            id="our-story"
            className="scroll-mt-24 py-10 sm:py-14 lg:py-16"
          >
            <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-14 xl:gap-16">
              <div className="lg:col-span-3">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                  Know more about us
                </span>
                <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl lg:text-4xl">
                  Rooted in Palakkad,{" "}
                  <span className="font-normal text-muted-foreground">
                    built on trust
                  </span>
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground sm:mt-6">
                  {ABOUT.shortStory}
                </p>
                {ABOUT.storyParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:mt-4"
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-brand-gold/30 bg-white/60 p-6 shadow-sm sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                    At a glance
                  </p>
                  <p className="mt-3 font-heading text-4xl font-bold text-brand-charcoal sm:text-5xl">
                    {ABOUT.yearsExperience}+
                  </p>
                  <p className="mt-1.5 text-base font-medium text-brand-charcoal sm:text-lg">
                    Years serving buyers &amp; sellers
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Real estate marketing, property consultancy, and transaction
                    support across Palakkad district — transparent fees and
                    clear advice.
                  </p>
                  <blockquote className="mt-6 border-l-2 border-brand-gold/50 pl-4 text-sm italic leading-relaxed text-brand-charcoal/90">
                    &ldquo;{TEAM_TESTIMONIAL.quote}&rdquo;
                  </blockquote>
                  <p className="mt-2 text-xs font-semibold text-brand-gold">
                    — {TEAM_TESTIMONIAL.name}, {TEAM_TESTIMONIAL.role}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Trusted Partner (dark section) ── */}
          <section className="rounded-2xl bg-[#1e1b1b] px-5 py-12 xs:px-6 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <h2 className="mx-auto max-w-2xl text-center text-xl font-medium leading-snug tracking-tight text-white sm:text-2xl lg:text-[1.75rem]">
              {ABOUT.trustedPartnerSection.title}
            </h2>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-14 xl:grid-cols-4">
              {ABOUT.trustedPartnerSection.cards.map((card) => {
                const Icon = TRUSTED_PARTNER_ICONS[card.iconKey];
                return (
                  <article
                    key={card.title}
                    className="flex flex-col rounded-xl bg-[#fdfaf3] p-6 text-brand-charcoal sm:rounded-2xl sm:p-7"
                  >
                    <Icon
                      className="h-6 w-6 shrink-0 text-brand-charcoal"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <h3 className="mt-4 text-base font-bold leading-snug sm:mt-5 sm:text-lg">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/70">
                      {card.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ── Why Choose Us (bento grid) ── */}
          <section className="py-14 sm:py-20 lg:py-24">
            <div className="mb-8 sm:mb-10 lg:mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                Why choose us
              </span>
              <h2 className="font-heading mt-3 text-2xl font-bold text-brand-charcoal sm:text-3xl lg:text-4xl">
                The Palakkad difference
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-[15px]">
                Real relationships and local knowledge — not a call centre. Here
                is what guides every recommendation we make.
              </p>
            </div>

            {/* Mobile: single column. Tablet: 2-col cards only. Desktop: image + 2×2 cards */}
            <div className="grid gap-4 sm:gap-5 lg:grid-cols-12 lg:items-stretch">
              <div className="relative hidden min-h-[320px] overflow-hidden rounded-2xl lg:col-span-5 lg:block">
                <Image
                  src={PAGE_HERO_IMAGES.about}
                  alt="Professional real estate and property advisory in Palakkad"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 0px, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/35 to-brand-charcoal/15" />
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                    Charting our course
                  </p>
                  <h3 className="font-heading mt-2 text-xl font-bold text-white lg:text-2xl">
                    Your partner for marketing, advice &amp; every transaction
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Visibility when you list, clarity when you decide, support
                    when you close — we stay close so you always know the next
                    step.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-7">
                {ABOUT_WHY_CHOOSE_US.map((item, index) => {
                  const Icon = WHY_US_ICONS[item.iconKey];
                  const tinted = index % 2 === 1;
                  return (
                    <div
                      key={item.title}
                      className={`rounded-xl border border-border p-5 shadow-sm transition-colors hover:border-brand-gold/30 sm:rounded-2xl sm:p-7 ${
                        tinted ? "bg-brand-gold/10" : "bg-white"
                      }`}
                    >
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mb-4 sm:h-11 sm:w-11 ${
                          tinted
                            ? "bg-brand-charcoal text-white"
                            : "bg-muted text-brand-gold"
                        }`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                      </div>
                      <h3 className="font-heading text-base font-bold text-brand-charcoal sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <AboutFaqSection />
        </div>
      </div>
    </>
  );
}
