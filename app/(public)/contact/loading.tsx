import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { cn } from "@/lib/utils";

export default function ContactLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />

      <section className="flex min-h-[calc(100dvh-4rem)] w-full flex-col py-10 sm:py-14 md:min-h-[calc(100dvh-5rem)]">
        <div
          className={cn(
            publicContentFrameClass,
            "flex min-h-0 flex-1 flex-col",
          )}
        >
          {/* Page title */}
          <Skeleton className="mb-2 h-9 w-72 md:h-10 md:w-96" />
          <div className="mb-8 max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Two-column: form + contact info */}
          <div className="grid flex-1 grid-cols-1 content-center gap-12 xl:grid-cols-2 xl:gap-16">
            {/* Left: form */}
            <div>
              <div className="mb-8">
                <Skeleton className="mb-4 h-8 w-56 md:h-9 md:w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                  <div>
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Skeleton className="mb-2 h-4 w-28" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                  <div>
                    <Skeleton className="mb-2 h-4 w-28" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>
                <div>
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-[52px] w-full rounded-xl" />
                </div>
                <div>
                  <Skeleton className="mb-2 h-4 w-20" />
                  <Skeleton className="h-[120px] w-full rounded-xl" />
                </div>
                <Skeleton className="h-[52px] w-full rounded-xl" />
              </div>
            </div>

            {/* Right: contact info card */}
            <div className="flex flex-col">
              <div className="rounded-2xl border border-border bg-muted p-4 sm:p-6 lg:p-8">
                <Skeleton className="mb-4 h-8 w-48 sm:mb-6" />
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3 sm:gap-4">
                      <Skeleton className="h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12" />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-16 sm:w-20" />
                        <Skeleton className="h-4 w-full max-w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-border pt-6 sm:mt-8">
                  <Skeleton className="mb-3 h-4 w-20" />
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-10 w-10 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
