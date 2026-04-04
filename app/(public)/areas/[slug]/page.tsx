import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DirectoryPropertyListingCard } from "@/components/properties/PropertyListingCard";
import { getSeoAreaBySlug } from "@/lib/constants/areas";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { SITE_NAME } from "@/lib/constants/site";
import { getProperties } from "@/lib/queries/properties";
import { absoluteUrl } from "@/lib/seo/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getSeoAreaBySlug(slug);
  if (!area) return { title: "Area not found" };
  const title = `Property for Sale & Rent in ${area.name}, Palakkad | ${SITE_NAME}`;
  const description = `${area.headline}. Browse curated listings and get marketing, consultancy, and transaction support in ${area.name}, Palakkad district, Kerala.`;
  const path = `/areas/${area.slug}`;
  return {
    title,
    alternates: { canonical: path },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      url: absoluteUrl(path),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AreaDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = getSeoAreaBySlug(slug);
  if (!area) notFound();

  const { data: listings } = await getProperties({
    city: area.cityFilter,
    status: "active",
    limit: 24,
    page: 1,
    sort: "newest",
  });

  const path = `/areas/${area.slug}`;
  const listingsUrl = `/properties?city=${encodeURIComponent(area.cityFilter)}`;

  const placeLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${area.name}, Palakkad`,
    description: area.introParagraphs.join(" "),
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Palakkad",
      containedInPlace: { "@type": "Country", name: "India" },
    },
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Listings in ${area.name}`,
    numberOfItems: listings.length,
    itemListElement: listings.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/properties/${encodeURIComponent(p.slug)}`),
      name: p.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Areas", href: "/areas" },
          { label: area.name },
        ]}
        currentPath={path}
      />
      <div className="pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className={publicContentFrameClass}>
          <header className="max-w-3xl">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl">
              {area.headline}
            </h1>
            {area.introParagraphs.map((p, i) => (
              <p
                key={i}
                className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base"
              >
                {p}
              </p>
            ))}
          </header>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={listingsUrl}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-charcoal px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Open all filtered listings
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-gold hover:bg-brand-gold/10"
            >
              Talk to our team
            </Link>
          </div>

          <section className="mt-12" aria-labelledby="area-listings-heading">
            <h2
              id="area-listings-heading"
              className="font-heading text-xl font-bold text-brand-charcoal sm:text-2xl"
            >
              Active listings in {area.name}
            </h2>
            {listings.length === 0 ? (
              <p className="mt-4 text-muted-foreground">
                No active listings match this filter right now.{" "}
                <Link
                  href="/properties"
                  className="font-medium text-brand-gold hover:underline"
                >
                  Browse all properties
                </Link>{" "}
                or{" "}
                <Link
                  href="/contact"
                  className="font-medium text-brand-gold hover:underline"
                >
                  contact us
                </Link>{" "}
                for an off-market shortlist.
              </p>
            ) : (
              <ul className="mt-6 flex flex-col gap-5">
                {listings.map((p, i) => (
                  <li key={p.id}>
                    <DirectoryPropertyListingCard property={p} index={i} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
