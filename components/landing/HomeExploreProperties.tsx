"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import type { PropertyWithRelations } from "@/types";
import { HOME_EXPLORE } from "@/lib/constants/site";
import {
  HomePropertyListingCard,
  PropertyListingCardSkeleton,
} from "@/components/properties/PropertyListingCard";

const listLimit = HOME_EXPLORE.listingGridLimit;
const cityLabel = HOME_EXPLORE.focusCityLabel;

/** Section title + subtitle — full width above the listings / sidebar grid on the home page. */
export function HomeExploreSectionIntro() {
  return (
    <div className="min-w-0 w-full space-y-3">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
        {HOME_EXPLORE.eyebrow}
      </p>
      <h2
        id="home-explore-heading"
        className="min-w-0 w-full font-heading text-2xl font-bold leading-tight text-brand-charcoal sm:text-3xl md:text-4xl"
      >
        {HOME_EXPLORE.titlePrefix}{" "}
        <span className="whitespace-nowrap">{cityLabel}</span>
      </h2>
      <p className="w-full max-w-none text-sm text-muted-foreground sm:text-base">
        {HOME_EXPLORE.subtitle}
      </p>
    </div>
  );
}

/** Listing grid, “View all”, and empty state — pairs with `HomeSidebar` in a shared grid row. */
export function HomeExplorePropertyList() {
  const { data, isLoading } = useQuery({
    queryKey: ["properties", "home-latest", listLimit],
    queryFn: async () => {
      const params = new URLSearchParams({
        latest: "1",
        limit: String(listLimit),
      });
      const res = await fetch(`/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      const json = await res.json();
      return (json.data ?? []) as PropertyWithRelations[];
    },
    staleTime: 2 * 60 * 1000,
  });

  const properties = (data ?? []).slice(0, listLimit);
  const listHref = "/properties";

  return (
    <div className="min-w-0 w-full">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 sm:items-stretch">
        {isLoading
          ? Array.from({ length: listLimit }, (_, i) => (
              <PropertyListingCardSkeleton key={i} variant="home" />
            ))
          : properties.length > 0
            ? properties.map((property, i) => (
                <HomePropertyListingCard
                  key={property.id}
                  property={property}
                  index={i}
                />
              ))
            : null}
      </div>

      {!isLoading && properties.length > 0 && (
        <div className="mt-6 flex justify-end sm:mt-8">
          <Link
            href={listHref}
            className="inline-flex min-h-[44px] items-center gap-1.5 py-1 text-sm font-semibold text-brand-charcoal underline-offset-4 transition-colors hover:text-brand-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:text-base"
          >
            View all
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      )}

      {!isLoading && properties.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/40 py-14 text-center">
          <p className="text-muted-foreground">No active listings right now.</p>
          <Link
            href="/properties"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-brand-charcoal underline-offset-4 hover:text-brand-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            Browse all properties
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}

/** Full-width explore section without sidebar (e.g. reuse elsewhere). */
export function HomeExploreProperties() {
  return (
    <section className="min-w-0 w-full" aria-labelledby="home-explore-heading">
      <HomeExploreSectionIntro />
      <div className="mt-8">
        <HomeExplorePropertyList />
      </div>
    </section>
  );
}
