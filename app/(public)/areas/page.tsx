import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO_AREAS } from "@/lib/constants/areas";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { SITE_NAME } from "@/lib/constants/site";
import { absoluteUrl } from "@/lib/seo/site";

const title = "Properties by Location in Palakkad District";
const description = `Browse real estate by locality across Palakkad district, Kerala — plots, land, houses, and commercial listings with ${SITE_NAME}.`;

export const metadata: Metadata = {
  title,
  alternates: { canonical: "/areas" },
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: absoluteUrl("/areas"),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

function AreasJsonLd() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Areas we serve — ${SITE_NAME}`,
    numberOfItems: SEO_AREAS.length,
    itemListElement: SEO_AREAS.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.name,
      url: absoluteUrl(`/areas/${a.slug}`),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}

export default function AreasHubPage() {
  return (
    <>
      <AreasJsonLd />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Areas" }]}
        currentPath="/areas"
      />
      <div className={`${publicContentFrameClass} py-10 sm:py-14 lg:py-16`}>
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            Local expertise
          </p>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {description} Each area page lists active properties filtered for
            that locality and explains what buyers and sellers typically care
            about on the ground.
          </p>
        </header>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SEO_AREAS.map((area) => (
            <li key={area.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-brand-gold/30 bg-white/70 p-6 shadow-sm transition-shadow hover:shadow-md">
                <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                  <Link
                    href={`/areas/${area.slug}`}
                    className="hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
                  >
                    {area.name}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {area.introParagraphs[0]?.slice(0, 160)}…
                </p>
                <Link
                  href={`/areas/${area.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-brand-gold hover:underline"
                >
                  View listings in {area.name}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
