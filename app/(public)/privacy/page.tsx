import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";

const privacyTitle = "Privacy Policy — The Real Business";
const privacyDescription =
  "Privacy Policy for The Real Business. Learn how we collect, use, and protect your personal information.";

export const metadata: Metadata = {
  title: privacyTitle,
  alternates: { canonical: "/privacy" },
  description: privacyDescription,
  ...defaultPageOgTwitter("/privacy", privacyTitle, privacyDescription),
};

const lastUpdated = "2026-03-15";

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Privacy policy" }]}
        currentPath="/privacy"
      />
      {/* Hero */}
      <section className="overflow-hidden bg-black pt-20 pb-24 min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] flex items-end">
        <div className={`${publicContentFrameClass} w-full`}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-white/20 inline-block" />
                Legal
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[0.95] tracking-tight max-w-3xl">
                Privacy <span className="italic font-light">Policy</span>
              </h1>
              <p className="text-white/50 text-base leading-relaxed mt-6 max-w-xl">
                Your privacy matters to us. This policy explains how we collect,
                use, and safeguard your personal information when you interact
                with our website and services.
              </p>
              <p className="mt-4 text-sm text-white/45">
                Last updated: <time dateTime={lastUpdated}>15 March 2026</time>
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
                  Information We Collect
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We may collect information you provide directly, such as your
                  name, email address, phone number, and message content when
                  you fill out our contact form, request a valuation, or express
                  interest in a property. We may also collect usage data, such
                  as IP address, browser type, and pages visited, to improve our
                  website and services.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                02
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We use the information we collect to respond to your
                  inquiries, provide real estate services, send relevant
                  property updates (with your consent), improve our website, and
                  comply with legal obligations. We do not sell your personal
                  information to third parties.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                03
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Cookies and Similar Technologies
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Our website may use cookies and similar technologies to
                  enhance your experience, remember your preferences, and
                  analyze traffic. You can control cookie settings through your
                  browser. Disabling certain cookies may affect the
                  functionality of our website.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                04
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Data Retention
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We retain your personal information only for as long as
                  necessary to fulfill the purposes described in this policy or
                  as required by law. When data is no longer needed, we will
                  securely delete or anonymize it.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                05
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Security
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no
                  method of transmission over the Internet is completely secure,
                  and we cannot guarantee absolute security.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                06
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Your Rights
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Depending on your location, you may have the right to access,
                  correct, or delete your personal information, object to or
                  restrict processing, and data portability. To exercise these
                  rights or ask questions about your data, please contact us
                  using the details below.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                07
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Third-Party Links
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Our website may contain links to third-party websites. We are
                  not responsible for the privacy practices of those sites. We
                  encourage you to read their privacy policies before providing
                  any personal information.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                08
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Changes to This Policy
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  post the updated policy on this page and update the &quot;Last
                  updated&quot; date. We encourage you to review this policy
                  periodically.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                09
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Contact Us
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  For questions about this Privacy Policy or your personal data,
                  please contact us at{" "}
                  <a
                    href="mailto:contact@therealbusiness.com"
                    className="text-brand-gold hover:underline"
                  >
                    contact@therealbusiness.com
                  </a>{" "}
                  or through our{" "}
                  <a
                    href="/contact"
                    className="text-brand-gold hover:underline"
                  >
                    Contact page
                  </a>
                  .
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
