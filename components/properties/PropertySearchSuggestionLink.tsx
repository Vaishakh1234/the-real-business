"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, LandPlot } from "lucide-react";
import { cn, formatPropertyPriceValue } from "@/lib/utils";
import { isRemoteImageOptimizedUrl } from "@/lib/public-image-hosts";
import type { PropertyWithRelations } from "@/types";

type PropertySearchSuggestionLinkProps = {
  property: PropertyWithRelations;
  href: string;
  onSelect: () => void;
  /** Hero vs header styling */
  variant?: "hero" | "header";
  className?: string;
};

function isPlotListing(p: PropertyWithRelations): boolean {
  return p.structure_type === "plot";
}

/** Land extent for plots (cent); built-up area for houses (sq ft). */
function formatSuggestSize(p: PropertyWithRelations): string | null {
  if (isPlotListing(p)) {
    if (p.total_cent != null && Number.isFinite(Number(p.total_cent))) {
      return `${Number(p.total_cent).toLocaleString("en-IN", {
        maximumFractionDigits: 4,
      })} cent`;
    }
    const sq = p.area_sqft;
    if (sq != null && sq > 0) {
      return `~${(sq / 435.6).toFixed(2)} cent`;
    }
    return null;
  }
  const sq = p.area_sqft;
  if (sq != null && sq > 0) {
    return `${Number(sq).toLocaleString("en-IN")} sq ft`;
  }
  return null;
}

function formatSuggestPrice(p: PropertyWithRelations): string {
  const fig = formatPropertyPriceValue(p.price ?? 0, p.price_type);
  if (fig === "—") return "—";
  const withInr = fig.startsWith("₹") ? fig : `₹${fig}`;
  if (p.price_type === "percent") {
    return `${withInr} / cent`;
  }
  if (p.type === "rent") {
    return `Rent ${withInr}`;
  }
  return withInr;
}

function buildSuggestMetaLine(
  p: PropertyWithRelations,
  variant: "hero" | "header",
): string {
  const parts: string[] = [];
  const city = p.city?.trim();
  if (city) parts.push(city);
  if (p.listing_ref?.trim()) parts.push(p.listing_ref);
  const size = formatSuggestSize(p);
  if (size) parts.push(size);
  const price = formatSuggestPrice(p);
  if (price && price !== "—") parts.push(price);
  if (variant === "hero") {
    const cat = p.category?.name?.trim();
    if (cat) parts.push(cat);
  }
  return parts.join(" · ");
}

export function PropertySearchSuggestionLink({
  property: p,
  href,
  onSelect,
  variant = "hero",
  className,
}: PropertySearchSuggestionLinkProps) {
  const cover = p.cover_image_url?.trim();
  const plot = isPlotListing(p);
  const titleClass =
    variant === "hero"
      ? "truncate font-semibold text-neutral-900"
      : "truncate font-semibold text-brand-charcoal";
  const metaClass =
    variant === "hero"
      ? "mt-0.5 line-clamp-2 min-w-0 break-words text-[13px] leading-snug text-neutral-600"
      : "mt-0.5 line-clamp-2 min-w-0 break-words text-[13px] leading-snug text-muted-foreground";
  const iconClass =
    "mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold";

  const metaLine = buildSuggestMetaLine(p, variant);
  const TypeIcon = plot ? LandPlot : Home;

  return (
    <Link
      role="option"
      href={href}
      onClick={onSelect}
      className={cn(
        "flex gap-3 py-2.5 pl-3 pr-4 text-left transition-colors sm:gap-3.5 sm:py-3 sm:pl-4 sm:pr-4",
        variant === "hero"
          ? "hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none"
          : "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
        className,
      )}
    >
      <div className="relative h-[3.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-md bg-neutral-200 sm:h-14 sm:w-[4.5rem]">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            className="object-cover"
            sizes="72px"
            unoptimized={!isRemoteImageOptimizedUrl(cover)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-lg text-neutral-400">
            {plot ? "🌴" : "🏠"}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <TypeIcon className={iconClass} aria-hidden />
        <div className="min-w-0 flex-1">
          <span className={cn("block", titleClass)}>{p.title}</span>
          <span className={cn("block", metaClass)}>{metaLine}</span>
        </div>
      </div>
    </Link>
  );
}
