import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListingResultsHeaderSkeleton } from "@/components/properties/ListingResultsHeaderSkeleton";
import { PropertiesFilterSidebarStatic } from "@/components/properties/PropertiesFilterSidebarStatic";
import { PropertiesIndexSeo } from "@/components/properties/PropertiesIndexSeo";
import { PropertyListingCardSkeleton } from "@/components/properties/PropertyListingCard";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { PUBLIC_PROPERTIES_PAGE_SIZE, SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
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

function PropertiesLoading() {
  return (
    <div
      className={cn(
        publicContentFrameClass,
        "min-h-dvh py-8 sm:py-10 md:py-12",
      )}
    >
      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] xl:gap-10 2xl:gap-12">
        <aside className="hidden xl:block xl:self-start">
          <div className="sticky top-20 z-10 max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-y-contain pr-1 md:top-24 md:max-h-[calc(100svh-6.5rem)] [scrollbar-gutter:stable]">
            <PropertiesFilterSidebarStatic />
          </div>
        </aside>
        <div className="min-w-0 xl:min-h-0">
          <ListingResultsHeaderSkeleton />
          <div className="flex flex-col gap-5">
            {Array.from({ length: PUBLIC_PROPERTIES_PAGE_SIZE }).map((_, i) => (
              <PropertyListingCardSkeleton key={i} variant="directory" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const PropertiesClient = dynamic(
  () =>
    import("@/components/properties/PropertiesClient").then((mod) => ({
      default: mod.PropertiesClient,
    })),
  {
    loading: () => <PropertiesLoading />,
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
