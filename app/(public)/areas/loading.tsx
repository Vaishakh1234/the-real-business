import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export default function AreasLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />

      <div className={`${publicContentFrameClass} py-10 sm:py-14 lg:py-16`}>
        {/* Header */}
        <header className="max-w-3xl">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-3 h-9 w-full max-w-lg sm:h-10" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </header>

        {/* Area card grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex h-full flex-col rounded-2xl border border-brand-gold/30 bg-white/70 p-6 shadow-sm"
            >
              <Skeleton className="h-7 w-40" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-2/3" />
              <Skeleton className="mt-4 h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
