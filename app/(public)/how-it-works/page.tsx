import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { SITE_NAME } from "@/lib/constants/site";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";

const howTitle = `How It Works — ${SITE_NAME}`;
const howDescription =
  "How we support buyers and sellers in Palakkad — from market research and shortlisting to financing context, negotiation, and closing with advocate coordination.";

export const metadata: Metadata = {
  title: howTitle,
  alternates: { canonical: "/how-it-works" },
  description: howDescription,
  ...defaultPageOgTwitter("/how-it-works", howTitle, howDescription),
};

export default function HowItWorksPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "How it works" }]}
        currentPath="/how-it-works"
      />
      {/* Hero */}
      <section className="overflow-hidden bg-black pt-20 pb-24 min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] flex items-end">
        <div className={`${publicContentFrameClass} w-full`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-white/20 inline-block" />
                Process
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[0.95] tracking-tight max-w-3xl">
                How it <span className="italic font-light">works</span>
              </h1>
              <p className="text-white/50 text-base leading-relaxed mt-6 max-w-xl">
                From first search to keys in hand — we make your property
                journey simple, transparent, and successful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className={publicContentFrameClass}>
          <ol className="mx-auto max-w-5xl list-none space-y-12 sm:space-y-16">
            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                01
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Research Market
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Explore neighborhoods, property types, and prices to find the
                  right real estate opportunities. Our team provides market
                  insights, neighborhood guides, and tailored recommendations so
                  you can make informed decisions.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                02
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Secure Financing
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Arrange mortgage options and gather necessary funds for a
                  smooth purchase or lease. We connect you with trusted
                  financial partners and help you understand your budget and
                  financing options.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                03
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Close the Deal
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Finalize paperwork, negotiate terms, and complete your real
                  estate transaction. We guide you through every step — from
                  offer to closing — so the process is clear and stress-free.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
