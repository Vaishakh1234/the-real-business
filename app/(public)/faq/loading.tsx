import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export default function FaqLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />

      {/* ── FAQ accordion section — matches FaqMarketingSection ── */}
      <section className="pb-12 pt-28 sm:pb-16 sm:pt-32 md:pt-36 lg:pb-20 lg:pt-40">
        <div className={publicContentFrameClass}>
          <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <Skeleton className="mx-auto h-8 w-16 rounded-full" />
            <Skeleton className="mx-auto mt-5 h-10 w-80 max-w-full sm:h-12 sm:w-[28rem]" />
          </header>

          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2 lg:gap-6">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-neutral-200/90 shadow-sm"
                >
                  <div className="bg-[#f3f1eb] px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-5 w-full max-w-xs" />
                      <Skeleton className="h-5 w-5 shrink-0 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Right column */}
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-neutral-200/90 shadow-sm"
                >
                  <div className="bg-[#f3f1eb] px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                      <Skeleton className="h-5 w-full max-w-xs" />
                      <Skeleton className="h-5 w-5 shrink-0 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter section — matches NewsletterStayUpdated ── */}
      <section className="pb-16 pt-4 sm:pb-24 lg:pb-28">
        <div className={publicContentFrameClass}>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] sm:rounded-[2.25rem]">
            <Skeleton className="aspect-[16/9] min-h-[280px] w-full sm:aspect-[21/9] sm:min-h-[320px]" />
          </div>
        </div>
      </section>
    </>
  );
}
