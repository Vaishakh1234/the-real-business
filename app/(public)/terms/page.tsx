import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardCheck,
  ShieldCheck,
  Coins,
  Heart,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileSignature,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";
import { SITE_NAME, CONTACT } from "@/lib/constants/site";
import { getSiteOrigin } from "@/lib/seo/site";

const termsTitle = "Terms & Conditions — The Real Business";
const termsDescription =
  "Terms & Conditions for The Real Business — onboarding requirements, marketing rights, commission policy, professional conduct, and limitation of responsibility for our real estate consultancy services in Palakkad.";

export const metadata: Metadata = {
  title: termsTitle,
  alternates: { canonical: "/terms" },
  description: termsDescription,
  keywords: [
    "The Real Business terms and conditions",
    "real estate consultancy terms",
    "property marketing onboarding",
    "commission policy real estate",
    "Palakkad real estate terms",
  ],
  ...defaultPageOgTwitter("/terms", termsTitle, termsDescription),
};

const lastUpdated = "2026-04-05";

const TERMS = [
  {
    id: "onboarding-requirement",
    number: "01",
    title: "Onboarding Requirement",
    icon: ClipboardCheck,
    highlight:
      "Professionalism and clarity are our priority — every engagement begins with a signed onboarding agreement.",
    paragraphs: [
      `Before initiating any property marketing or consultancy service, it is mandatory for all clients to complete and sign our official onboarding document.`,
      `No marketing, promotion, or deal-related activity will begin without a properly executed onboarding agreement.`,
      `The onboarding document serves as the primary agreement between the client and ${SITE_NAME}.`,
    ],
    bullets: [
      "Marketing rights",
      "Property ownership declarations",
      "Commission structure",
      "Service scope",
    ],
    bulletLabel:
      "All key terms — including the following — will be clearly defined and agreed upon within the onboarding document:",
  },
  {
    id: "marketing-rights",
    number: "02",
    title: "Marketing Rights",
    icon: ShieldCheck,
    highlight:
      "We market properties only after receiving authorized, documented consent.",
    paragraphs: [
      `${SITE_NAME} reserves the right to market properties only after receiving authorized consent through the onboarding process.`,
      `Unauthorized or verbal permissions will not be considered valid.`,
    ],
  },
  {
    id: "commission-policy",
    number: "03",
    title: "Commission Policy",
    icon: Coins,
    highlight:
      "Commission terms are transparent, mutually agreed, and legally acknowledged before any transaction.",
    paragraphs: [
      `Commission terms will be established within the onboarding document prior to any transaction:`,
    ],
    bullets: ["Clearly discussed", "Mutually agreed", "Legally acknowledged"],
  },
  {
    id: "professional-conduct",
    number: "04",
    title: "Professional Conduct",
    icon: Heart,
    highlight:
      "We hold ourselves to the highest standards of integrity in every interaction.",
    paragraphs: [
      `We are committed to maintaining the following principles in all dealings with clients and partners:`,
    ],
    bullets: [
      "Transparency",
      "Ethical practices",
      "Professional communication",
    ],
  },
  {
    id: "limitation-of-responsibility",
    number: "05",
    title: "Limitation of Responsibility",
    icon: AlertTriangle,
    highlight:
      "As a consultancy and facilitation firm, our responsibility is defined by the scope of our advisory role.",
    paragraphs: [
      `${SITE_NAME} acts as a consultancy and facilitation firm.`,
      `We are not liable for the following:`,
    ],
    bullets: [
      "Legal disputes related to property ownership",
      "Misrepresentation of property details provided by clients",
      "External transactional risks beyond our control",
    ],
  },
] as const;

export default function TermsPage() {
  const origin = getSiteOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms & Conditions",
    description: termsDescription,
    url: `${origin}/terms`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: origin,
    },
    dateModified: lastUpdated,
    inLanguage: "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
        currentPath="/terms"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-charcoal pt-20 pb-24 min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] flex items-end">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(183,147,84,0.15),transparent)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

        <div className={`${publicContentFrameClass} relative w-full`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div className="max-w-3xl">
              <p className="text-brand-gold/70 text-xs tracking-[0.25em] uppercase mb-6 flex items-center gap-3 font-medium">
                <span className="h-px w-10 bg-brand-gold/40 inline-block" />
                Legal
              </p>
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[0.95] tracking-tight">
                Terms &{" "}
                <span className="italic font-light text-brand-gold/90">
                  Conditions
                </span>
              </h1>
              <p className="text-white/55 text-base sm:text-lg leading-relaxed mt-6 max-w-xl">
                At {SITE_NAME}, every engagement is built on clarity, signed
                agreements, and professional standards. Please review these
                terms before we begin working together.
              </p>
              <p className="mt-5 text-sm text-white/40 flex items-center gap-2">
                <FileSignature className="h-4 w-4" aria-hidden />
                Last updated: <time dateTime={lastUpdated}>5 April 2026</time>
              </p>
            </div>

            {/* Quick-nav sidebar */}
            <nav
              aria-label="Terms sections"
              className="hidden lg:block shrink-0"
            >
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
                In this page
              </p>
              <ol className="space-y-1.5">
                {TERMS.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="group flex items-center gap-2.5 text-sm text-white/50 hover:text-brand-gold transition-colors"
                    >
                      <span className="font-bold text-brand-gold/60 group-hover:text-brand-gold text-xs tabular-nums">
                        {t.number}
                      </span>
                      <span>{t.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* ── Intro Strip ── */}
      <section className="border-b border-brand-gold/10 bg-white">
        <div
          className={`${publicContentFrameClass} py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8`}
        >
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <FileSignature className="h-5 w-5 text-brand-gold" aria-hidden />
            </div>
            <p className="font-heading text-lg font-semibold text-brand-charcoal">
              Onboarding-First Policy
            </p>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            All services require a signed onboarding document before any
            marketing, promotion, or transaction activity begins. This protects
            both parties and ensures full transparency.
          </p>
        </div>
      </section>

      {/* ── Terms Content ── */}
      <section className="py-16 sm:py-24">
        <div className={publicContentFrameClass}>
          <div className="mx-auto max-w-5xl space-y-16 sm:space-y-20">
            {TERMS.map((term, idx) => {
              const Icon = term.icon;
              return (
                <article
                  key={term.id}
                  id={term.id}
                  className="group scroll-mt-24"
                >
                  {/* Section header */}
                  <div className="flex items-start gap-5 sm:gap-8 mb-6">
                    <div className="shrink-0 relative">
                      <span className="block text-4xl sm:text-5xl font-bold text-brand-gold/15 leading-none tabular-nums select-none">
                        {term.number}
                      </span>
                      <div className="absolute -bottom-1 -right-1 h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                        <Icon
                          className="h-4 w-4 sm:h-5 sm:w-5 text-brand-gold"
                          aria-hidden
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal leading-tight">
                        {term.title}
                      </h2>
                      <p className="mt-2 text-brand-gold/80 text-sm sm:text-base font-medium italic">
                        {term.highlight}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="ml-0 sm:ml-[4.5rem] lg:ml-[5.5rem] space-y-4">
                    {"bulletLabel" in term && term.bulletLabel && (
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {term.bulletLabel}
                      </p>
                    )}

                    {term.paragraphs.map((p, pi) => (
                      <p
                        key={pi}
                        className="text-muted-foreground text-base leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}

                    {"bullets" in term && term.bullets && (
                      <ul className="mt-3 space-y-2.5 pl-1">
                        {term.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="flex items-start gap-3 text-brand-charcoal"
                          >
                            <CheckCircle2
                              className="h-5 w-5 shrink-0 text-brand-gold/70 mt-0.5"
                              aria-hidden
                            />
                            <span className="text-base">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Divider */}
                  {idx < TERMS.length - 1 && (
                    <div className="mt-14 sm:mt-16 flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-brand-gold/20 to-transparent" />
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-gold/30" />
                      <div className="h-px flex-1 bg-gradient-to-l from-brand-gold/20 to-transparent" />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="border-t border-brand-gold/15">
        <div className={`${publicContentFrameClass} py-16 sm:py-20`}>
          <div className="mx-auto max-w-2xl rounded-2xl border border-brand-gold/15 bg-white/60 backdrop-blur-sm px-8 py-12 sm:px-12 sm:py-14 text-center shadow-sm">
            <p className="text-brand-gold text-xs tracking-[0.2em] uppercase mb-4 font-medium">
              Questions about our terms?
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-charcoal mb-4">
              We&apos;re here to help
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed mb-8">
              If you have any questions about these Terms & Conditions or our
              onboarding process, please don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-charcoal px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-charcoal/10 transition-all hover:bg-brand-charcoal/90 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {CONTACT.email && (
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-brand-gold/25 px-6 py-3 text-sm font-medium text-brand-charcoal/70 transition-colors hover:border-brand-gold/50 hover:text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                >
                  {CONTACT.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
