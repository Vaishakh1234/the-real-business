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
        className="mt-6 flex flex-wrap gap-2 sm:mt-7"
        aria-busy="true"
        aria-label="Loading categories"
      >
        {Array.from({ length: HERO_CATEGORY_BUTTON_LIMIT }, (_, i) => (
          <div
            key={i}
            className="h-9 min-w-[5.5rem] animate-pulse rounded-full bg-white/15 sm:h-10"
          />
        ))}
      </div>
    );
  }

  if (topCategories.length === 0) return null;

  return (
    <nav
      className="mt-6 flex flex-wrap gap-2 sm:mt-7"
      aria-label="Browse by category"
    >
      {topCategories.map((c) => (
        <Link
          key={c.id}
          href={`/properties?${new URLSearchParams({ category_id: c.id }).toString()}`}
          className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-[background-color,border-color,color] duration-200 hover:border-white hover:bg-white hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal sm:px-5 sm:py-2.5 sm:text-[15px]"
        >
          {c.name}
        </Link>
      ))}
      <Link
        href="/properties"
        className="inline-flex items-center gap-1 rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal shadow-sm transition-[background-color,border-color,color,opacity] duration-200 hover:border-white hover:bg-neutral-100 hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-charcoal sm:gap-1.5 sm:px-5 sm:py-2.5 sm:text-[15px]"
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
      className="relative flex w-full flex-col overflow-hidden bg-brand-charcoal"
      style={{
        minHeight: "min(82vh, 680px)",
        maxHeight: "min(92vh, 920px)",
      }}
      aria-label="Hero"
    >
      {/* Full-bleed background image + dark gradient for headline contrast */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/home-banner.png"
          alt=""
          fill
          className="object-cover object-[50%_60%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-charcoal/60 via-brand-charcoal/40 to-brand-charcoal/50" />
      </div>

      <div
        className={cn(
          publicContentFrameClass,
          "relative z-10 flex min-h-0 flex-1 flex-col pb-[env(safe-area-inset-bottom)] pt-32 sm:pt-36 md:pt-44 lg:pt-44 xl:pt-52",
        )}
      >
        {/* Top: headline + categories; search sits below with a small gap (no flex-grow spacer) */}
        <div className="flex-shrink-0 mt-[120px]">
          <div className="min-w-0 max-w-[42rem] xl:max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="min-w-0 font-heading text-[2.125rem] font-bold leading-[1.06] tracking-[-0.02em] text-white text-balance xs:text-4xl sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl lg:leading-[1.04] xl:text-[4.75rem] xl:leading-[1.03]"
            >
              {HOME_HERO.titleLine1}
              <br />
              <span className="font-medium italic text-white/95">
                {HOME_HERO.titleLine2}
              </span>
            </motion.h1>

            <HeroCategoryButtons />
          </div>

          <HeroSearchPanel stackedBelowCategories />
        </div>
      </div>
    </section>
  );
}
