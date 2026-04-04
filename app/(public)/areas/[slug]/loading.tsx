import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export default function AreaDetailLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={2} />

      <div className="pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className={publicContentFrameClass}>
          {/* Header */}
          <header className="max-w-3xl">
            <Skeleton className="h-9 w-full max-w-lg sm:h-10" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </header>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Skeleton className="h-11 w-52 rounded-xl" />
            <Skeleton className="h-11 w-40 rounded-xl" />
          </div>

          {/* Listings section */}
          <section className="mt-12">
            <Skeleton className="h-7 w-56 sm:h-8 sm:w-72" />
            <div className="mt-6 flex flex-col gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-3 shadow-sm sm:flex-row sm:p-4"
                >
                  <Skeleton className="aspect-[4/3] w-full shrink-0 rounded-xl sm:aspect-[3/2] sm:w-56 md:w-64 lg:w-72" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="mt-auto flex items-center gap-4 pt-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-14" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
