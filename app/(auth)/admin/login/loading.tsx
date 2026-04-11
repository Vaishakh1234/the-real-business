import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="relative min-h-[100dvh] bg-zinc-100">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(183,147,84,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_100%,rgba(26,26,26,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(183,147,84,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <div className="relative flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8 lg:px-12 lg:py-10">
          <div className="flex flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="relative overflow-hidden rounded-[1.35rem] border border-transparent bg-transparent py-8 sm:py-9 lg:py-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-16 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-9 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-full max-w-sm rounded" />
                  </div>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-14 rounded" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <Skeleton className="h-14 w-full rounded-xl" />
                  </div>
                  <Skeleton className="mx-auto h-4 w-28 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
