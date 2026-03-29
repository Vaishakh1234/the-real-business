"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { HomePropertyListingCard } from "@/components/properties/PropertyListingCard";
import type { PropertyWithRelations } from "@/types";

export function RelatedPropertiesSection({
  excludePropertyId,
  tags,
}: {
  excludePropertyId: string;
  tags: string[] | null | undefined;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  /** Programmatic interval pauses (user interaction) */
  const autoScrollPauseRef = useRef(false);
  /** Desktop: pause while pointer is over the track */
  const hoverPauseRef = useRef(false);
  const userResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUserResumeTimer = () => {
    if (userResumeTimerRef.current) {
      clearTimeout(userResumeTimerRef.current);
      userResumeTimerRef.current = null;
    }
  };

  /** Pause auto-advance briefly after touch/drag/wheel so manual scroll wins (mobile + desktop). */
  const scheduleResumeAfterUserScroll = (ms: number) => {
    autoScrollPauseRef.current = true;
    clearUserResumeTimer();
    userResumeTimerRef.current = setTimeout(() => {
      userResumeTimerRef.current = null;
      if (!hoverPauseRef.current) autoScrollPauseRef.current = false;
    }, ms);
  };

  const tagSignature = tags?.length
    ? [...tags].sort((a, b) => a.localeCompare(b)).join("|")
    : "";

  const { data, isLoading } = useQuery({
    queryKey: [
      "properties",
      "related",
      "tags",
      excludePropertyId,
      tagSignature,
    ],
    queryFn: async (): Promise<PropertyWithRelations[]> => {
      const res = await fetch(
        `/api/properties/${encodeURIComponent(excludePropertyId)}/related`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to load related properties");
      const json = await res.json();
      return (json.data ?? []) as PropertyWithRelations[];
    },
    enabled: Boolean(tagSignature),
    staleTime: 2 * 60 * 1000,
  });

  const items = data ?? [];

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    autoScrollPauseRef.current = true;
    const amount = Math.min(el.clientWidth * 0.75, 440) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
    window.setTimeout(() => {
      autoScrollPauseRef.current = false;
    }, 3200);
  };

  useEffect(() => {
    if (items.length <= 1) return;

    const tick = () => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "hidden"
      ) {
        return;
      }
      if (autoScrollPauseRef.current || hoverPauseRef.current) return;

      const el = scrollRef.current;
      if (!el) return;

      const { scrollLeft, clientWidth, scrollWidth } = el;
      const maxScrollLeft = scrollWidth - clientWidth;
      const stride = Math.min(clientWidth * 0.75, 440);
      if (maxScrollLeft <= 8) return;

      // `behavior: "smooth"` is unreliable on iOS/Android horizontal overflow; auto works everywhere.
      if (scrollLeft >= maxScrollLeft - 4) {
        el.scrollTo({ left: 0, behavior: "auto" });
      } else {
        el.scrollBy({ left: stride, behavior: "auto" });
      }
    };

    const id = window.setInterval(tick, 4500);
    return () => {
      window.clearInterval(id);
      clearUserResumeTimer();
    };
  }, [items.length, excludePropertyId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [excludePropertyId]);

  const bandClass =
    "mt-6 w-full border-t border-neutral-200/80 bg-gradient-to-b from-neutral-50 via-neutral-50 to-neutral-100/60 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:mt-8 sm:py-12 lg:py-14";

  const scrollRowClass =
    "flex snap-x snap-mandatory touch-pan-x gap-5 overflow-x-auto overscroll-x-contain pb-3 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden";

  /** Full-width carousel; page frame supplies horizontal padding (detail page). */
  const carouselShellClass = "px-0 pt-5 sm:pt-8";

  if (!tagSignature) return null;

  if (isLoading) {
    return (
      <section
        className={bandClass}
        aria-busy="true"
        aria-label="Related properties loading"
      >
        <div className="w-full min-w-0">
          <div className="mb-0 flex flex-nowrap items-center justify-between gap-3 sm:items-end sm:gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-xl font-bold tracking-tight text-[#1a2b4b] sm:text-3xl">
                Related properties
              </h2>
              <p className="mt-1.5 hidden text-[13px] text-neutral-600 sm:mt-2 sm:block sm:text-base">
                Other active listings that share your tags
              </p>
            </div>
          </div>
          <div className={carouselShellClass}>
            <div className={scrollRowClass}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[260px] min-w-[min(88vw,400px)] shrink-0 animate-pulse rounded-2xl border border-neutral-200/80 bg-white/60 sm:min-w-[420px] sm:h-[228px]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className={bandClass} aria-labelledby="related-properties-heading">
      <div className="w-full min-w-0">
        <div className="mb-0 flex flex-nowrap items-center justify-between gap-3 sm:items-end sm:gap-4">
          <div className="min-w-0 flex-1">
            <h2
              id="related-properties-heading"
              className="font-heading text-xl font-bold tracking-tight text-[#1a2b4b] sm:text-3xl"
            >
              Related properties
            </h2>
            <p className="mt-1.5 hidden max-w-xl text-[13px] leading-relaxed text-neutral-600 sm:mt-2 sm:block sm:text-base">
              Listings with overlapping tags — swipe or use the arrows to
              explore.
            </p>
          </div>
          <div className="flex shrink-0 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand-charcoal shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:size-12"
              aria-label="Show previous listings"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-brand-charcoal shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:size-12"
              aria-label="Show more listings"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className={carouselShellClass}>
          <div
            ref={scrollRef}
            className={scrollRowClass}
            onPointerEnter={(e) => {
              if (e.pointerType !== "mouse") return;
              clearUserResumeTimer();
              hoverPauseRef.current = true;
              autoScrollPauseRef.current = true;
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== "mouse") return;
              hoverPauseRef.current = false;
              autoScrollPauseRef.current = false;
            }}
            onPointerDown={() => {
              scheduleResumeAfterUserScroll(4000);
            }}
            onWheel={() => {
              scheduleResumeAfterUserScroll(3200);
            }}
          >
            {items.map((property, index) => (
              <div
                key={property.id}
                className="min-w-[min(88vw,400px)] w-[min(88vw,400px)] shrink-0 snap-start sm:min-w-[440px] sm:w-[440px] lg:min-w-[460px] lg:w-[460px]"
              >
                <HomePropertyListingCard
                  property={property}
                  index={index}
                  variant="related"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
