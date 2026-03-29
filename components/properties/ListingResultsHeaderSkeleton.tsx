import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Toolbar placeholder for the directory listing: full-width strip + inner skeleton lines. */
export function ListingResultsHeaderSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm ring-1 ring-black/[0.03] sm:p-5 md:mb-8 md:rounded-3xl md:p-6",
        "animate-pulse",
        className,
      )}
      aria-hidden
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3">
          <Skeleton className="h-4 w-24 bg-neutral-200/80 sm:h-4 sm:w-28" />
          <Skeleton className="h-5 w-full max-w-[min(100%,28rem)] bg-neutral-200/80 sm:h-6" />
          <Skeleton className="hidden h-4 w-full max-w-md bg-neutral-200/70 sm:block" />
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 md:gap-3">
          <Skeleton className="hidden h-9 w-24 rounded-full bg-neutral-200/80 sm:block" />
          <Skeleton className="h-10 w-36 rounded-full bg-neutral-200/80 md:w-44" />
        </div>
      </div>
    </div>
  );
}
