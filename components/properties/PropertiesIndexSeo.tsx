import { SITE_NAME } from "@/lib/constants/site";
import { getLatestActiveProperties } from "@/lib/queries/properties";
import { absoluteUrl } from "@/lib/seo/site";

/**
 * ItemList + CollectionPage JSON-LD for the `/properties` directory (first page pool).
 */
export async function PropertiesIndexSeo() {
  let listings: Awaited<ReturnType<typeof getLatestActiveProperties>> = [];
  try {
    listings = await getLatestActiveProperties(8);
  } catch {
    listings = [];
  }

  const origin = absoluteUrl("/properties");
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Property listings — ${SITE_NAME}`,
    numberOfItems: listings.length,
    itemListElement: listings.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/properties/${encodeURIComponent(p.slug)}`),
      name: p.title,
    })),
  };

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Properties for sale and rent in Palakkad — ${SITE_NAME}`,
    description:
      "Browse plots, houses, villas, and commercial listings across Palakkad district, Kerala — curated by The Real Business.",
    url: origin,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: listings.length,
      itemListElement: listings.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.title,
          url: absoluteUrl(`/properties/${encodeURIComponent(p.slug)}`),
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "INR",
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10),
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
    </>
  );
}
