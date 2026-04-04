import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/constants/site";
import { getCachedActivePropertyByIdentifier } from "@/lib/seo/property-page";
import { getSiteOrigin } from "@/lib/seo/site";
import { formatPropertyPriceValue } from "@/lib/utils";
import { PropertyDetailPublicClient } from "./PropertyDetailPublicClient";
import { PropertyProductJsonLd } from "./PropertyProductJsonLd";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getCachedActivePropertyByIdentifier(id);
  if (!property) {
    return {
      title: "Listing unavailable",
      robots: { index: false, follow: true },
    };
  }

  const canonicalPath = `/properties/${encodeURIComponent(property.slug)}`;
  const price = formatPropertyPriceValue(
    property.price,
    property.price_type ?? undefined,
  );
  const typeLabel = property.type === "sale" ? "for sale" : "for rent";
  const bhk = property.bedrooms != null ? `${property.bedrooms} BHK ` : "";
  const structure = property.structure_type === "plot" ? "Plot / land " : "";

  const baseDesc = property.short_description?.trim() || property.title;
  const description =
    property.meta_description?.trim() ||
    `${baseDesc} — ${bhk}${structure}${typeLabel} in ${property.city}, Kerala. Price: ${price}. ${SITE_NAME}.`.slice(
      0,
      160,
    );

  const title =
    property.meta_title?.trim() || `${property.title} · ${property.city}`;

  const keywordsFromDb = property.meta_keywords
    ?.split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const ogImage =
    property.og_image_url?.trim() || property.cover_image_url || undefined;

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title,
    description,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: `${getSiteOrigin()}${canonicalPath}`,
  };
  if (ogImage) {
    openGraph.images = [{ url: ogImage, alt: property.title }];
  }

  return {
    title,
    description,
    keywords: keywordsFromDb?.length
      ? keywordsFromDb
      : [
          property.city,
          "Palakkad real estate",
          property.type === "sale"
            ? "property for sale Kerala"
            : "property for rent Kerala",
          SITE_NAME,
        ],
    alternates: { canonical: canonicalPath },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicPropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getCachedActivePropertyByIdentifier(id);

  return (
    <>
      {property ? (
        <>
          <PropertyProductJsonLd property={property} />
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/properties" },
              { label: property.title },
            ]}
            currentPath={`/properties/${encodeURIComponent(property.slug)}`}
          />
        </>
      ) : null}
      <PropertyDetailPublicClient identifier={id} />
    </>
  );
}
