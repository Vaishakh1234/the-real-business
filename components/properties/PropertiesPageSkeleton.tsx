import { ListingResultsHeaderSkeleton } from "@/components/properties/ListingResultsHeaderSkeleton";
import { PropertyListingCardSkeleton } from "@/components/properties/PropertyListingCard";
import { PropertiesFilterSidebarStatic } from "@/components/properties/PropertiesFilterSidebarStatic";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { PUBLIC_PROPERTIES_PAGE_SIZE } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

/**
 * Skeleton for `/properties`: same grid + cards as {@link PropertiesClient}
 * loading state and `next/dynamic` fallback. Keep column widths in sync with
 * the client grid (`minmax(280px,320px)_minmax(0,1fr)`).
 */
export function PropertiesPageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        publicContentFrameClass,
        "min-h-dvh py-8 sm:py-10 md:py-12",
        className,
      )}
    >
      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] xl:gap-10 2xl:gap-12">
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
