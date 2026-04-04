import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GUIDES } from "@/lib/constants/guides";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { SITE_NAME } from "@/lib/constants/site";
import { absoluteUrl } from "@/lib/seo/site";

const title = "Real Estate Guides & Market Insights — Palakkad";
const description = `Practical guides for buyers, sellers, and NRIs in Kerala — documentation, registration, and investment context from ${SITE_NAME}.`;

export const metadata: Metadata = {
  title,
  alternates: { canonical: "/guides" },
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: absoluteUrl("/guides"),
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function GuidesHubPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Guides" }]}
        currentPath="/guides"
      />
      <div className={`${publicContentFrameClass} py-10 sm:py-14 lg:py-16`}>
        <header className="max-w-3xl">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-muted-foreground sm:text-lg">{description}</p>
        </header>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <article className="h-full rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <h2 className="font-heading text-lg font-bold text-brand-charcoal sm:text-xl">
                  <Link
                    href={`/guides/${g.slug}`}
                    className="hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
                  >
                    {g.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {g.description}
                </p>
                <Link
                  href={`/guides/${g.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-brand-gold hover:underline"
                >
                  Read guide
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
