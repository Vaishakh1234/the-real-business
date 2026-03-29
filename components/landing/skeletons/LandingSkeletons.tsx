import { Skeleton } from "@/components/ui/skeleton";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { cn } from "@/lib/utils";

/** Top bar mimicking Navbar (for use in route loading) */
export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div
        className={cn(
          publicContentFrameClass,
          "flex h-14 items-center justify-between md:h-20",
        )}
      >
        <Skeleton className="h-8 w-32 rounded" />
        <div className="hidden items-center gap-8 md:flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-16 rounded" />
          ))}
        </div>
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </header>
  );
}

/** Hero block (dark bg) for about/contact/services */
export function HeroSkeleton() {
  return (
    <section className="bg-brand-charcoal pt-20 pb-24">
      <div className={publicContentFrameClass}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-6">
            <Skeleton className="h-3 w-24 rounded bg-white/20" />
            <Skeleton className="h-14 w-full max-w-xl rounded bg-white/10" />
            <Skeleton className="h-14 w-3/4 rounded bg-white/10" />
          </div>
          <div className="space-y-3 lg:max-w-xs">
            <Skeleton className="h-4 w-full rounded bg-white/10" />
            <Skeleton className="h-4 w-full rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Home page hero (full-width) */
export function HomeHeroSkeleton() {
  return (
    <section
      className={cn(
        publicContentFrameClass,
        "relative flex min-h-[85vh] items-center",
      )}
    >
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-4 w-32 rounded bg-white/20" />
        <Skeleton className="h-16 w-full rounded bg-white/10" />
        <Skeleton className="h-16 w-4/5 rounded bg-white/10" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-36 rounded-full bg-white/20" />
          <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}

/** Two-column section with image left + text (about story) */
export function TwoColumnSectionSkeleton() {
  return (
    <section className="bg-white py-24">
      <div className={publicContentFrameClass}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-10 w-3/4 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="mt-6 h-10 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Stats row (4 columns) */
export function StatsRowSkeleton() {
  return (
    <section className="bg-muted py-20">
      <div className={publicContentFrameClass}>
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2 text-center">
              <Skeleton className="mx-auto h-12 w-20 rounded" />
              <Skeleton className="mx-auto h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Values grid (about page) */
export function ValuesGridSkeleton() {
  return (
    <section className="bg-white py-24">
      <div className={publicContentFrameClass}>
        <div className="mb-14 space-y-3">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-12 w-96 max-w-full rounded" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3 border-t border-border pt-8">
              <Skeleton className="h-3 w-8 rounded" />
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Contact: left info + right form */
export function ContactPageSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <HeroSkeleton />
      <section className="bg-white py-20">
        <div className={publicContentFrameClass}>
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-20">
            <div className="space-y-8 lg:col-span-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-12 w-3/4 rounded" />
              <div className="space-y-7">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-4 w-full rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 border-t border-border pt-10">
                <Skeleton className="h-3 w-20 rounded" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-9 w-9 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:col-span-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
      <section className="h-80 bg-gray-100">
        <Skeleton className="h-full w-full rounded-none" />
      </section>
      <FooterSkeleton />
    </>
  );
}

/** Team grid (cards with image + text) */
export function TeamGridSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <section className="bg-muted pt-20 pb-16">
        <div className={publicContentFrameClass}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-16 w-full max-w-xl rounded" />
              <Skeleton className="h-16 w-4/5 rounded" />
            </div>
            <div className="space-y-3 lg:max-w-xs">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className={publicContentFrameClass}>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-5">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-px w-full rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-6 w-32 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-black py-20">
        <div
          className={cn(
            publicContentFrameClass,
            "flex flex-col items-center justify-between gap-8 lg:flex-row",
          )}
        >
          <div className="space-y-3">
            <Skeleton className="h-10 w-72 rounded bg-white/10" />
            <Skeleton className="h-4 w-96 max-w-full rounded bg-white/10" />
          </div>
          <Skeleton className="h-12 w-32 rounded-full bg-white/20" />
        </div>
      </section>
      <FooterSkeleton />
    </>
  );
}

/** Footer strip skeleton */
export function FooterSkeleton() {
  return (
    <footer className="border-t border-border bg-muted py-12">
      <div className={publicContentFrameClass}>
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <Skeleton className="h-8 w-40 rounded" />
          <div className="flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-20 rounded" />
            ))}
          </div>
        </div>
        <Skeleton className="mt-8 h-4 w-64 rounded" />
      </div>
    </footer>
  );
}

/** Home page skeleton (hero + section blocks) */
export function HomePageSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <main>
        <section
          className={cn(
            publicContentFrameClass,
            "relative flex min-h-[85vh] items-center bg-brand-charcoal",
          )}
        >
          <div className="max-w-2xl space-y-6">
            <Skeleton className="h-4 w-32 rounded bg-white/20" />
            <Skeleton className="h-16 w-full rounded bg-white/10" />
            <Skeleton className="h-16 w-4/5 rounded bg-white/10" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-36 rounded-full bg-white/20" />
              <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
            </div>
          </div>
        </section>
        <section className="bg-white py-16">
          <div className={publicContentFrameClass}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <Skeleton className="h-6 w-40 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-gray-50 py-20">
          <div className={publicContentFrameClass}>
            <Skeleton className="mb-10 h-10 w-64 rounded" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <Skeleton className="mb-4 aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="mb-2 h-5 w-3/4 rounded" />
                  <Skeleton className="h-3.5 w-1/2 rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-white py-20">
          <div
            className={cn(
              publicContentFrameClass,
              "flex flex-col items-center justify-between gap-8 lg:flex-row",
            )}
          >
            <Skeleton className="h-12 w-96 max-w-full rounded" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </section>
      </main>
      <FooterSkeleton />
    </>
  );
}

/** About page full skeleton */
export function AboutPageSkeleton() {
  return (
    <>
      <NavbarSkeleton />
      <HeroSkeleton />
      <TwoColumnSectionSkeleton />
      <StatsRowSkeleton />
      <ValuesGridSkeleton />
      <section className="bg-brand-charcoal py-24">
        <div className={publicContentFrameClass}>
          <div className="mb-14 space-y-3">
            <Skeleton className="h-4 w-24 rounded bg-white/20" />
            <Skeleton className="h-12 w-64 rounded bg-white/10" />
          </div>
          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="space-y-4 border-b border-white/10 pb-8 pr-8 last:border-0 lg:border-b-0 lg:border-r"
              >
                <Skeleton className="h-3 w-12 rounded bg-white/20" />
                <Skeleton className="h-px w-12 rounded bg-white/10" />
                <Skeleton className="h-6 w-24 rounded bg-white/10" />
                <Skeleton className="h-4 w-full rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className={cn(publicContentFrameClass, "space-y-4 text-center")}>
          <Skeleton className="mx-auto h-10 w-96 max-w-full rounded" />
          <Skeleton className="mx-auto h-4 w-80 max-w-full rounded" />
          <Skeleton className="mx-auto h-12 w-40 rounded-full" />
        </div>
      </section>
    </>
  );
}
