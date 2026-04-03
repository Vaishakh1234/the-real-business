"use client";

import Link from "next/link";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { PROPERTY_PLACEHOLDER_SRC } from "@/components/ui/PropertyImage";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Heart,
  MapPin,
  Maximize2,
  Phone,
  Share2,
  Sparkles,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useRef, useState } from "react";
import type { PropertyWithRelations } from "@/types";
import { HOME_EXPLORE, CONTACT, SITE_NAME } from "@/lib/constants/site";
import { isRemoteImageOptimizedUrl } from "@/lib/public-image-hosts";
import { useWishlist } from "@/hooks/useWishlist";
import {
  cn,
  formatPrice,
  formatPropertyPriceValue,
  formatRelativeTime,
  phoneToTelHref,
} from "@/lib/utils";
import { toast } from "sonner";

/** Shared listing card palette — matches home explore (navy, green ref, red CTA). */
export const LISTING_CARD = {
  navy: "#1a2b4b",
  meta: "#6b7280",
  metaIcon: "#3b82f6",
  badgeGreen: "#00a65a",
  ctaRed: "#ff0018",
} as const;

export function propertyListingRefCode(
  p: PropertyWithRelations,
  index: number,
  listingRefPrefix = HOME_EXPLORE.listingRefPrefix,
): string {
  if (p.listing_ref?.trim()) return p.listing_ref.trim();
  if (p.plot_number?.trim()) return p.plot_number.trim();
  const part = p.slug.replace(/-/g, "").slice(0, 6).toUpperCase();
  return part
    ? `${listingRefPrefix}-${part}`
    : `${listingRefPrefix}-${index + 1}`;
}

/** Two-line address: line1 + optional line2 (city/state) for listing cards. */
export function addressTwoLines(p: PropertyWithRelations): {
  line1: string;
  line2: { city: string | null; state: string | null } | null;
} {
  const city = p.city?.trim() || null;
  const state = p.state?.trim() || null;
  const street = p.address?.trim() || null;

  if (street) {
    if (city || state) {
      return { line1: street, line2: { city, state } };
    }
    return { line1: street, line2: null };
  }

  if (city && state) {
    return { line1: city, line2: { city: null, state } };
  }
  if (city) {
    return { line1: city, line2: null };
  }
  if (state) {
    return { line1: state, line2: null };
  }
  return { line1: "Kerala", line2: null };
}

export function AddressLine2({
  city,
  state,
}: {
  city: string | null;
  state: string | null;
}) {
  if (city && state) {
    if (city.trim().toLowerCase() === state.trim().toLowerCase()) {
      return (
        <span className="font-semibold" style={{ color: LISTING_CARD.navy }}>
          {city}
        </span>
      );
    }
    return (
      <>
        <span className="font-semibold" style={{ color: LISTING_CARD.navy }}>
          {city}
        </span>
        <span>, {state}</span>
      </>
    );
  }
  if (city) {
    return (
      <span className="font-semibold" style={{ color: LISTING_CARD.navy }}>
        {city}
      </span>
    );
  }
  if (state) {
    return <span>{state}</span>;
  }
  return null;
}

function listingSubtitle(property: PropertyWithRelations): string {
  const cat = property.category?.name?.trim() || "Property";
  const structure =
    property.structure_type === "plot" ? "Land / plot" : "House / villa";
  const { line1, line2 } = addressTwoLines(property);
  const loc =
    [property.city?.trim(), property.state?.trim()]
      .filter(Boolean)
      .join(", ") ||
    (line2 ? [line2.city, line2.state].filter(Boolean).join(", ") : null) ||
    line1;
  return `${cat} · ${structure} in ${loc}`;
}

function listingSubtitleMobile(property: PropertyWithRelations): string {
  return listingSubtitle(property).replace(/\s*·\s*/g, " / ");
}

function listingGalleryUrls(p: PropertyWithRelations): string[] {
  const cover = p.cover_image_url?.trim() || null;
  const gallery = (p.gallery_images ?? []).filter(Boolean) as string[];
  if (cover) {
    return [cover, ...gallery.filter((u) => u !== cover)];
  }
  return gallery;
}

function plainTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Home grid / related carousel — compact horizontal card with single View CTA. */
export function HomePropertyListingCard({
  property,
  index,
  variant = "default",
}: {
  property: PropertyWithRelations;
  index: number;
  /** Related: price is primary; land area (cent) is de-emphasized under the price. */
  variant?: "default" | "related";
}) {
  const href = `/properties/${property.slug}`;
  const { line1, line2 } = addressTwoLines(property);
  const refCode = propertyListingRefCode(property, index);
  const priceFigure = formatPropertyPriceValue(
    property.price ?? 0,
    property.price_type,
  );
  const priceWithInr =
    priceFigure === "—" || priceFigure.startsWith("₹")
      ? priceFigure
      : `₹${priceFigure}`;
  const priceBasisSuffix =
    property.price_type === "percent" ? " / Per cent" : " / Total";
  const isRelated = variant === "related";

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.06, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "group flex h-full min-h-0 flex-col overflow-hidden border bg-white shadow-[0_2px_14px_rgba(15,23,42,0.07)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.1)]",
        isRelated
          ? "rounded-xl border-neutral-200/90 ring-1 ring-black/[0.04] sm:min-h-[228px]"
          : "rounded-2xl border-neutral-200/90 ring-1 ring-black/[0.05]",
      )}
    >
      <div
        className={cn(
          "flex h-full min-h-0 flex-1 flex-col sm:flex-row sm:items-stretch",
          isRelated && "sm:min-h-[228px]",
        )}
      >
        <Link
          href={href}
          className={cn(
            "relative shrink-0 bg-neutral-100",
            isRelated
              ? "aspect-[4/3] w-full p-2.5 sm:aspect-auto sm:flex sm:w-[42%] sm:max-w-[240px] sm:min-w-[160px] sm:self-stretch sm:p-3"
              : "block aspect-[4/3] w-full overflow-hidden sm:aspect-auto sm:w-[min(46%,320px)] sm:min-h-[200px] sm:max-w-[340px] sm:self-stretch",
          )}
        >
          <div
            className={cn(
              "relative w-full overflow-hidden bg-neutral-200/40",
              isRelated
                ? "absolute inset-2.5 rounded-lg sm:static sm:inset-auto sm:flex sm:min-h-[188px] sm:flex-1"
                : "absolute inset-0",
            )}
          >
            {property.cover_image_url ? (
              <PropertyImage
                src={property.cover_image_url}
                alt=""
                fill
                className={cn(
                  "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
                  isRelated && "rounded-lg",
                )}
                sizes="(max-width: 640px) 100vw, 360px"
                unoptimized={
                  !isRemoteImageOptimizedUrl(property.cover_image_url)
                }
              />
            ) : (
              <PropertyImage
                src={PROPERTY_PLACEHOLDER_SRC}
                alt="No photo available"
                fill
                className="object-contain bg-[#eef4fb]"
                unoptimized
              />
            )}
            <div
              className={cn(
                "absolute z-10 flex max-w-[calc(100%-0.75rem)] items-start",
                isRelated
                  ? "left-2 top-2 flex-col gap-1.5"
                  : "left-2 top-2 flex-wrap gap-2",
              )}
            >
              {property.is_featured ? (
                <span
                  className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md ring-1 ring-black/15"
                  style={{ backgroundColor: LISTING_CARD.navy }}
                  title="Featured listing"
                >
                  <Sparkles
                    className="h-3.5 w-3.5 shrink-0 opacity-95"
                    aria-hidden
                  />
                  Featured
                </span>
              ) : null}
              <span
                className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm"
                style={{ backgroundColor: LISTING_CARD.badgeGreen }}
              >
                {refCode}
              </span>
            </div>
          </div>
        </Link>

        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-3",
            isRelated ? "px-4 py-4 sm:px-5 sm:py-5 sm:pl-4" : "p-4 sm:p-5",
          )}
        >
          <div
            className={cn(
              "min-w-0 space-y-2",
              isRelated
                ? "flex min-h-0 flex-1 flex-col gap-2"
                : "flex-1 sm:flex-none",
            )}
          >
            <Link
              href={href}
              className="block min-w-0 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2b4b] focus-visible:ring-offset-2"
            >
              <h3
                className="line-clamp-2 min-h-0 break-words text-base font-bold leading-snug sm:text-lg"
                style={{ color: LISTING_CARD.navy }}
              >
                {property.title}
              </h3>
            </Link>

            <div
              className={cn(
                "flex w-full min-w-0 items-start gap-2 text-sm sm:text-base",
                isRelated && "min-h-0 flex-1",
              )}
              style={{ color: LISTING_CARD.meta }}
            >
              <MapPin
                className="h-4 w-4 shrink-0 pt-0.5 sm:h-5 sm:w-5 sm:pt-1"
                style={{ color: LISTING_CARD.metaIcon }}
                aria-hidden
              />
              <div className="min-w-0 flex-1 text-left leading-snug">
                <p
                  className={cn(
                    "break-words text-sm sm:text-base",
                    isRelated ? "line-clamp-2" : "line-clamp-1",
                  )}
                  style={{ color: LISTING_CARD.meta }}
                >
                  {line1}
                </p>
                {line2 ? (
                  <p
                    className={cn(
                      "mt-0.5 break-words text-[13px] sm:text-[15px]",
                      isRelated ? "line-clamp-2" : "line-clamp-1",
                    )}
                    style={{ color: LISTING_CARD.meta }}
                  >
                    <AddressLine2 city={line2.city} state={line2.state} />
                  </p>
                ) : null}
              </div>
            </div>
            {!isRelated && property.total_cent != null ? (
              <p
                className="mt-1 text-lg font-extrabold tabular-nums leading-snug sm:text-xl"
                style={{ color: LISTING_CARD.navy }}
              >
                {Number(property.total_cent).toLocaleString("en-IN", {
                  maximumFractionDigits: 4,
                })}{" "}
                <span
                  className="text-base font-bold sm:text-lg"
                  style={{ color: LISTING_CARD.badgeGreen }}
                >
                  cent
                </span>
              </p>
            ) : null}
          </div>

          <div
            className={cn(
              "mt-auto flex flex-col border-t pt-3",
              isRelated
                ? "gap-2 border-neutral-200 pt-3 sm:pt-3.5"
                : "gap-2.5 border-neutral-100 bg-neutral-50/40 sm:gap-3 sm:bg-transparent sm:pt-3.5",
            )}
          >
            <div className="min-w-0 w-full space-y-1">
              <p
                className={cn(
                  "font-bold tabular-nums leading-tight",
                  isRelated ? "text-lg sm:text-xl" : "text-lg sm:text-xl",
                )}
                style={{ color: LISTING_CARD.navy }}
              >
                {priceWithInr}
                <span className="text-sm font-medium text-neutral-500">
                  {priceBasisSuffix}
                </span>
              </p>
              {isRelated && property.total_cent != null ? (
                <p className="text-xs tabular-nums text-neutral-600 sm:text-sm">
                  <span className="font-semibold text-neutral-700">
                    {Number(property.total_cent).toLocaleString("en-IN", {
                      maximumFractionDigits: 4,
                    })}{" "}
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: LISTING_CARD.badgeGreen }}
                  >
                    cent
                  </span>
                </p>
              ) : null}
            </div>
            <Link
              href={href}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#ff0018] px-4 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(255,0,24,0.25)] transition-[opacity,transform] hover:opacity-95 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0018] focus-visible:ring-offset-2"
            >
              View
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function DirectoryListingCardMobile({
  property,
  href,
  priceWithInr,
  subtitleMobile,
  typeLabel,
}: {
  property: PropertyWithRelations;
  href: string;
  priceWithInr: string;
  subtitleMobile: string;
  typeLabel: string;
}) {
  const { has, toggle } = useWishlist();
  const inWishlist = has(property.id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [descOpen, setDescOpen] = useState(false);

  const urls = listingGalleryUrls(property);
  const slides: (string | null)[] = urls.length > 0 ? urls : [null];
  const nSlides = slides.length;

  const onCarouselScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    setImgIdx(Math.min(nSlides - 1, Math.round(el.scrollLeft / w)));
  };

  const shareListing = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}${href}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* dismissed or failed */
    }
  };

  const areaSqft = property.area_sqft;
  /** 1 cent ≈ 435.6 sq ft — used only when `total_cent` is unset (plot listings). */
  const plotCentApproxFromSqft =
    property.structure_type === "plot" &&
    property.total_cent == null &&
    areaSqft != null &&
    areaSqft > 0
      ? areaSqft / 435.6
      : null;
  const sqm =
    areaSqft != null ? Math.round(areaSqft * 0.09290304 * 10) / 10 : null;
  const perSqft =
    property.price_type === "total" &&
    areaSqft != null &&
    areaSqft > 0 &&
    property.price != null
      ? formatPrice(property.price / areaSqft)
      : null;

  const descBody =
    property.short_description?.trim() ||
    (property.description ? plainTextFromHtml(property.description) : "") ||
    "";

  const telHref = phoneToTelHref(CONTACT.phone);

  return (
    <div className="flex flex-col lg:hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <div
          ref={scrollRef}
          onScroll={onCarouselScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((src, i) => (
            <Link
              href={href}
              key={src ?? `empty-${i}`}
              className="relative block h-full min-w-full shrink-0 snap-center"
              draggable={false}
            >
              {src ? (
                <PropertyImage
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                  draggable={false}
                  unoptimized={!isRemoteImageOptimizedUrl(src)}
                />
              ) : (
                <PropertyImage
                  src={PROPERTY_PLACEHOLDER_SRC}
                  alt="No photo available"
                  fill
                  className="object-contain bg-[#eef4fb]"
                  unoptimized
                />
              )}
            </Link>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/75 via-black/35 to-transparent pt-16 pb-2">
          <div className="pointer-events-none flex items-end justify-between gap-2 px-3 pb-1 text-[11px] text-white/95">
            <p className="min-w-0 flex-1 leading-snug">
              Verified listing · {SITE_NAME}
            </p>
            {nSlides > 1 ? (
              <span className="shrink-0 tabular-nums opacity-95">
                {imgIdx + 1}/{nSlides}
              </span>
            ) : null}
          </div>
          {nSlides > 1 ? (
            <div className="pointer-events-none flex justify-center gap-1 pb-1">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === imgIdx ? "bg-white" : "bg-white/40"}`}
                  aria-hidden
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="absolute left-2.5 top-2.5 z-20 flex max-w-[calc(100%-5rem)] flex-wrap items-center gap-2">
          {property.is_featured ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-700/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              <Sparkles className="h-3 w-3 shrink-0 opacity-95" aria-hidden />
              Featured
            </span>
          ) : null}
        </div>

        <div className="absolute right-2 top-2.5 z-20 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(property.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1a2b4b] shadow-md backdrop-blur-sm active:scale-95"
            aria-label={
              inWishlist ? "Remove from wishlist" : "Save to wishlist"
            }
          >
            <Heart
              className="h-4 w-4"
              fill={inWishlist ? "currentColor" : "none"}
              strokeWidth={2}
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void shareListing();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1a2b4b] shadow-md backdrop-blur-sm active:scale-95"
            aria-label="Share listing"
          >
            <Share2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={href}
            className="min-w-0 flex-1 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2b4b] focus-visible:ring-offset-2"
          >
            <h3
              className="text-[15px] font-bold uppercase leading-snug tracking-wide"
              style={{ color: LISTING_CARD.navy }}
            >
              {property.title}
            </h3>
            <p
              className="mt-1 line-clamp-2 text-[13px] leading-snug"
              style={{ color: LISTING_CARD.meta }}
            >
              {subtitleMobile}
            </p>
          </Link>
          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
            {typeLabel}
          </span>
        </div>

        <div className="flex min-h-[4.75rem] divide-x divide-neutral-200 rounded-lg border border-neutral-200 bg-neutral-50/80 px-2 py-2.5">
          <div className="flex min-w-0 flex-1 flex-col justify-center pr-2">
            <p
              className="text-xl font-bold tabular-nums leading-tight"
              style={{ color: LISTING_CARD.navy }}
            >
              {priceWithInr}
            </p>
            <p className="mt-0.5 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
              {property.price_type === "percent" ? "Per cent" : "Total amount"}
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center pl-2">
            {property.total_cent != null ? (
              <>
                <p
                  className="text-lg font-bold tabular-nums leading-tight"
                  style={{ color: LISTING_CARD.navy }}
                >
                  {Number(property.total_cent).toLocaleString("en-IN", {
                    maximumFractionDigits: 4,
                  })}{" "}
                  cent
                </p>
                <p className="mt-1 text-[12px] font-medium uppercase tracking-wide text-neutral-500">
                  Total area
                </p>
              </>
            ) : plotCentApproxFromSqft != null ? (
              <>
                <p
                  className="text-lg font-bold tabular-nums leading-tight"
                  style={{ color: LISTING_CARD.navy }}
                >
                  ≈{" "}
                  {plotCentApproxFromSqft.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}{" "}
                  cent
                </p>
                <p className="mt-1 text-[12px] font-medium uppercase tracking-wide text-neutral-500">
                  Total area (approx)
                </p>
              </>
            ) : areaSqft != null ? (
              <>
                <p
                  className="text-lg font-bold tabular-nums leading-tight"
                  style={{ color: LISTING_CARD.navy }}
                >
                  {areaSqft.toLocaleString("en-IN")} sqft
                  {sqm != null ? (
                    <span className="text-[0.95rem] font-semibold text-neutral-600">
                      {" "}
                      ({sqm.toLocaleString("en-IN")} sqm)
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-[12px] font-medium uppercase tracking-wide text-neutral-500">
                  Total area
                </p>
              </>
            ) : (
              <p className="text-base font-semibold text-neutral-400">—</p>
            )}
          </div>
        </div>

        {descBody ? (
          <button
            type="button"
            onClick={() => setDescOpen((o) => !o)}
            className="flex w-full items-start gap-1 text-left text-[15px] leading-relaxed text-neutral-600"
          >
            <span className={descOpen ? "" : "line-clamp-2"}>{descBody}</span>
            <ChevronDown
              className={`mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition-transform ${descOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <p
              className="text-sm font-bold leading-snug text-balance"
              style={{ color: LISTING_CARD.navy }}
            >
              {SITE_NAME}
            </p>
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
              <Clock className="h-3 w-3" aria-hidden />
              <span className="tabular-nums">
                {formatRelativeTime(property.created_at)}
              </span>
            </span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Link
              href={href}
              className="flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full px-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 active:opacity-90 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              style={{ backgroundColor: LISTING_CARD.ctaRed }}
            >
              View Details
            </Link>
            {CONTACT.whatsappUrl && (
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-opacity hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                style={{ backgroundColor: LISTING_CARD.ctaRed }}
                aria-label={CONTACT.whatsappLabel}
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
              </a>
            )}
            {telHref && (
              <a
                href={telHref}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-opacity hover:opacity-95 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                style={{ backgroundColor: LISTING_CARD.ctaRed }}
                aria-label="Call"
              >
                <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Properties directory — horizontal card with metrics, description, View + WhatsApp. */
export function DirectoryPropertyListingCard({
  property,
  index,
}: {
  property: PropertyWithRelations;
  index: number;
}) {
  const { has, toggle } = useWishlist();
  const inWishlist = has(property.id);
  const href = `/properties/${property.slug}`;
  const { line1, line2 } = addressTwoLines(property);
  const refCode = propertyListingRefCode(property, index);
  const priceFigure = formatPropertyPriceValue(
    property.price ?? 0,
    property.price_type,
  );
  const priceWithInr =
    priceFigure === "—" || priceFigure.startsWith("₹")
      ? priceFigure
      : `₹${priceFigure}`;
  const subtitle = listingSubtitle(property);
  const subtitleMobile = listingSubtitleMobile(property);
  const typeLabel = property.type === "sale" ? "For sale" : "For rent";
  const priceBasisLabel =
    property.price_type === "percent" ? "Per cent" : "Total";
  const showTotalCentCol =
    property.total_cent != null || property.structure_type === "plot";
  const areaSqft = property.area_sqft;
  const hasArea = areaSqft != null;
  const metricCount = 2 + (showTotalCentCol ? 1 : 0) + (hasArea ? 1 : 0);
  /** Keep 2 columns through `lg` when the directory sidebar shares the row — four tight columns overlap labels. */
  const metricsGridClass =
    metricCount >= 4
      ? "grid-cols-2 xl:grid-cols-4"
      : metricCount === 3
        ? "grid-cols-2 xl:grid-cols-3"
        : "grid-cols-2";

  const statCardClass =
    "flex min-h-[3.75rem] flex-col justify-between rounded-lg border border-neutral-100/90 bg-white/90 px-2.5 py-1.5 shadow-[0_1px_3px_rgba(26,43,75,0.07)] sm:min-h-16 sm:px-3 sm:py-2";

  const statLabelClass =
    "text-[11px] font-semibold uppercase tracking-wider text-neutral-500";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min((index % 5) * 0.05, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
    >
      <DirectoryListingCardMobile
        property={property}
        href={href}
        priceWithInr={priceWithInr}
        subtitleMobile={subtitleMobile}
        typeLabel={typeLabel}
      />

      <div className="hidden min-h-0 flex-col lg:flex lg:flex-row">
        <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden bg-neutral-100 lg:aspect-auto lg:w-[min(42%,340px)] lg:min-h-[172px] lg:self-stretch group/image">
          <Link
            href={href}
            className="absolute inset-0 z-0 block"
            aria-label={`View ${property.title}`}
          >
            {property.cover_image_url ? (
              <PropertyImage
                src={property.cover_image_url}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover/image:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 380px"
                unoptimized={
                  !isRemoteImageOptimizedUrl(property.cover_image_url)
                }
              />
            ) : (
              <PropertyImage
                src={PROPERTY_PLACEHOLDER_SRC}
                alt="No photo available"
                fill
                className="object-contain bg-[#eef4fb]"
                unoptimized
              />
            )}
          </Link>
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[calc(100%-5rem)] flex-wrap items-center gap-2">
            {property.is_featured ? (
              <span
                className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md ring-1 ring-black/15"
                style={{ backgroundColor: LISTING_CARD.navy }}
              >
                <Sparkles
                  className="h-3.5 w-3.5 shrink-0 opacity-95"
                  aria-hidden
                />
                Featured
              </span>
            ) : null}
            <span
              className="rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm"
              style={{ backgroundColor: LISTING_CARD.badgeGreen }}
            >
              {refCode}
            </span>
          </div>
          <div className="absolute right-3 top-3 z-20 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(property.id);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#1a2b4b] shadow-md backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              aria-label={
                inWishlist ? "Remove from favorites" : "Add to favorites"
              }
              title={inWishlist ? "Remove from saved" : "Save listing"}
            >
              <Heart
                className="h-4 w-4"
                fill={inWishlist ? "currentColor" : "none"}
                strokeWidth={2}
                aria-hidden
              />
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-4 md:gap-3">
          <div className="min-w-0 space-y-1.5">
            <Link
              href={href}
              className="block rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2b4b] focus-visible:ring-offset-2"
            >
              <h3
                className="line-clamp-2 text-[15px] font-bold leading-tight sm:text-base md:text-lg"
                style={{ color: LISTING_CARD.navy }}
              >
                {property.title}
              </h3>
            </Link>
            <p
              className="line-clamp-2 text-[12px] leading-snug sm:text-[13px]"
              style={{ color: LISTING_CARD.meta }}
            >
              {subtitle}
            </p>
            <div
              className="flex w-full min-w-0 items-start gap-2 text-sm sm:text-base"
              style={{ color: LISTING_CARD.meta }}
            >
              <MapPin
                className="h-4 w-4 shrink-0 pt-0.5 sm:h-5 sm:w-5 sm:pt-1"
                style={{ color: LISTING_CARD.metaIcon }}
                aria-hidden
              />
              <div className="min-w-0 flex-1 leading-snug">
                <p className="line-clamp-1 break-words text-sm sm:text-base">
                  {line1}
                </p>
                {line2 ? (
                  <p className="mt-0.5 line-clamp-1 text-[13px] sm:text-[15px]">
                    <AddressLine2 city={line2.city} state={line2.state} />
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div
            className={`grid gap-2 rounded-lg border border-neutral-200/75 bg-gradient-to-b from-neutral-50/95 via-white to-[#f8f9fb] p-2.5 text-sm shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_8px_24px_-12px_rgba(26,43,75,0.12)] sm:gap-3 sm:p-3 ${metricsGridClass}`}
          >
            <div className={statCardClass}>
              <p className={statLabelClass}>Price</p>
              <div className="mt-1 space-y-0 sm:mt-1.5">
                <p
                  className="text-[0.9375rem] font-bold tabular-nums leading-tight sm:text-base"
                  style={{ color: LISTING_CARD.navy }}
                >
                  {priceWithInr}
                </p>
                <p className="text-xs font-semibold text-neutral-600">
                  {priceBasisLabel}
                </p>
              </div>
            </div>
            {showTotalCentCol ? (
              <div className={statCardClass}>
                <p className={statLabelClass}>Total area</p>
                <div className="mt-1 sm:mt-1.5">
                  {property.total_cent != null ? (
                    <p
                      className="text-[0.9375rem] font-semibold tabular-nums leading-tight sm:text-base"
                      style={{ color: LISTING_CARD.badgeGreen }}
                    >
                      {Number(property.total_cent).toLocaleString("en-IN", {
                        maximumFractionDigits: 4,
                      })}{" "}
                      cent
                    </p>
                  ) : (
                    <p className="text-base font-semibold tabular-nums text-neutral-400">
                      —
                    </p>
                  )}
                </div>
              </div>
            ) : null}
            {hasArea ? (
              <div className={statCardClass}>
                <p className={`flex items-center gap-1.5 ${statLabelClass}`}>
                  <Maximize2
                    className="h-3.5 w-3.5 shrink-0 text-neutral-400"
                    aria-hidden
                  />
                  Area
                </p>
                <div className="mt-1 sm:mt-1.5">
                  <p className="text-[0.9375rem] font-semibold tabular-nums text-neutral-800 sm:text-base">
                    {areaSqft.toLocaleString("en-IN")} sqft
                  </p>
                </div>
              </div>
            ) : null}
            <div className={statCardClass}>
              <p className={statLabelClass}>Status</p>
              <div className="mt-1 sm:mt-1.5">
                <p className="text-[0.9375rem] font-semibold leading-tight text-neutral-800 sm:text-base">
                  {typeLabel}
                </p>
              </div>
            </div>
          </div>

          {property.short_description?.trim() ? (
            <p className="line-clamp-1 text-[13px] leading-snug text-neutral-600 sm:line-clamp-2 sm:text-[15px] sm:leading-relaxed">
              {property.short_description.trim()}
            </p>
          ) : null}

          <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href={href}
              className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 bg-white px-3 text-sm font-semibold text-brand-charcoal transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[130px]"
            >
              View details
            </Link>
            {CONTACT.whatsappUrl ? (
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[148px]"
                style={{
                  backgroundColor: LISTING_CARD.ctaRed,
                }}
                aria-label={CONTACT.whatsappLabel}
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                Contact
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[148px]"
                style={{
                  backgroundColor: LISTING_CARD.ctaRed,
                }}
              >
                Contact
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const P = "animate-pulse rounded-md bg-neutral-200/90 dark:bg-neutral-300/40";

/** Horizontal skeleton — home grid (default) or directory (stats row + dual CTAs). */
export function PropertyListingCardSkeleton({
  variant = "home",
}: {
  variant?: "home" | "directory";
}) {
  const imageClass =
    variant === "directory"
      ? "aspect-[2/1] w-full shrink-0 lg:aspect-auto lg:min-h-[172px] lg:w-[min(42%,340px)] lg:self-stretch"
      : "aspect-[4/3] w-full shrink-0 sm:aspect-auto sm:min-h-[200px] sm:w-[min(46%,320px)] sm:max-w-[340px] sm:self-stretch";

  if (variant === "directory") {
    return (
      <div
        className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03]"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="flex flex-col lg:hidden">
          <div
            className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-neutral-100"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.45),transparent_55%),linear-gradient(145deg,#f3f4f6_0%,#e8eaee_50%,#f0f1f4_100%)]" />
            <div className="absolute left-2.5 top-2.5 z-10 flex gap-2">
              <div className={`h-6 w-16 rounded-md ${P}`} />
            </div>
            <div className="absolute right-2 top-2.5 z-10 flex gap-2">
              <div className={`h-9 w-9 rounded-full ${P}`} />
              <div className={`h-9 w-9 rounded-full ${P}`} />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-neutral-300/40 to-transparent px-3 pb-2 pt-8">
              <div className="flex justify-between gap-2">
                <div className={`h-3 w-2/3 max-w-[12rem] ${P}`} />
                <div className={`h-3 w-8 ${P}`} />
              </div>
              <div className="flex justify-center gap-1">
                <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
                <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
                <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 p-3.5">
            <div className="flex justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <div className={`h-5 w-full max-w-[14rem] ${P}`} />
                <div className={`h-3.5 w-full ${P}`} />
              </div>
              <div className={`h-7 w-16 shrink-0 rounded-full ${P}`} />
            </div>
            <div className="flex min-h-[4.5rem] gap-0 divide-x divide-neutral-200 rounded-lg border border-neutral-200 bg-white p-2">
              <div className="flex flex-1 flex-col justify-center gap-2 pr-2">
                <div className={`h-6 w-24 ${P}`} />
                <div className={`h-3 w-20 ${P}`} />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-2 pl-2">
                <div className={`h-6 w-full max-w-[8rem] ${P}`} />
                <div className={`h-3 w-16 ${P}`} />
              </div>
            </div>
            <div className="flex gap-2 overflow-hidden">
              <div className={`h-7 w-28 shrink-0 rounded-full ${P}`} />
              <div className={`h-7 w-32 shrink-0 rounded-full ${P}`} />
            </div>
            <div className="flex flex-col gap-3 border-t border-neutral-100 pt-3">
              <div className="space-y-2">
                <div className={`h-4 w-28 ${P}`} />
                <div className={`h-3 w-24 ${P}`} />
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-11 min-w-0 flex-1 rounded-full ${P}`} />
                <div className={`h-11 w-11 shrink-0 rounded-full ${P}`} />
                <div className={`h-11 w-11 shrink-0 rounded-full ${P}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden min-h-0 flex-col lg:flex lg:flex-row">
          <div
            className={`relative shrink-0 overflow-hidden bg-neutral-100 ${imageClass}`}
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.45),transparent_55%),linear-gradient(145deg,#f3f4f6_0%,#e8eaee_50%,#f0f1f4_100%)]" />
            <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
              <div className={`h-6 w-16 rounded-md ${P}`} />
              <div className={`h-6 w-[4.25rem] rounded-md ${P}`} />
            </div>
            <div className="absolute bottom-3 right-3 z-10 flex gap-1">
              <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
              <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
              <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
            </div>
          </div>

          <div
            className="flex min-w-0 flex-1 flex-col gap-2 border-t border-neutral-100 bg-white p-3 lg:border-t-0 lg:border-l lg:p-4 md:gap-3"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className={`h-6 w-16 rounded-full ${P}`} />
                <div className={`h-6 w-20 rounded-full ${P}`} />
              </div>
              <div className="space-y-2">
                <div className={`h-5 w-[min(100%,26rem)] max-w-full ${P}`} />
                <div className={`h-5 w-[min(100%,15rem)] max-w-full ${P}`} />
              </div>
              <div className="space-y-1.5">
                <div className={`h-3.5 w-full ${P}`} />
                <div className={`h-3.5 w-[92%] ${P}`} />
              </div>
              <div className="flex gap-2.5">
                <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full ${P}`} />
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className={`h-3.5 w-full ${P}`} />
                  <div className={`h-3 w-4/5 ${P}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-neutral-200/75 bg-white p-2.5 xl:grid-cols-4 xl:gap-3 xl:p-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex min-h-[3.75rem] flex-col justify-between rounded-lg border border-neutral-200/80 bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:min-h-16 lg:px-3 lg:py-2"
                  >
                    <div className={`h-2 w-12 ${P}`} />
                    <div className="space-y-1.5">
                      <div className={`h-4 w-full max-w-[5rem] ${P}`} />
                      <div className={`h-3 w-16 ${P}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <div className={`h-3 w-full ${P}`} />
                <div className={`h-3 w-[88%] ${P}`} />
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-2 border-t border-dashed border-neutral-200 pt-2.5 lg:flex-row lg:items-center lg:justify-end lg:gap-2 lg:pt-3">
              <div className="flex h-9 min-h-9 flex-1 items-center justify-center rounded-lg border-2 border-neutral-200 bg-white lg:min-w-[130px] lg:flex-initial">
                <div className="h-2.5 w-[5.5rem] animate-pulse rounded bg-neutral-200/90" />
              </div>
              <div className="h-9 min-h-9 flex-1 animate-pulse rounded-lg bg-neutral-300/90 lg:min-w-[148px] lg:flex-initial" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.05]"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="flex min-h-0 flex-col sm:flex-row">
        <div
          className={`relative shrink-0 overflow-hidden bg-neutral-100 ${imageClass}`}
          aria-hidden
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.45),transparent_55%),linear-gradient(145deg,#f3f4f6_0%,#e8eaee_50%,#f0f1f4_100%)]" />
          <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
            <div className={`h-6 w-12 rounded-full ${P}`} />
            <div className={`h-6 w-[4.25rem] rounded-md ${P}`} />
          </div>
          <div className="absolute bottom-3 right-3 z-10 flex gap-1">
            <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
            <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
            <div className={`h-1.5 w-1.5 rounded-full ${P}`} />
          </div>
        </div>

        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-3 border-t border-neutral-100 bg-white p-3 sm:border-t-0 sm:border-l sm:p-4"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="min-w-0 space-y-2">
            <div className="space-y-2">
              <div className={`h-5 w-[min(100%,26rem)] max-w-full ${P}`} />
              <div className={`h-5 w-[min(100%,15rem)] max-w-full ${P}`} />
            </div>
            <div className="flex gap-2.5">
              <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full ${P}`} />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className={`h-3.5 w-full ${P}`} />
                <div className={`h-3.5 w-[70%] ${P}`} />
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 pt-1">
              <div className="space-y-1.5">
                <div className={`h-2.5 w-12 ${P}`} />
                <div className={`h-7 w-36 ${P}`} />
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t border-dashed border-neutral-200 pt-2.5 sm:flex-row sm:items-center sm:justify-end sm:gap-2 sm:pt-3">
            <div className={`h-9 w-full rounded-lg ${P}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
