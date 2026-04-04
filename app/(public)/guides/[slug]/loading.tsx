import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export default function GuideDetailLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={2} />

      <article
        className={`${publicContentFrameClass} py-10 sm:py-14 lg:py-16`}
      >
        {/* Article header */}
        <header className="max-w-3xl border-b border-border pb-8">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-3 h-9 w-full sm:h-10" />
          <Skeleton className="mt-1 h-9 w-3/4 sm:h-10" />
          <Skeleton className="mt-4 h-5 w-full sm:h-6" />
          <Skeleton className="mt-1 h-5 w-2/3 sm:h-6" />
        </header>

        {/* Article body */}
        <div className="mt-10 max-w-3xl space-y-6">
          {/* Intro paragraph */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Section heading + paragraph blocks */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 pt-4">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
