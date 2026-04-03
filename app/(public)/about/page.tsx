import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  MapPin,
  Shield,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  ABOUT,
  ABOUT_FAQ,
  ABOUT_WHY_CHOOSE_US,
  CONTACT,
  PAGE_HERO_IMAGES,
  SITE_NAME,
  TEAM,
  TEAM_TESTIMONIAL,
  type AboutWhyChooseUsIconKey,
} from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

const WHY_US_ICONS: Record<AboutWhyChooseUsIconKey, LucideIcon> = {
  Shield,
  MapPin,
  Users,
  Award,
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
  const [featuredValue, ...otherValues] = ABOUT.values;
  const foundingYear = new Date().getFullYear() - ABOUT.yearsExperience;

  return (
    <>
      <AboutJsonLd />

      {/* 1 — Editorial hero: cream panel, headline, mission/vision, feature image */}
      <section className="bg-[#F5F0EB] pb-0 pt-28 sm:pt-32 md:pt-36 lg:pt-40">
        <div className={publicContentFrameClass}>
          <h1 className="font-heading text-[clamp(2.25rem,5vw+0.5rem,4.5rem)] leading-[1.08] tracking-tight text-brand-charcoal">
            <span className="font-normal italic">Explore your real estate</span>{" "}
            <span className="font-bold">
              dream into reality.
              <br />
              Sharing home since {foundingYear}.
            </span>
          </h1>

          <div className="mt-10 grid gap-8 sm:mt-12 md:grid-cols-3 md:gap-10 lg:mt-16 lg:gap-14">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px] md:max-w-none">
              At {SITE_NAME}, we&apos;re redefining how people find homes by
              blending smart technology with human expertise. Our mission is to
              make real estate simple, transparent, and personalized for every
              client.
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
        </div>

        <div className="relative mt-12 aspect-[16/7] w-full sm:mt-16 lg:mt-20">
          <Image
            src={PAGE_HERO_IMAGES.about}
            alt="Modern home at dusk — Palakkad real estate brokerage"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
      </section>

      {/* 2 — Story + at a glance */}
      <section
        id="our-story"
        className="scroll-mt-24 bg-white py-16 sm:py-24 lg:py-28"
      >
        <div className={publicContentFrameClass}>
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
                  in Palakkad district — with transparent fees and clear advice.
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
        </div>
      </section>

      {/* 3 — Stats strip */}
      <section className="bg-brand-charcoal py-12 text-white sm:py-16">
        <div className={publicContentFrameClass}>
          <h2 className="sr-only">Company statistics</h2>
          <div className="grid grid-cols-2 gap-8 sm:gap-12 xl:grid-cols-4">
            {ABOUT.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-brand-gold sm:text-4xl md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/80 sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Core values / playbook bento */}
      <section className="bg-white py-16 sm:py-24 lg:py-28">
        <div className={publicContentFrameClass}>
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              {ABOUT.coreValuesIntro.eyebrow}
            </span>
            <h2 className="font-heading mt-3 text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
              Explore our{" "}
              <span className="font-normal text-muted-foreground">
                company playbook
              </span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              {ABOUT.coreValuesIntro.subtitle}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
            <article className="group relative min-h-[320px] overflow-hidden rounded-2xl border border-border shadow-sm transition-colors hover:border-brand-gold/30 lg:col-span-7 lg:min-h-[520px]">
              <Image
                src={featuredValue.image}
                alt={featuredValue.imageAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/90 via-brand-charcoal/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <h3 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {featuredValue.title}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
                  {featuredValue.description}
                </p>
              </div>
            </article>
            <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
              {otherValues.map((v) => (
                <article
                  key={v.title}
                  className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm transition-colors hover:border-brand-gold/30 sm:flex-row"
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 bg-muted sm:aspect-auto sm:h-auto sm:w-[44%] sm:min-h-[140px]">
                    <Image
                      src={v.image}
                      alt={v.imageAlt}
                      fill
                      className="object-cover sm:object-center"
                      sizes="(max-width: 640px) 100vw, 22vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
                    <h3 className="font-heading text-lg font-bold text-brand-charcoal">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {v.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Why choose us bento */}
      <section className="border-t border-border bg-muted/40 py-16 sm:py-24 lg:py-28">
        <div className={publicContentFrameClass}>
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
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border shadow-sm lg:col-span-5 lg:min-h-0 lg:row-span-2">
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
        </div>
      </section>

      {/* 7 — Team */}
      <section className="border-t border-border bg-white py-16 sm:py-24 lg:py-28">
        <div className={publicContentFrameClass}>
          <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                Our team
              </span>
              <h2 className="font-heading mt-3 text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
                Meet the people behind {SITE_NAME}
              </h2>
              <p className="mt-3 text-muted-foreground">
                A Palakkad-first team that meets every owner and walks every
                property before recommending it to you.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-charcoal underline-offset-4 hover:text-brand-gold hover:underline"
            >
              {CONTACT.contactUsLabel}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
            {TEAM.map((member) => (
              <article
                key={member.name}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="relative aspect-[4/5] w-full bg-muted">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-heading text-lg font-bold text-brand-charcoal">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-brand-gold">
                    {member.role}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {member.description}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-brand-charcoal underline-offset-4 transition-colors hover:text-brand-gold hover:underline"
                  >
                    {CONTACT.contactUsLabel}
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — Founder testimonial */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-24">
        <div className={publicContentFrameClass}>
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="mx-auto mb-8 flex max-w-md items-center gap-0"
              aria-hidden
            >
              <div className="h-px min-w-0 flex-1 bg-border" />
              <div className="flex shrink-0 items-center justify-center px-4">
                <Sparkles
                  className="h-5 w-5 text-brand-gold"
                  strokeWidth={1.75}
                />
              </div>
              <div className="h-px min-w-0 flex-1 bg-border" />
            </div>
            <blockquote className="font-heading text-lg font-medium leading-snug text-brand-charcoal sm:text-xl md:text-2xl md:leading-snug">
              &ldquo;{TEAM_TESTIMONIAL.quote}&rdquo;
            </blockquote>
            <footer className="mt-10 flex flex-col items-center gap-3">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-muted shadow-sm ring-4 ring-white">
                <Image
                  src={TEAM_TESTIMONIAL.image}
                  alt={`${TEAM_TESTIMONIAL.name}, ${TEAM_TESTIMONIAL.role}`}
                  fill
                  className="object-cover object-top"
                  sizes="64px"
                />
              </div>
              <div>
                <cite className="not-italic text-base font-semibold text-brand-charcoal">
                  {TEAM_TESTIMONIAL.name}
                </cite>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {TEAM_TESTIMONIAL.role}
                </p>
              </div>
            </footer>
          </div>
        </div>
      </section>

      {/* 9 — FAQ */}
      <section className="border-t border-border bg-white py-16 sm:py-24 lg:py-28">
        <div className={publicContentFrameClass}>
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              FAQ
            </span>
            <h2 className="font-heading mt-3 text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Quick answers about how we work in Palakkad real estate.
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-3 sm:gap-4">
            {ABOUT_FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-border bg-muted/20 px-5 py-1 transition-colors open:bg-muted/40 open:shadow-sm sm:px-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-brand-charcoal [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    className="shrink-0 text-brand-gold transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-border/60 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — CTA */}
      <section className="border-t border-border bg-white pb-16 sm:pb-24 lg:pb-28">
        <div className={publicContentFrameClass}>
          <div className="overflow-hidden rounded-2xl bg-brand-charcoal px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading max-w-lg text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                  Ready to find your perfect property?
                </h2>
                <p className="mt-3 max-w-md text-sm text-white/75 sm:text-base">
                  Browse listings or get in touch — we will help you plan your
                  next step in Palakkad.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-gold px-8 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                >
                  Contact us
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/properties"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-brand-gold px-8 py-3 text-center font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                >
                  View properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
