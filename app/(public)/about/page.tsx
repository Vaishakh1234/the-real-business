import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
  ABOUT_TEAM_SECTION,
  ABOUT_WHY_CHOOSE_US,
  PAGE_HERO_IMAGES,
  SITE_NAME,
  TEAM,
  TEAM_TESTIMONIAL,
  type AboutTrustedPartnerIconKey,
  type AboutWhyChooseUsIconKey,
} from "@/lib/constants/site";
import { AboutDreamsImageSection } from "@/components/about/AboutDreamsImageSection";
import { AboutFaqSection } from "@/components/about/AboutFaqSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
  alternates: { canonical: "/about" },
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutJsonLd />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "About us" }]}
        currentPath="/about"
      />

      <div className={publicContentFrameClass}>
        {/* ── Hero ── */}
        <section className="pb-10 pt-6 sm:pb-12 sm:pt-8 md:pt-10 lg:pb-14 lg:pt-12">
          <h1 className="max-w-4xl font-heading text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] leading-[1.12] tracking-tight text-brand-charcoal">
            <span className="font-normal italic">Modern real estate</span>{" "}
            <span className="font-bold">
              marketing &amp; property consultancy.
            </span>
          </h1>

          <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 md:grid-cols-3 md:gap-10 lg:mt-12">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px] md:max-w-none">
              {SITE_NAME} is a modern real estate marketing and property
              consultancy firm focused on transforming how properties are
              bought, sold, and promoted. Whether you&apos;re a property owner,
              buyer, or investor, we simplify the process with a professional,
              data-driven approach.
            </p>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-brand-charcoal sm:text-base">
                Our Goal
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {ABOUT.mission}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-brand-charcoal sm:text-base">
                Our Vision
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
                About our brand
              </span>
              <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl lg:text-4xl">
                Strategy meets{" "}
                <span className="font-normal text-muted-foreground">
                  execution
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
                  Years of real estate expertise
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Combining market expertise, strategic consulting, and digital
                  marketing for faster, smarter real estate transactions.
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

        {/* ── Why Choose Us ── */}
        <section className="py-14 sm:py-20 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              Why choose us
            </span>
            <h2 className="font-heading mt-3 max-w-xl text-2xl font-bold text-brand-charcoal sm:text-3xl lg:text-[2.5rem] lg:leading-[1.15]">
              The Palakkad difference
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              Real relationships and local knowledge — not a call centre. Here
              is what guides every recommendation we make.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {ABOUT_WHY_CHOOSE_US.map((item, index) => {
              const Icon = WHY_US_ICONS[item.iconKey];
              return (
                <article
                  key={item.title}
                  className="group relative flex flex-col bg-white p-6 transition-colors duration-300 hover:bg-brand-gold/[0.06] sm:p-8"
                >
                  <span
                    className="font-heading text-[3.5rem] font-bold leading-none tracking-tight text-brand-gold/15 transition-colors duration-300 group-hover:text-brand-gold/25 sm:text-[4rem]"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-charcoal text-white sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                  </div>
                  <h3 className="font-heading mt-4 text-base font-bold text-brand-charcoal sm:text-[17px]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Meet the Team ── */}
        <section className="py-10 sm:py-14 md:py-20 lg:py-24 border-t border-neutral-200/90">
          <div className="flex flex-col items-center text-center mb-8 sm:mb-10 md:mb-14">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              Our leadership
            </span>
            <h2 className="font-heading mt-2.5 sm:mt-3 max-w-xl text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] lg:leading-[1.15] font-bold text-brand-charcoal">
              {ABOUT_TEAM_SECTION.title}
            </h2>
            <p className="mt-2.5 sm:mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              {ABOUT_TEAM_SECTION.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:gap-8 lg:grid-cols-4">
            {TEAM.map((member) => (
              <article
                key={member.name}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative aspect-square w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 200px, 220px"
                  />
                </div>
                <h3 className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg font-bold text-brand-charcoal">
                  {member.name}
                </h3>
                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-brand-gold leading-snug">
                  {member.role}
                </p>
                <p className="mt-1.5 sm:mt-2 max-w-[240px] text-xs sm:text-sm leading-relaxed text-muted-foreground hidden sm:block">
                  {member.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <AboutFaqSection />

        <section
          className="border-t border-neutral-200/90 pb-16 pt-12 sm:pb-20 sm:pt-16"
          aria-labelledby="about-next-steps-heading"
        >
          <h2
            id="about-next-steps-heading"
            className="font-heading text-center text-xl font-bold text-brand-charcoal sm:text-2xl"
          >
            Next steps
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground sm:text-[15px]">
            Explore services, browse Palakkad listings, or reach the team
            directly.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-charcoal px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-charcoal/90"
            >
              Our services
            </Link>
            <Link
              href="/properties"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-brand-gold px-6 py-3 text-center text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-white"
            >
              Browse properties
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-center text-sm font-semibold text-brand-charcoal transition-colors hover:bg-neutral-50"
            >
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
