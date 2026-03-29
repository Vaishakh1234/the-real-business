"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { HOME_HERO } from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { usePublicCategories } from "@/hooks/useCategories";
import { HeroSearchPanel } from "@/components/landing/HeroSearchPanel";
import { cn } from "@/lib/utils";

const HERO_CATEGORY_BUTTON_LIMIT = 5;

function HeroCategoryButtons() {
  const { data: categories = [], isLoading } = usePublicCategories();
  const topCategories = useMemo(
    () => categories.slice(0, HERO_CATEGORY_BUTTON_LIMIT),
    [categories],
  );

  if (isLoading) {
    return (
      <div
        className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-7 sm:gap-2 sm:flex-wrap sm:overflow-x-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
        aria-busy="true"
        aria-label="Loading categories"
      >
        {Array.from({ length: HERO_CATEGORY_BUTTON_LIMIT }, (_, i) => (
          <div
            key={i}
            className="h-10 min-w-[5.75rem] shrink-0 animate-pulse rounded-full bg-white/15 sm:h-10"
          />
        ))}
      </div>
    );
  }

  if (topCategories.length === 0) return null;

  return (
    <nav
      className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-7 sm:gap-2 sm:flex-wrap sm:overflow-x-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
      aria-label="Browse by category"
    >
      {topCategories.map((c) => (
        <Link
          key={c.id}
          href={`/properties?${new URLSearchParams({ category_id: c.id }).toString()}`}
          className="inline-flex shrink-0 snap-start items-center rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-[background-color,border-color,color] duration-200 hover:border-white hover:bg-white hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal sm:snap-none sm:px-5 sm:py-2.5 sm:text-[15px]"
        >
          {c.name}
        </Link>
      ))}
      <Link
        href="/properties"
        className="inline-flex shrink-0 snap-start items-center gap-1 rounded-full border border-white bg-white px-3.5 py-2 text-sm font-semibold text-brand-charcoal shadow-sm transition-[background-color,border-color,color,opacity] duration-200 hover:border-white hover:bg-neutral-100 hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal sm:snap-none sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-[15px]"
      >
        View All
        <ChevronRight
          className="h-4 w-4 shrink-0 text-brand-charcoal opacity-90"
          strokeWidth={2}
          aria-hidden
        />
      </Link>
    </nav>
  );
}

export function Hero() {
  return (
    <section
      id="home-hero"
      className="relative flex min-h-[min(88svh,720px)] w-full flex-col overflow-hidden bg-brand-charcoal md:min-h-[min(82vh,680px)] md:max-h-[min(92vh,920px)]"
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
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/70 via-brand-charcoal/45 to-brand-charcoal/65 md:from-brand-charcoal/60 md:via-brand-charcoal/40 md:to-brand-charcoal/50" />
      </div>

      <div
        className={cn(
          publicContentFrameClass,
          "relative z-10 flex min-h-0 flex-1 flex-col",
          "pt-[calc(4rem+env(safe-area-inset-top))] pb-2 sm:pt-36 sm:pb-[max(1rem,env(safe-area-inset-bottom))] md:pt-44 lg:pt-44 xl:pt-52",
        )}
      >
        {/*
          Mobile: column fills viewport; headline + categories at top; search pinned to bottom (thumb reach).
          md+: original flow — extra top offset restores desktop vertical rhythm.
        */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 md:mt-[120px] md:min-h-0 md:flex-none md:gap-0 max-md:justify-between max-md:pt-1">
          <div className="min-w-0 max-w-[42rem] shrink-0 xl:max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="min-w-0 text-balance font-heading text-[1.5625rem] font-bold leading-[1.07] tracking-[-0.02em] text-white xs:text-[1.75rem] sm:text-5xl sm:leading-[1.05] md:text-6xl md:leading-[1.05] lg:text-7xl lg:leading-[1.04] xl:text-[4.75rem] xl:leading-[1.03]"
            >
              {HOME_HERO.titleLine1}
              <br />
              <span className="font-medium italic text-white/95">
                {HOME_HERO.titleLine2}
              </span>
            </motion.h1>

            <HeroCategoryButtons />
          </div>

          <div className="mt-auto w-full min-w-0 pb-0 md:mt-0 md:pb-0 max-md:pt-1">
            <HeroSearchPanel stackedBelowCategories />
          </div>
        </div>
      </div>
    </section>
  );
}
