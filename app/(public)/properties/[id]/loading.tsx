import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const sk = "bg-neutral-200/80";

/** Matches `PropertyDetailPublicClient` outer frame and grid (7 / 5 columns on lg). */
const detailFrameClass =
  "mx-auto w-full max-w-[min(100rem,calc(100vw-1.25rem))] px-2.5 pb-14 pt-2.5 sm:max-w-[min(100rem,calc(100vw-2rem))] sm:px-5 sm:pb-16 sm:pt-5 lg:px-8 lg:pt-6 xl:px-12";

export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen pb-16">
      <div
        className={cn(detailFrameClass)}
        aria-busy="true"
        aria-label="Loading property"
      >
        <Skeleton className={cn("mb-4 h-10 w-40 rounded-xl sm:mb-6", sk)} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_max(18rem,calc(100%*5/12-100px))] xl:gap-10 xl:items-start">
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <div className="overflow-hidden rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:rounded-2xl sm:p-4 sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
              <Skeleton
                className={cn("aspect-[16/10] w-full rounded-xl", sk)}
              />
              <div className="mt-3 flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn(
                      "h-14 w-[4.5rem] shrink-0 rounded-lg sm:h-16 sm:w-24",
                      sk,
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-xl border border-neutral-200/90 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:space-y-4 sm:rounded-2xl sm:p-6 sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
              <Skeleton className={cn("h-9 w-full max-w-xl", sk)} />
              <Skeleton className={cn("h-5 w-64", sk)} />
              <Skeleton className={cn("h-10 w-52", sk)} />
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[6.5rem] flex-1 rounded-xl border border-neutral-200 bg-white px-2.5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] sm:min-w-[9rem] sm:flex-initial sm:px-3 sm:py-2.5"
                >
                  <Skeleton
                    className={cn(
                      "mb-1.5 h-2 w-11 sm:mb-2 sm:h-2.5 sm:w-14",
                      sk,
                    )}
                  />
                  <Skeleton className={cn("h-3.5 w-16 sm:h-4 sm:w-20", sk)} />
                </div>
              ))}
            </div>
          </div>
          <aside className="min-w-0">
            <div className="rounded-xl border border-neutral-200/90 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:rounded-2xl sm:p-6 sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
              <div className="mb-4 flex justify-end gap-2">
                <Skeleton className={cn("h-10 w-10 rounded-full", sk)} />
                <Skeleton className={cn("h-10 w-10 rounded-full", sk)} />
              </div>
              <Skeleton className={cn("mb-4 h-24 w-full rounded-xl", sk)} />
              <div className="space-y-3">
                <Skeleton className={cn("h-10 w-full rounded-lg", sk)} />
                <Skeleton className={cn("h-10 w-full rounded-lg", sk)} />
                <Skeleton className={cn("h-24 w-full rounded-lg", sk)} />
              </div>
              <Skeleton className={cn("mt-4 h-11 w-full rounded-xl", sk)} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
