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

const aboutDescription = `${SITE_NAME} is a Palakkad real estate brokerage for plots, land, homes, and rentals. Learn our mission, values, team, and how we help buyers and sellers with transparent, local expertise.`;

export const metadata: Metadata = {
  title: `About Us — ${SITE_NAME}`,
  description: aboutDescription,
  keywords: [
    "The Real Business",
    "Palakkad real estate",
    "real estate broker Kerala",
    "plots Palakkad",
    "land for sale Palakkad",
    "property consultant Palakkad",
    "about us",
  ],
  openGraph: {
    title: `About Us — ${SITE_NAME}`,
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
    title: `About Us — ${SITE_NAME}`,
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
          {/* 1 — Editorial hero: cream panel, headline, mission/vision */}
          <section className="pb-12 pt-28 sm:pb-14 sm:pt-32 md:pt-36 lg:pb-16 lg:pt-40">
            <h1 className="font-heading text-[clamp(2.25rem,5vw+0.5rem,4.5rem)] leading-[1.08] tracking-tight text-brand-charcoal">
              <span className="font-normal italic">
                Explore your real estate
              </span>{" "}
              <span className="font-bold">
                dream into reality.
                <br />
                Sharing home since {foundingYear}.
              </span>
            </h1>

            <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-3 md:gap-10 lg:mt-16 lg:gap-14">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px] md:max-w-none">
                At {SITE_NAME}, we&apos;re redefining how people find homes by
                blending smart technology with human expertise. Our mission is
                to make real estate simple, transparent, and personalized for
                every client.
              </p>
              <div>
                <h2 className="text-base font-bold text-brand-charcoal sm:text-lg">
                  Mission
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {ABOUT.mission}
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold text-brand-charcoal sm:text-lg">
                  Vision
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {ABOUT.vision}
                </p>
              </div>
            </div>
          </section>

          {/* 1b — Full-bleed image + cream card (reference layout) */}
          <AboutDreamsImageSection />

          {/* 2 — Story + at a glance */}
          <section
            id="our-story"
            className="scroll-mt-24 py-16 sm:py-24 lg:py-28"
          >
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                  Know more about us
                </span>
                <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl md:text-4xl">
                  Rooted in Palakkad,{" "}
                  <span className="font-normal text-muted-foreground">
                    built on trust
                  </span>
                </h2>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  {ABOUT.shortStory}
                </p>
                {ABOUT.storyParagraphs.map((p, i) => (
                  <p
                    key={i}
                    className="mt-4 text-base leading-relaxed text-muted-foreground"
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div className="relative">
                <div className="rounded-2xl border-2 border-brand-gold/40 bg-muted/40 p-8 shadow-sm sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                    At a glance
                  </p>
                  <p className="mt-4 font-heading text-5xl font-bold text-brand-charcoal sm:text-6xl">
                    {ABOUT.yearsExperience}+
                  </p>
                  <p className="mt-2 text-lg font-medium text-brand-charcoal">
                    Years serving buyers &amp; sellers
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Local expertise across plots, land, and residential property
                    in Palakkad district — with transparent fees and clear
                    advice.
                  </p>
                  <blockquote className="mt-8 border-l-2 border-brand-gold/50 pl-4 text-sm italic leading-relaxed text-brand-charcoal/90">
                    &ldquo;{TEAM_TESTIMONIAL.quote}&rdquo;
                  </blockquote>
                  <p className="mt-3 text-xs font-semibold text-brand-gold">
                    — {TEAM_TESTIMONIAL.name}, {TEAM_TESTIMONIAL.role}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4 — Trusted partner: dark band + cream cards */}
          <section className="rounded-2xl bg-[#1e1b1b] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <h2 className="mx-auto max-w-3xl text-center text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl md:text-[2rem]">
              {ABOUT.trustedPartnerSection.title}
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 xl:grid-cols-4 xl:gap-6">
              {ABOUT.trustedPartnerSection.cards.map((card) => {
                const Icon = TRUSTED_PARTNER_ICONS[card.iconKey];
                return (
                  <article
                    key={card.title}
                    className="flex min-h-[260px] flex-col rounded-2xl bg-[#fdfaf3] p-8 text-brand-charcoal shadow-sm sm:min-h-[280px]"
                  >
                    <Icon
                      className="h-7 w-7 shrink-0 text-brand-charcoal"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <h3 className="mt-6 text-lg font-bold leading-snug">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75">
                      {card.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 6 — Why choose us bento */}
          <section className="py-16 sm:py-24 lg:py-28">
            <div className="mb-10 sm:mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                Why choose us
              </span>
              <h2 className="font-heading mt-3 text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
                The Palakkad difference
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Real relationships and local knowledge — not a call centre. Here
                is what guides every recommendation we make.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch lg:gap-5">
              <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border shadow-sm lg:col-span-5 lg:min-h-0">
                <Image
                  src={PAGE_HERO_IMAGES.about}
                  alt="Professional real estate and property advisory in Palakkad"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/88 via-brand-charcoal/40 to-brand-charcoal/20" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                    Charting our course
                  </p>
                  <h3 className="font-heading mt-3 text-xl font-bold text-white sm:text-2xl">
                    Trusted brokerage for every kind of property
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    From first conversation to registration and beyond — we stay
                    close so you always know the next step.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
                {ABOUT_WHY_CHOOSE_US.map((item, index) => {
                  const Icon = WHY_US_ICONS[item.iconKey];
                  const tinted = index % 2 === 1;
                  return (
                    <div
                      key={item.title}
                      className={`rounded-2xl border border-border p-6 shadow-sm transition-colors hover:border-brand-gold/30 sm:p-8 ${
                        tinted ? "bg-brand-gold/10" : "bg-white"
                      }`}
                    >
                      <div
                        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${
                          tinted
                            ? "bg-brand-charcoal text-white"
                            : "bg-muted text-brand-gold"
                        }`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-brand-charcoal">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 8 — FAQ */}
          <AboutFaqSection />
        </div>
      </div>
    </>
  );
}
