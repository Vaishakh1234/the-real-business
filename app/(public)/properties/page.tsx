import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PropertiesPageSkeleton } from "@/components/properties/PropertiesPageSkeleton";
import { PropertiesIndexSeo } from "@/components/properties/PropertiesIndexSeo";
import { SITE_NAME } from "@/lib/constants/site";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";

const propertiesTitle = "Properties for Sale & Rent in Palakkad, Kerala";
const propertiesDescription = `Browse plots, land, houses, villas, and commercial property for sale and rent in Palakkad district, Kerala. Curated listings and local brokerage support with ${SITE_NAME}.`;

export const metadata: Metadata = {
  title: propertiesTitle,
  alternates: { canonical: "/properties" },
  description: propertiesDescription,
  keywords: [
    "property for sale Palakkad",
    "plots for sale Palakkad",
    "land for sale Kerala",
    "house for rent Palakkad",
    "real estate listings Palakkad",
    SITE_NAME,
  ],
  ...defaultPageOgTwitter(
    "/properties",
    `${propertiesTitle} | ${SITE_NAME}`,
    propertiesDescription,
  ),
};

const PropertiesClient = dynamic(
  () =>
    import("@/components/properties/PropertiesClient").then((mod) => ({
      default: mod.PropertiesClient,
    })),
  {
    loading: () => <PropertiesPageSkeleton />,
    ssr: true,
  },
);

export default function PropertiesPage() {
  return (
    <>
      <PropertiesIndexSeo />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Properties" }]}
        currentPath="/properties"
      />
      <PropertiesClient />
    </>
  );
}
