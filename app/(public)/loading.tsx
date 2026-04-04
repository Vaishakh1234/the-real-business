import { Skeleton } from "@/components/ui/skeleton";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { cn } from "@/lib/utils";

export default function HomeLoading() {
  return (
    <>
      {/* ── Hero skeleton — matches Hero component: full-bleed dark, large text, search, category chips ── */}
      <section className="relative flex min-h-[85svh] items-end overflow-hidden bg-brand-charcoal pb-10 sm:pb-14 lg:pb-16">
        <div className={cn(publicContentFrameClass, "relative z-10 w-full")}>
          <div className="max-w-4xl space-y-5 sm:space-y-6">
            <Skeleton className="h-4 w-40 rounded bg-white/15" />
            <Skeleton className="h-[2.5rem] w-full rounded bg-white/10 xs:h-[2.875rem] sm:h-[4.5rem] lg:h-[5.25rem]" />
            <Skeleton className="h-[2.5rem] w-4/5 rounded bg-white/10 xs:h-[2.875rem] sm:h-[4.5rem] lg:h-[5.25rem]" />
            <Skeleton className="mt-2 h-5 w-full max-w-xl rounded bg-white/8 sm:h-6" />
          </div>
          {/* Search panel placeholder */}
          <div className="mt-8 w-full max-w-3xl rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur sm:mt-10 sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <Skeleton className="h-12 w-full rounded-xl bg-white/10" />
              <Skeleton className="h-12 w-full rounded-xl bg-white/10" />
              <Skeleton className="h-12 w-full rounded-xl bg-white/10" />
            </div>
          </div>
          {/* Category chips */}
          <div className="mt-6 flex gap-2.5 overflow-hidden sm:mt-8 sm:flex-wrap sm:gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="h-8 w-20 shrink-0 rounded-full bg-white/10 sm:h-10 sm:w-28"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Portal layout — explore section + sidebar ── */}
      <div className={cn(publicContentFrameClass, "py-10 sm:py-12 lg:py-14")}>
        <section className="min-w-0 w-full">
          {/* Intro heading */}
          <div className="space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-72 sm:h-10 sm:w-96" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>

          {/* Two-col: properties + sidebar */}
          <div className="mt-8 grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_min(100%,380px)] xl:gap-10 2xl:gap-12">
            {/* Property cards */}
            <div className="min-w-0 w-full">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-border bg-white"
                  >
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="space-y-3 p-4 sm:p-5">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3.5 w-1/2" />
                      <div className="flex items-center gap-4 border-t border-border pt-3">
                        <Skeleton className="h-3.5 w-16" />
                        <Skeleton className="h-3.5 w-14" />
                        <Skeleton className="h-3.5 w-14" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar skeleton */}
            <aside className="hidden space-y-6 xl:block">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                  ))}
                </div>
                <Skeleton className="mt-5 h-11 w-full rounded-xl" />
              </div>
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <Skeleton className="mb-4 h-6 w-40" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>

      {/* ── FAQ section skeleton ── */}
      <section className="border-t border-border bg-muted/40 py-14 sm:py-16 lg:py-20">
        <div className={publicContentFrameClass}>
          <div className="mb-10 space-y-3 text-center">
            <Skeleton className="mx-auto h-3 w-20" />
            <Skeleton className="mx-auto h-9 w-64 sm:h-10 sm:w-80" />
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials skeleton ── */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className={publicContentFrameClass}>
          <div className="mb-10 space-y-3 text-center">
            <Skeleton className="mx-auto h-3 w-24" />
            <Skeleton className="mx-auto h-9 w-56 sm:h-10 sm:w-72" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
