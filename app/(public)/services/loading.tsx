import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export default function ServicesLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />

      <div className={publicContentFrameClass}>
        {/* ── Hero ── */}
        <section className="pb-10 pt-6 sm:pb-12 sm:pt-8 md:pt-10 lg:pb-14 lg:pt-12">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-3 h-8 w-full max-w-2xl sm:h-10" />
          <Skeleton className="mt-5 h-4 w-full max-w-xl sm:mt-6" />
          <Skeleton className="mt-2 h-4 w-3/4 max-w-xl" />

          {/* 3 service cards */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-3 lg:gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-gold/30 bg-white/60 shadow-sm"
              >
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <Skeleton className="mb-6 h-14 w-14 rounded-2xl sm:h-16 sm:w-16" />
                  <Skeleton className="mb-3 h-7 w-48 sm:h-8" />
                  <Skeleton className="mb-6 h-4 w-full" />
                  <Skeleton className="mb-1 h-4 w-full" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-start gap-2">
                        <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Skeleton className="h-10 w-36 rounded-xl" />
                    <Skeleton className="h-10 w-40 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Process ── */}
        <section className="py-10 sm:py-14 lg:py-16">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-56 sm:h-10 sm:w-72" />
          <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-brand-gold/30 bg-white/60 p-6 shadow-sm sm:p-8"
              >
                <Skeleton className="h-9 w-10" />
                <Skeleton className="mt-2 h-6 w-32" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Why us ── */}
        <section className="py-14 sm:py-20 lg:py-24">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-3 h-8 w-56 sm:h-10 sm:w-72" />
            <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-white p-5 shadow-sm sm:rounded-2xl sm:p-7"
              >
                <Skeleton className="mb-3 h-10 w-10 rounded-full sm:mb-4 sm:h-11 sm:w-11" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="mt-1.5 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-neutral-200/90 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-gold/30 bg-white/60 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
            <Skeleton className="mx-auto h-8 w-full max-w-md sm:h-10" />
            <Skeleton className="mx-auto mt-4 h-5 w-full max-w-lg" />
            <Skeleton className="mx-auto mt-1 h-5 w-3/4 max-w-lg" />
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Skeleton className="h-12 w-48 rounded-xl" />
              <Skeleton className="h-12 w-36 rounded-xl" />
            </div>
            <Skeleton className="mx-auto mt-6 h-4 w-64" />
          </div>
        </section>
      </div>
    </>
  );
}
