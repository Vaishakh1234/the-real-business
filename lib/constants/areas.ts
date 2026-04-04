/**
 * Locality landing pages for Palakkad district SEO (`/areas/[slug]`).
 * `cityFilter` is passed to `getProperties({ city })` (ILIKE match).
 */
export interface SeoArea {
  slug: string;
  name: string;
  cityFilter: string;
  headline: string;
  introParagraphs: string[];
}

export const SEO_AREAS: SeoArea[] = [
  {
    slug: "palakkad-town",
    name: "Palakkad town",
    cityFilter: "Palakkad",
    headline: "Properties in Palakkad town and surrounding wards",
    introParagraphs: [
      "Palakkad town is the commercial and administrative heart of the district, with strong connectivity to Coimbatore, Thrissur, and the Palakkad Gap. Buyers often look here for flats, independent houses, and mixed-use plots with access to schools, hospitals, and transport.",
      "We list and advise on residential and commercial options across the town belt — with on-ground viewings, realistic pricing context, and coordination through documentation and registration when you are ready to proceed.",
    ],
  },
  {
    slug: "ottapalam",
    name: "Ottapalam",
    cityFilter: "Ottapalam",
    headline: "Land, plots, and homes in Ottapalam",
    introParagraphs: [
      "Ottapalam is a key taluk centre with steady demand for house plots, agricultural edges, and family homes. Road links toward Shoranur and the Bharathapuzha belt shape how buyers compare value across nearby villages.",
      "Our team supports marketing, consultancy, and end-to-end buying and selling in Ottapalam — from shortlisting to advocate coordination — with the same Palakkad-first transparency we apply across the district.",
    ],
  },
  {
    slug: "chittur",
    name: "Chittur",
    cityFilter: "Chittur",
    headline: "Real estate in Chittur and the eastern belt",
    introParagraphs: [
      "Chittur taluk draws interest for residential land, farm-adjacent parcels, and town-adjacent homes. Micro-locations and access roads matter as much as headline price — we help you read both before you commit.",
      "Browse active listings filtered for Chittur, or contact us for a curated shortlist aligned with your budget and timeline.",
    ],
  },
  {
    slug: "mannarkkad",
    name: "Mannarkkad",
    cityFilter: "Mannarkkad",
    headline: "Properties in Mannarkkad",
    introParagraphs: [
      "Mannarkkad connects the district toward Nilambur and the hill interfaces, with recurring demand for plots, houses, and investment land. Seasonal and road-improvement narratives can move comparables quickly — we keep advice grounded in recent deals.",
      "Use the listings below as a starting point; we can refine by exact locality, extent in cents, and documentation readiness.",
    ],
  },
  {
    slug: "shoranur",
    name: "Shoranur",
    cityFilter: "Shoranur",
    headline: "Homes and land near Shoranur junction",
    introParagraphs: [
      "Shoranur’s rail junction and NH connectivity make it a practical base for commuters and investors. Listings range from compact flats to larger land parcels in the wider Shoranur–Pattambi belt.",
      "We help you interpret distance-to-station, access roads, and title context alongside price — then support you through offer, agreement, and registration with your advocate.",
    ],
  },
  {
    slug: "pattambi",
    name: "Pattambi",
    cityFilter: "Pattambi",
    headline: "Property in Pattambi",
    introParagraphs: [
      "Pattambi combines town amenities with proximity to the river belt and agricultural hinterland. Buyers often weigh flood-plain history, road width, and school catchments — areas we surface during consultancy and viewings.",
      "Explore current listings for Pattambi or reach out for marketing support if you are selling in the locality.",
    ],
  },
];

export const SEO_AREA_SLUGS = SEO_AREAS.map((a) => a.slug);

export function getSeoAreaBySlug(slug: string): SeoArea | undefined {
  return SEO_AREAS.find((a) => a.slug === slug);
}

/** Match listing `city` to an area hub slug when the string equals `cityFilter`. */
export function getAreaSlugForCity(city: string | null | undefined): string | undefined {
  const t = city?.trim();
  if (!t) return undefined;
  const lower = t.toLowerCase();
  return SEO_AREAS.find((a) => a.cityFilter.toLowerCase() === lower)?.slug;
}
