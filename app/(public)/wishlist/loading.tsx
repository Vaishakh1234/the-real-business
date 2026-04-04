import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { PropertyListingCardSkeleton } from "@/components/properties/PropertyListingCard";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { cn } from "@/lib/utils";

export default function WishlistLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />

      <div className="min-h-[50vh] pb-[max(4rem,calc(4rem+env(safe-area-inset-bottom)))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-16 md:pb-20 md:pt-8">
        <div
          className={cn(
            publicContentFrameClass,
            "flex flex-col gap-6 sm:gap-8",
          )}
        >
          {/* Header row: back button + title + clear */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex w-full items-center gap-3 md:items-start">
              <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 md:flex-none">
                <Skeleton className="h-8 w-44 sm:h-9 sm:w-56" />
                <Skeleton className="mt-1 hidden h-4 w-72 md:block" />
              </div>
              <Skeleton className="h-11 w-11 shrink-0 rounded-full md:hidden" />
            </div>
            <Skeleton className="hidden h-10 w-28 shrink-0 rounded-md md:block" />
          </div>

          {/* Listing cards */}
          <div className="flex min-w-0 flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <PropertyListingCardSkeleton key={i} variant="directory" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
