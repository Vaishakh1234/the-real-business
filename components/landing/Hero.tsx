"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, HousePlus } from "lucide-react";
import {
  HOME_HERO,
  HOME_HERO_SEARCH_PROMPT,
  postPropertyHrefWithCta,
} from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { usePublicCategories } from "@/hooks/useCategories";
import { HeroSearchPanel } from "@/components/landing/HeroSearchPanel";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const HERO_CATEGORY_BUTTON_LIMIT = 5;
/** Mobile hero row: this many category chips plus “View All”. */
const HERO_CATEGORY_MOBILE_ROW = 2;

const heroTitleClassName =
  "min-w-0 text-balance font-heading text-[2.5rem] font-bold leading-[1.06] tracking-[-0.02em] text-white xs:text-[2.875rem] sm:text-[4.5rem] sm:leading-[1.05] md:text-[clamp(2.75rem,7vw,3.5rem)] md:leading-[1.08] lg:text-[5.25rem] lg:leading-[1.04] xl:text-[5.75rem] xl:leading-[1.03] 2xl:text-[6rem] 2xl:leading-[1.02]";

const categoryChipClass =
  "inline-flex shrink-0 snap-start items-center rounded-full border border-white/30 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition-[background-color,border-color,color] duration-200 hover:border-white hover:bg-white hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal sm:snap-none sm:px-5 sm:py-2.5 sm:text-[15px]";

const categoryViewAllClass =
  "inline-flex shrink-0 snap-start items-center gap-1 rounded-full border border-white bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-charcoal shadow-sm transition-[background-color,border-color,color,opacity] duration-200 hover:border-white hover:bg-neutral-100 hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal sm:snap-none sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-[15px]";

function heroCategoryLinks(
  topCategories: Category[],
  opts: { duplicateStrip?: boolean } = {},
) {
  const { duplicateStrip = false } = opts;
  const sfx = duplicateStrip ? "-dup" : "";
  return (
    <>
      {topCategories.map((c) => (
        <Link
          key={`${c.id}${sfx}`}
          href={`/properties?${new URLSearchParams({ category_id: c.id }).toString()}`}
          className={categoryChipClass}
          {...(duplicateStrip
            ? { tabIndex: -1 as const, "aria-hidden": true as const }
            : {})}
        >
          {c.name}
        </Link>
      ))}
      <Link
        key={`view-all${sfx}`}
        href="/properties"
        className={categoryViewAllClass}
        {...(duplicateStrip
          ? { tabIndex: -1 as const, "aria-hidden": true as const }
          : {})}
      >
        View All
        <ChevronRight
          className="h-3.5 w-3.5 shrink-0 text-brand-charcoal opacity-90 sm:h-4 sm:w-4"
          strokeWidth={2}
          aria-hidden
        />
      </Link>
    </>
  );
}

function HeroCategoryButtons({
  autoScroll = false,
  singleRowCompact = false,
  className,
}: {
  autoScroll?: boolean;
  /** Limited category chips + View All in one row (mobile hero). */
  singleRowCompact?: boolean;
  className?: string;
} = {}) {
  const { data: categories = [], isLoading } = usePublicCategories();
  const limit = singleRowCompact
    ? HERO_CATEGORY_MOBILE_ROW
    : HERO_CATEGORY_BUTTON_LIMIT;
  const topCategories = useMemo(
    () => categories.slice(0, limit),
    [categories, limit],
  );
  const skeletonCount = singleRowCompact
    ? HERO_CATEGORY_MOBILE_ROW + 1
    : HERO_CATEGORY_BUTTON_LIMIT;

  if (isLoading) {
    return (
      <div
        className={cn(
          "-mx-1 mt-2 flex gap-2 pb-0.5 sm:mx-0 sm:mt-7 sm:pb-0",
          "flex-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          autoScroll && !singleRowCompact && "overflow-hidden",
          className,
        )}
        aria-busy="true"
        aria-label="Loading categories"
      >
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div
            key={i}
            className="h-8 min-w-[4.25rem] shrink-0 animate-pulse rounded-full bg-white/15 sm:h-10 sm:min-w-[5.75rem]"
          />
        ))}
      </div>
    );
  }

  if (topCategories.length === 0) return null;

  if (singleRowCompact) {
    return (
      <nav
        className={cn(
          "-mx-1 mt-0 flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] sm:mx-0 sm:gap-2 sm:pb-0 [&::-webkit-scrollbar]:hidden",
          className,
        )}
        aria-label="Browse by category"
      >
        {heroCategoryLinks(topCategories)}
      </nav>
    );
  }

  if (autoScroll) {
    return (
      <nav
        className={cn(
          "group/category-marquee relative -mx-3 mt-0 w-full overflow-hidden pb-0.5",
          className,
        )}
        aria-label="Browse by category"
      >
        <div
          className={cn(
            "flex w-max gap-2 motion-reduce:animate-none",
            "motion-safe:animate-[marquee_32s_linear_infinite]",
            "motion-safe:group-hover/category-marquee:[animation-play-state:paused]",
            "motion-reduce:w-full motion-reduce:flex-nowrap motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden",
          )}
        >
          <div className="flex shrink-0 items-center gap-2 pr-2">
            {heroCategoryLinks(topCategories)}
          </div>
          <div className="flex shrink-0 items-center gap-2 pr-2" aria-hidden>
            {heroCategoryLinks(topCategories, { duplicateStrip: true })}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "-mx-1 mt-2 flex flex-wrap gap-1.5 pb-0.5 sm:mx-0 sm:mt-7 sm:gap-2.5 sm:pb-0",
        className,
      )}
      aria-label="Browse by category"
    >
      {heroCategoryLinks(topCategories)}
    </nav>
  );
}

export function Hero() {
  return (
    <section
      id="home-hero"
      className="relative flex min-h-[min(70svh,540px)] w-full flex-col overflow-hidden bg-brand-charcoal md:min-h-[min(82vh,680px)] md:max-h-[min(92vh,920px)]"
      aria-label="Hero"
    >
      {/* Full-bleed background image + dark gradient for headline contrast */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/home-banner.png"
          alt=""
          fill
          className="object-cover object-[50%_65%] md:object-[50%_60%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/45 via-brand-charcoal/30 to-brand-charcoal/50 md:from-brand-charcoal/40 md:via-brand-charcoal/25 md:to-brand-charcoal/40" />
      </div>

      <div
        className={cn(
          publicContentFrameClass,
          "relative z-10 flex min-h-0 flex-1 flex-col",
          "pt-[calc(3.25rem+env(safe-area-inset-top))] pb-14 sm:pt-36 sm:pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] md:pb-[max(4rem,calc(env(safe-area-inset-bottom)+2rem))] md:pt-44 lg:pt-44 xl:pt-52",
        )}
      >
        {/*
          Mobile: spacer; headline + chip row (3 categories + View All) + prompt + CTAs.
          md+: headline, categories, search card.
        */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 max-md:min-h-0 md:mt-[60px] md:min-h-0 md:flex-none md:gap-0">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              heroTitleClassName,
              "order-1 hidden max-w-[42rem] md:mb-5 md:block lg:mb-6 xl:max-w-4xl",
            )}
          >
            {HOME_HERO.titleLine1}
            <br />
            <span className="font-medium italic text-white/95">
              {HOME_HERO.titleLine2}
            </span>
          </motion.h1>

          <div className="order-2 hidden min-w-0 w-full md:block">
            <HeroCategoryButtons />
          </div>

          <div className="order-1 min-h-0 flex-1 md:hidden" aria-hidden />

          <div className="order-2 flex min-w-0 max-w-[42rem] flex-col gap-2 md:hidden xl:max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(heroTitleClassName, "mb-2")}
            >
              {HOME_HERO.titleLine1}
              <br />
              <span className="font-medium italic text-white/95">
                {HOME_HERO.titleLine2}
              </span>
            </motion.h1>
            <HeroCategoryButtons singleRowCompact className="mt-0" />

            <div className="flex flex-col gap-2 mt-4">
              <Link
                href="/properties"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-white bg-white px-3.5 py-2.5 text-sm font-semibold text-brand-charcoal shadow-md transition-[background-color,border-color] hover:border-white hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
              >
                View property
                <ChevronRight
                  className="h-4 w-4 shrink-0 opacity-90"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
              <Link
                href={postPropertyHrefWithCta("POST_PROPERTY_HERO_MOBILE_CTA")}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-white/40 bg-white/12 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-[background-color,border-color,color] hover:border-white hover:bg-white hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal"
                aria-label="Add a listing — post your property"
              >
                <HousePlus
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                Add listing
              </Link>
            </div>
          </div>

          <div className="order-3 mt-3 hidden w-full min-w-0 md:mt-0 md:block md:pb-0">
            <HeroSearchPanel stackedBelowCategories />
          </div>
        </div>
      </div>
    </section>
  );
}
