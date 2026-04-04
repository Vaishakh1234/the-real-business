export const GUIDE_SLUGS = [
  "property-buying-guide-palakkad",
  "nri-property-investment-kerala",
  "property-document-checklist-kerala",
  "property-registration-process-kerala",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export interface GuideMeta {
  slug: GuideSlug;
  title: string;
  description: string;
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "property-buying-guide-palakkad",
    title: "Complete Property Buying Guide for Palakkad, Kerala (2026)",
    description:
      "Step-by-step guidance for buyers in Palakkad — documents, pricing, advocate role, registration context, and how The Real Business supports your purchase.",
  },
  {
    slug: "nri-property-investment-kerala",
    title: "NRI Property Investment Guide — Palakkad, Kerala",
    description:
      "Remote buying, power of attorney, repatriation basics, and working with family or advocates on the ground in Kerala.",
  },
  {
    slug: "property-document-checklist-kerala",
    title: "Property Document Checklist for Kerala — Complete List",
    description:
      "Title deed, encumbrance certificate, tax receipts, survey records, and other documents to verify before you pay or register.",
  },
  {
    slug: "property-registration-process-kerala",
    title: "Property Registration Process in Kerala — Step by Step",
    description:
      "Sub-registrar office workflow, stamp duty and registration charges context, e-stamping, and timelines for Kerala property registration.",
  },
];

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
