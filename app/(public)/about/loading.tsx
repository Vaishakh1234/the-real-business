import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbsSkeleton } from "@/components/landing/skeletons/LandingSkeletons";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export default function AboutLoading() {
  return (
    <>
      <BreadcrumbsSkeleton items={1} />

      <div className={publicContentFrameClass}>
        {/* ── Hero section ── */}
        <section className="pb-10 pt-6 sm:pb-12 sm:pt-8 md:pt-10 lg:pb-14 lg:pt-12">
          <div className="max-w-4xl space-y-2">
            <Skeleton className="h-[clamp(1.75rem,4vw+0.5rem,3.5rem)] w-full" />
            <Skeleton className="h-[clamp(1.75rem,4vw+0.5rem,3.5rem)] w-4/5" />
          </div>
          <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 md:grid-cols-3 md:gap-10 lg:mt-12">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </section>

        {/* ── Dreams banner ── */}
        <Skeleton className="aspect-[16/7] w-full rounded-2xl sm:aspect-[21/9]" />

        {/* ── Our Story + At a Glance ── */}
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-5 lg:gap-14 xl:gap-16">
            <div className="space-y-4 lg:col-span-3">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-8 w-80 sm:h-10 sm:w-96" />
              <Skeleton className="mt-5 h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-4 rounded-2xl border border-brand-gold/30 bg-white/60 p-6 shadow-sm sm:p-8">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-12 w-24 sm:h-14 sm:w-28" />
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-6 h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-40" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Trusted Partner (dark section) ── */}
        <section className="rounded-2xl bg-[#1e1b1b] px-5 py-12 xs:px-6 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <Skeleton className="mx-auto h-7 w-64 bg-white/10 sm:h-8 sm:w-80" />
          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-14 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl bg-[#fdfaf3] p-6 sm:rounded-2xl sm:p-7"
              >
                <Skeleton className="h-6 w-6" />
                <Skeleton className="mt-4 h-6 w-40 sm:mt-5" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="py-14 sm:py-20 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-8 w-56 sm:h-10 sm:w-72" />
            <Skeleton className="mt-3 h-4 w-80 max-w-full" />
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col bg-white p-6 sm:p-8">
                <Skeleton className="h-14 w-16 sm:h-16 sm:w-20" />
                <Skeleton className="mt-5 h-10 w-10 rounded-xl sm:h-11 sm:w-11" />
                <Skeleton className="mt-4 h-5 w-36" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="border-t border-border py-12 sm:py-16">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </section>

        {/* ── Next Steps ── */}
        <section className="border-t border-neutral-200/90 pb-16 pt-12 sm:pb-20 sm:pt-16">
          <Skeleton className="mx-auto h-7 w-32" />
          <Skeleton className="mx-auto mt-3 h-4 w-80 max-w-full" />
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-40 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </section>
      </div>
    </>
  );
}
