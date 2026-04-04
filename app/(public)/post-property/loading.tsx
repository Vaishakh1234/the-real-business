import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { cn } from "@/lib/utils";

export default function PostPropertyLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />

      <section
        className={cn(
          publicContentFrameClass,
          "flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center py-14 sm:min-h-[calc(100svh-7rem)] sm:py-20 lg:py-24",
        )}
      >
        <div className="flex w-full max-w-screen-2xl flex-col items-stretch gap-12 xl:flex-row xl:items-center xl:gap-20 2xl:gap-28">
          {/* Image placeholder */}
          <Skeleton className="aspect-[4/3] w-full min-w-0 rounded-lg xl:flex-[1.42]" />

          {/* Text + CTAs */}
          <div className="flex min-w-0 w-full flex-col items-center gap-6 text-center sm:gap-8 xl:flex-1 xl:items-start xl:text-left">
            <Skeleton className="h-4 w-24 sm:h-5 sm:w-28" />
            <div className="w-full space-y-2">
              <Skeleton className="h-10 w-full max-w-lg sm:h-12 xl:h-14" />
              <Skeleton className="h-10 w-3/4 max-w-lg sm:h-12 xl:h-14" />
            </div>
            <div className="w-full space-y-2">
              <Skeleton className="h-5 w-full max-w-xl sm:h-6" />
              <Skeleton className="h-5 w-full max-w-xl sm:h-6" />
              <Skeleton className="h-5 w-2/3 max-w-xl sm:h-6" />
            </div>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 xl:mt-0 xl:items-start">
              <Skeleton className="h-14 w-64 rounded-full sm:h-16 sm:w-72" />
              <Skeleton className="h-14 w-40 rounded-full sm:h-16 sm:w-48" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
