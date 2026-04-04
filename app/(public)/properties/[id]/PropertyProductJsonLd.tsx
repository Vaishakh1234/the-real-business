import { absoluteUrl } from "@/lib/seo/site";
import { SITE_NAME } from "@/lib/constants/site";
import type { PropertyWithRelations } from "@/types";

function plainDescription(property: PropertyWithRelations): string {
  const short = property.short_description?.trim();
  if (short) return short;
  const html = property.description ?? "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

export function PropertyProductJsonLd({
  property,
}: {
  property: PropertyWithRelations;
}) {
  const path = `/properties/${encodeURIComponent(property.slug)}`;
  const url = absoluteUrl(path);
  const images: string[] = [];
  if (property.cover_image_url) images.push(property.cover_image_url);
  if (property.gallery_images?.length) {
    for (const u of property.gallery_images) {
      if (u && !images.includes(u)) images.push(u);
    }
  }

  const additional: {
    "@type": "PropertyValue";
    name: string;
    value: string;
  }[] = [];
  if (property.bedrooms != null) {
    additional.push({
      "@type": "PropertyValue",
      name: "Bedrooms",
      value: String(property.bedrooms),
    });
  }
  if (property.bathrooms != null) {
    additional.push({
      "@type": "PropertyValue",
      name: "Bathrooms",
      value: String(property.bathrooms),
    });
  }
  if (property.area_sqft != null) {
    additional.push({
      "@type": "PropertyValue",
      name: "Area (sq ft)",
      value: String(property.area_sqft),
    });
  }
  if (property.total_cent != null) {
    additional.push({
      "@type": "PropertyValue",
      name: "Extent (cents)",
      value: String(property.total_cent),
    });
  }
  if (property.structure_type) {
    additional.push({
      "@type": "PropertyValue",
      name: "Structure type",
      value: property.structure_type === "plot" ? "Plot / land" : "House",
    });
  }
  if (property.listing_ref) {
    additional.push({
      "@type": "PropertyValue",
      name: "Listing reference",
      value: property.listing_ref,
    });
  }

  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: plainDescription(property),
    sku: property.listing_ref ?? property.id,
    url,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: property.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME },
      eligibleRegion: {
        "@type": "AdministrativeArea",
        name: property.city,
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: property.state,
        },
      },
    },
  };

  if (images.length) product.image = images;
  if (property.category?.name) {
    product.category = property.category.name;
  }
  if (additional.length) product.additionalProperty = additional;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
    />
  );
}
