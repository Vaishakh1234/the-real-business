import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export default function GuidesLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />

      <div className={`${publicContentFrameClass} py-10 sm:py-14 lg:py-16`}>
        {/* Header */}
        <header className="max-w-3xl">
          <Skeleton className="h-9 w-full max-w-xl sm:h-10" />
          <Skeleton className="mt-4 h-5 w-full max-w-lg sm:h-6" />
        </header>

        {/* Guide cards grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-full rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <Skeleton className="h-6 w-3/4 sm:h-7" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-2/3" />
              <Skeleton className="mt-4 h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
