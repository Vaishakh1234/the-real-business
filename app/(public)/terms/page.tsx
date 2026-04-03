import type { Metadata } from "next";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export const metadata: Metadata = {
  title: "Terms of Service — The Real Business",
  description:
    "Terms of Service for The Real Business. Read our terms governing the use of our website and real estate services.",
};

const lastUpdated = "2025-03-15";

export default function TermsPage() {
  return (
    <>
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
                Terms of <span className="italic font-light">Service</span>
              </h1>
              <p className="text-white/50 text-base leading-relaxed mt-6 max-w-xl">
                Please review these terms carefully. By using our website and
                services, you agree to be bound by the conditions outlined
                below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16 sm:py-24">
        <div className={publicContentFrameClass}>
          <ol className="mx-auto max-w-5xl list-none space-y-12 sm:space-y-16">
            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                01
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Acceptance of Terms
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  By accessing or using the website and services of The Real
                  Business (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
                  you agree to comply with and be bound by these Terms of
                  Service. If you do not agree to these terms, please do not use
                  our website or services.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                02
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Use of Service
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Our website and services are provided for lawful purposes
                  related to real estate search, inquiry, and engagement. You
                  agree not to use our services to violate any applicable laws,
                  infringe on the rights of others, or transmit harmful or
                  offensive content. We reserve the right to suspend or
                  terminate access at our discretion.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                03
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Intellectual Property
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  All content on this website, including but not limited to
                  text, images, logos, and design, is the property of The Real
                  Business or its licensors and is protected by copyright and
                  other intellectual property laws. You may not reproduce,
                  distribute, or create derivative works without our prior
                  written consent.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                04
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Disclaimer
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Property listings and information on our website are provided
                  for general informational purposes. We do not guarantee the
                  accuracy, completeness, or availability of any listing. All
                  real estate transactions are subject to separate agreements
                  and due diligence. We recommend that you verify all details
                  and seek independent legal or financial advice as needed.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                05
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  To the fullest extent permitted by law, The Real Business
                  shall not be liable for any indirect, incidental, special, or
                  consequential damages arising from your use of our website or
                  services. Our total liability shall not exceed the amount you
                  paid to us, if any, in the twelve months preceding the claim.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                06
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Governing Law
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  These Terms of Service shall be governed by and construed in
                  accordance with the laws of India. Any disputes arising from
                  these terms or your use of our services shall be subject to
                  the exclusive jurisdiction of the courts in India.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                07
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Changes to Terms
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  We may update these Terms of Service from time to time. We
                  will post the updated terms on this page and update the
                  &quot;Last updated&quot; date. Your continued use of our
                  website after changes constitutes acceptance of the revised
                  terms.
                </p>
              </div>
            </li>

            <li className="flex gap-6 sm:gap-10">
              <span className="shrink-0 text-2xl sm:text-3xl font-bold text-brand-gold/80">
                08
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                  Contact
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  For questions about these Terms of Service, please contact us
                  at{" "}
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
