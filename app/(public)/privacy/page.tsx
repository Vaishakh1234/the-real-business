import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Database,
  Target,
  Handshake,
  Users,
  Lock,
  Cookie,
  UserCheck,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";
import { SITE_NAME, CONTACT } from "@/lib/constants/site";
import { getSiteOrigin } from "@/lib/seo/site";

const privacyTitle = "Privacy Policy — The Real Business";
const privacyDescription =
  "Privacy Policy for The Real Business — learn how we collect, use, protect, and store your personal and business information through our real estate consultancy, property marketing, and transaction facilitation services in Palakkad.";

export const metadata: Metadata = {
  title: privacyTitle,
  alternates: { canonical: "/privacy" },
  description: privacyDescription,
  keywords: [
    "The Real Business privacy policy",
    "real estate data privacy",
    "property consultancy privacy",
    "client data protection",
    "Palakkad real estate privacy",
  ],
  ...defaultPageOgTwitter("/privacy", privacyTitle, privacyDescription),
};

const lastUpdated = "2026-04-05";

const SECTIONS = [
  {
    id: "commitment",
    number: "01",
    title: "Our Commitment",
    icon: Shield,
    highlight:
      "Your confidentiality and data security are fundamental to how we operate.",
    paragraphs: [
      `${SITE_NAME} is committed to maintaining the confidentiality and security of all personal and business information collected through its website, onboarding process, and communication channels.`,
    ],
  },
  {
    id: "information-collected",
    number: "02",
    title: "Information We Collect",
    icon: Database,
    highlight:
      "We collect only what is necessary to serve you effectively and transparently.",
    paragraphs: [
      `Information may be collected via forms, calls, messages, or direct interactions. The types of data we may collect include:`,
    ],
    bullets: [
      "Names and contact details",
      "Property information and ownership details",
      "Investment preferences and budget parameters",
      "Transaction-related data and communication records",
    ],
  },
  {
    id: "purpose",
    number: "03",
    title: "Purpose of Collection",
    icon: Target,
    highlight:
      "Every piece of information we collect serves a clear, defined purpose aligned with your goals.",
    paragraphs: [
      `Your information is collected and used for the following purposes:`,
    ],
    bullets: [
      "Providing real estate consultancy and advisory services",
      "Facilitating property transactions between buyers and sellers",
      "Executing marketing activities for listed properties",
      "Improving service efficiency and client experience",
    ],
  },
  {
    id: "consent",
    number: "04",
    title: "Consent & Data Processing",
    icon: Handshake,
    highlight:
      "By engaging with our services, you consent to our responsible handling of your data.",
    paragraphs: [
      `By engaging with our services, users consent to the collection, use, storage, and processing of such information in accordance with this policy.`,
      `Consent is established through our onboarding process and continued use of our services and communication channels.`,
    ],
  },
  {
    id: "sharing",
    number: "05",
    title: "Information Sharing",
    icon: Users,
    highlight:
      "Your data is shared only when necessary — and only with relevant, authorized parties.",
    paragraphs: [
      `Information may be shared only with relevant parties when necessary for transaction completion or legal compliance. These parties may include:`,
    ],
    bullets: [
      "Buyers and sellers involved in a transaction",
      "Brokers and marketing platforms facilitating property promotion",
      "Legal authorities when required by law or regulation",
    ],
    footnote: `${SITE_NAME} does not sell or misuse client information under any circumstances.`,
  },
  {
    id: "data-protection",
    number: "06",
    title: "Data Protection",
    icon: Lock,
    highlight:
      "We implement reasonable security measures to safeguard your information from unauthorized access.",
    paragraphs: [
      `${SITE_NAME} ensures reasonable measures to protect data from unauthorized access, alteration, disclosure, or destruction.`,
    ],
    bullets: [
      "Access is limited strictly to authorized personnel",
      "Client information is never sold or shared for unrelated purposes",
      "Security protocols are regularly reviewed and updated",
    ],
  },
  {
    id: "cookies",
    number: "07",
    title: "Cookies & Technology",
    icon: Cookie,
    highlight:
      "We use standard web technologies to enhance your browsing experience.",
    paragraphs: [
      `Our website may use cookies or similar technologies to enhance user experience and analyze site performance.`,
      `You can manage cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.`,
    ],
  },
  {
    id: "your-rights",
    number: "08",
    title: "Your Rights",
    icon: UserCheck,
    highlight:
      "You retain control over your personal data and can exercise your rights at any time.",
    paragraphs: [
      `Users retain the right to request the following, subject to applicable legal obligations:`,
    ],
    bullets: [
      "Access to their personal data held by us",
      "Correction of inaccurate or incomplete information",
      "Deletion of personal data when no longer required",
    ],
  },
  {
    id: "third-party",
    number: "09",
    title: "Third-Party Links",
    icon: ExternalLink,
    highlight:
      "External platforms linked from our services operate under their own privacy policies.",
    paragraphs: [
      `Any third-party links or platforms associated with our services operate under their own privacy policies.`,
      `${SITE_NAME} holds no responsibility for the privacy practices of external websites. We encourage you to review their policies before providing any personal information.`,
    ],
  },
  {
    id: "policy-updates",
    number: "10",
    title: "Policy Updates",
    icon: RefreshCw,
    highlight:
      "This policy may evolve — continued use of our services implies acceptance of the latest version.",
    paragraphs: [
      `This privacy policy may be updated periodically without prior notice to reflect changes in our practices or legal requirements.`,
      `Continued use of our services following any updates implies acceptance of the revised policy.`,
    ],
  },
] as const;

export default function PrivacyPage() {
  const origin = getSiteOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description: privacyDescription,
    url: `${origin}/privacy`,
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
        items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        currentPath="/privacy"
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-charcoal pt-14 pb-16 sm:pt-20 sm:pb-24 min-h-[240px] sm:min-h-[360px] lg:min-h-[420px] flex items-end">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(183,147,84,0.15),transparent)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

        <div className={`${publicContentFrameClass} relative w-full`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-10">
            <div className="max-w-3xl">
              <p className="text-brand-gold/70 text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-4 sm:mb-6 flex items-center gap-2.5 sm:gap-3 font-medium">
                <span className="h-px w-6 sm:w-10 bg-brand-gold/40 inline-block" />
                Legal
              </p>
              <h1 className="font-heading text-[2rem] xs:text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-bold text-white leading-[0.95] tracking-tight">
                Privacy{" "}
                <span className="italic font-light text-brand-gold/90">
                  Policy
                </span>
              </h1>
              <p className="text-white/55 text-sm sm:text-base md:text-lg leading-relaxed mt-4 sm:mt-6 max-w-xl">
                Your privacy matters to us. This policy explains how we collect,
                use, protect, and store your information when you engage with{" "}
                {SITE_NAME}.
              </p>
              <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-white/40 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                Last updated: <time dateTime={lastUpdated}>5 April 2026</time>
              </p>
            </div>

            {/* Quick-nav sidebar */}
            <nav
              aria-label="Privacy policy sections"
              className="hidden lg:block shrink-0"
            >
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
                In this page
              </p>
              <ol className="space-y-1.5 max-h-[240px] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:rgba(183,147,84,0.3)_transparent]">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-center gap-2.5 text-sm text-white/50 hover:text-brand-gold transition-colors"
                    >
                      <span className="font-bold text-brand-gold/60 group-hover:text-brand-gold text-xs tabular-nums">
                        {s.number}
                      </span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="border-b border-brand-gold/10 bg-white">
        <div
          className={`${publicContentFrameClass} py-6 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-brand-gold" aria-hidden />
            </div>
            <p className="font-heading text-base sm:text-lg font-semibold text-brand-charcoal">
              Your Data, Protected
            </p>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            We never sell your personal information. All data is handled with
            strict confidentiality and shared only when necessary for completing
            your real estate transaction or meeting legal requirements.
          </p>
        </div>
      </section>

      {/* ── Policy Content ── */}
      <section className="py-10 sm:py-16 md:py-24">
        <div className={publicContentFrameClass}>
          <div className="mx-auto max-w-5xl space-y-12 sm:space-y-16 md:space-y-20">
            {SECTIONS.map((section, idx) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="group scroll-mt-20 sm:scroll-mt-24"
                >
                  {/* Section header */}
                  <div className="flex items-start gap-4 sm:gap-5 md:gap-8 mb-4 sm:mb-6">
                    <div className="shrink-0 relative">
                      <span className="block text-3xl sm:text-4xl md:text-5xl font-bold text-brand-gold/15 leading-none tabular-nums select-none">
                        {section.number}
                      </span>
                      <div className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                        <Icon
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-brand-gold"
                          aria-hidden
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-brand-charcoal leading-tight">
                        {section.title}
                      </h2>
                      <p className="mt-1.5 sm:mt-2 text-brand-gold/80 text-xs sm:text-sm md:text-base font-medium italic leading-relaxed">
                        {section.highlight}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="ml-0 sm:ml-[4rem] md:ml-[4.5rem] lg:ml-[5.5rem] space-y-3 sm:space-y-4">
                    {section.paragraphs.map((p, pi) => (
                      <p
                        key={pi}
                        className="text-muted-foreground text-sm sm:text-base leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}

                    {"bullets" in section && section.bullets && (
                      <ul className="mt-2.5 sm:mt-3 space-y-2 sm:space-y-2.5 pl-0.5 sm:pl-1">
                        {section.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="flex items-start gap-2.5 sm:gap-3 text-brand-charcoal"
                          >
                            <CheckCircle2
                              className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-brand-gold/70 mt-0.5"
                              aria-hidden
                            />
                            <span className="text-sm sm:text-base">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {"footnote" in section && section.footnote && (
                      <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-brand-charcoal/80 bg-brand-gold/5 border-l-2 border-brand-gold/30 pl-3 sm:pl-4 py-2 rounded-r-md">
                        {section.footnote}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  {idx < SECTIONS.length - 1 && (
                    <div className="mt-10 sm:mt-14 md:mt-16 flex items-center gap-3 sm:gap-4">
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
        <div className={`${publicContentFrameClass} py-10 sm:py-16 md:py-20`}>
          <div className="mx-auto max-w-2xl rounded-xl sm:rounded-2xl border border-brand-gold/15 bg-white/60 backdrop-blur-sm px-5 py-8 sm:px-10 sm:py-12 md:px-12 md:py-14 text-center shadow-sm">
            <p className="text-brand-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-3 sm:mb-4 font-medium">
              Privacy concerns?
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal mb-3 sm:mb-4">
              Get in touch with us
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              For any privacy-related concerns, data requests, or questions
              about this policy, please contact {SITE_NAME} through our official
              communication channels.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-charcoal px-6 py-3 min-h-[44px] text-sm font-semibold text-white shadow-lg shadow-brand-charcoal/10 transition-all hover:bg-brand-charcoal/90 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 touch-manipulation"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {CONTACT.email && (
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-gold/25 px-5 sm:px-6 py-3 min-h-[44px] text-xs sm:text-sm font-medium text-brand-charcoal/70 transition-colors hover:border-brand-gold/50 hover:text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 touch-manipulation truncate"
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
