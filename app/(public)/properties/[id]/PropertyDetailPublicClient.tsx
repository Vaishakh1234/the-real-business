"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  LandPlot,
  ArrowLeft,
  Building2,
  Hash,
  Ruler,
  ChevronDown,
  Compass,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { usePublicPropertyByIdOrSlug } from "@/hooks/useProperties";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPropertyPriceValue } from "@/lib/utils";
import { propertyMapIframeSrc } from "@/lib/map-url";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  PROPERTY_DESCRIPTION_HTML_CLASS,
  sanitizePropertyDescription,
} from "@/lib/sanitize-html";
import { PropertyAmenitiesSection } from "@/components/properties/PropertyAmenitiesSection";
import { PropertyDetailGallery } from "@/components/properties/PropertyDetailGallery";
import { PropertyEnquirySidebar } from "@/components/properties/PropertyEnquirySidebar";
import { RelatedGuidesSection } from "@/components/properties/RelatedGuidesSection";
import { RelatedPropertiesSection } from "@/components/properties/RelatedPropertiesSection";
import { LISTING_CARD } from "@/components/properties/PropertyListingCard";
import { getAreaSlugForCity } from "@/lib/constants/areas";

interface PropertyDetailPublicClientProps {
  identifier: string;
}

/** Tighter horizontal padding on small screens; roomier from `sm` up. */
const DETAIL_OUTER_FRAME =
  "mx-auto w-full max-w-[min(100rem,calc(100vw-1.25rem))] px-2.5 pb-14 pt-2.5 sm:max-w-[min(100rem,calc(100vw-2rem))] sm:px-5 sm:pb-16 sm:pt-5 lg:px-8 lg:pt-6 xl:px-12";

/** Shared card shell — light border, soft elevation (reference UI). */
const DETAIL_SURFACE_CARD =
  "rounded-xl border border-neutral-200/90 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:rounded-2xl sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]";

const detailSkeletonPulse = "bg-neutral-200/80";

function DetailSkeleton() {
  return (
    <div
      className="min-h-screen pb-16"
      aria-busy="true"
      aria-label="Loading property"
    >
      <div className={DETAIL_OUTER_FRAME}>
        <Skeleton
          className={cn(
            "mb-4 h-10 w-40 rounded-xl sm:mb-6",
            detailSkeletonPulse,
          )}
        />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_max(18rem,calc(100%*5/12-100px))] xl:gap-10 xl:items-start">
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <div
              className={cn(
                DETAIL_SURFACE_CARD,
                "overflow-hidden p-2.5 sm:p-4 md:p-5",
              )}
            >
              <Skeleton
                className={cn(
                  "aspect-[16/10] w-full rounded-xl",
                  detailSkeletonPulse,
                )}
              />
              <div className="mt-3 flex gap-2 overflow-hidden pb-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn(
                      "h-14 w-[4.5rem] shrink-0 rounded-lg sm:h-16 sm:w-24",
                      detailSkeletonPulse,
                    )}
                  />
                ))}
              </div>
            </div>

            <div
              className={cn(
                DETAIL_SURFACE_CARD,
                "space-y-3 p-4 sm:space-y-4 sm:p-6",
              )}
            >
              <Skeleton
                className={cn("h-9 w-full max-w-xl", detailSkeletonPulse)}
              />
              <Skeleton
                className={cn("h-5 w-64 max-w-full", detailSkeletonPulse)}
              />
              <Skeleton
                className={cn("h-10 w-56 max-w-full", detailSkeletonPulse)}
              />
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[6.5rem] flex-1 rounded-xl border border-neutral-200 bg-white px-2.5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] sm:min-w-[9rem] sm:flex-initial sm:px-3 sm:py-2.5"
                >
                  <Skeleton
                    className={cn(
                      "mb-1.5 h-2 w-11 sm:mb-2 sm:h-2.5 sm:w-14",
                      detailSkeletonPulse,
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-3.5 w-16 sm:h-4 sm:w-24",
                      detailSkeletonPulse,
                    )}
                  />
                </div>
              ))}
            </div>

            <div className={cn(DETAIL_SURFACE_CARD, "p-4 sm:p-6")}>
              <Skeleton
                className={cn("mb-3 h-7 w-52 max-w-full", detailSkeletonPulse)}
              />
              <Skeleton
                className={cn("h-28 w-full rounded-lg", detailSkeletonPulse)}
              />
            </div>
          </div>

          <aside className="min-w-0">
            <div className="xl:sticky xl:top-24">
              <div className={cn(DETAIL_SURFACE_CARD, "p-4 sm:p-6")}>
                <div className="mb-4 flex justify-end gap-2">
                  <Skeleton
                    className={cn(
                      "h-10 w-10 rounded-full",
                      detailSkeletonPulse,
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-10 w-10 rounded-full",
                      detailSkeletonPulse,
                    )}
                  />
                </div>
                <Skeleton
                  className={cn(
                    "mb-4 h-24 w-full rounded-xl",
                    detailSkeletonPulse,
                  )}
                />
                <Skeleton
                  className={cn("mb-3 h-8 w-36", detailSkeletonPulse)}
                />
                <div className="space-y-3">
                  <Skeleton
                    className={cn(
                      "h-10 w-full rounded-lg",
                      detailSkeletonPulse,
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-10 w-full rounded-lg",
                      detailSkeletonPulse,
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-10 w-full rounded-lg",
                      detailSkeletonPulse,
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-24 w-full rounded-lg",
                      detailSkeletonPulse,
                    )}
                  />
                </div>
                <Skeleton
                  className={cn(
                    "mt-4 h-11 w-full rounded-xl",
                    detailSkeletonPulse,
                  )}
                />
                <Skeleton
                  className={cn(
                    "mt-6 h-14 w-full rounded-lg",
                    detailSkeletonPulse,
                  )}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DetailEmpty() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-3 py-16 sm:px-4 sm:py-24">
      <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-brand-charcoal">
          Property not found
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base">
          This listing may have been removed or the link is invalid.
        </p>
        <Link
          href="/properties"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-charcoal px-6 py-3 font-medium text-white transition-colors hover:bg-brand-charcoal/90 focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to properties
        </Link>
      </div>
    </div>
  );
}

function SpecChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-[6.5rem] max-w-[min(100%,19rem)] shrink-0 items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-2.5 py-2 shadow-[0_1px_3px_rgba(15,23,42,0.05)] sm:min-w-[9rem] sm:max-w-[min(100%,20rem)] sm:gap-2.5 sm:px-3 sm:py-2.5 sm:shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <Icon
        className="h-3.5 w-3.5 shrink-0 text-[#3b82f6] sm:h-4 sm:w-4"
        aria-hidden
      />
      <dl className="m-0 min-w-0">
        <dt className="text-[9px] font-bold uppercase leading-tight tracking-[0.05em] text-neutral-500 sm:text-[10px] sm:tracking-wide">
          {label}
        </dt>
        <dd className="m-0 break-words text-[12px] font-bold leading-snug text-neutral-900 sm:text-sm sm:leading-normal">
          {value}
        </dd>
      </dl>
    </div>
  );
}

function SpecChipsSlider({ children }: { children: React.ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [nav, setNav] = useState({
    show: false,
    canPrev: false,
    canNext: false,
  });

  const refreshNav = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const e = 2;
    const overflow = scrollWidth > clientWidth + e;
    setNav({
      show: overflow,
      canPrev: scrollLeft > e,
      canNext: scrollLeft + clientWidth < scrollWidth - e,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el) return;

    refreshNav();
    const ro = new ResizeObserver(refreshNav);
    ro.observe(el);
    if (track) ro.observe(track);
    el.addEventListener("scroll", refreshNav, { passive: true });
    window.addEventListener("resize", refreshNav);

    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", refreshNav);
      window.removeEventListener("resize", refreshNav);
    };
  }, [refreshNav]);

  const scrollByDir = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(el.clientWidth * 0.72, 160);
    el.scrollBy({
      left: dir === "next" ? delta : -delta,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex min-w-0 items-center gap-0 sm:gap-1">
      {nav.show ? (
        <button
          type="button"
          aria-label="Scroll specifications backward"
          disabled={!nav.canPrev}
          onClick={() => scrollByDir("prev")}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors sm:size-10 sm:text-brand-charcoal",
            "hover:bg-neutral-100 active:bg-neutral-200/80",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-30",
          )}
        >
          <ChevronLeft
            className="h-4 w-4 sm:h-5 sm:w-5"
            strokeWidth={2.25}
            aria-hidden
          />
        </button>
      ) : null}
      <div
        ref={scrollerRef}
        className={cn(
          "min-w-0 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          nav.show ? "flex-1" : "w-full",
        )}
      >
        <div
          ref={trackRef}
          className="flex w-max flex-nowrap items-center gap-1 sm:gap-3"
          role="group"
          aria-label="Property specifications"
        >
          {children}
        </div>
      </div>
      {nav.show ? (
        <button
          type="button"
          aria-label="Scroll specifications forward"
          disabled={!nav.canNext}
          onClick={() => scrollByDir("next")}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors sm:size-10 sm:text-brand-charcoal",
            "hover:bg-neutral-100 active:bg-neutral-200/80",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-30",
          )}
        >
          <ChevronRight
            className="h-4 w-4 sm:h-5 sm:w-5"
            strokeWidth={2.25}
            aria-hidden
          />
        </button>
      ) : null}
    </div>
  );
}

/** Max body height (px) before “See more” appears; matches `max-h-[20rem]`. */
const PROPERTY_INFO_COLLAPSED_MAX_PX = 320;

function PropertyInformationCollapsible({
  defaultClosedOnNarrow,
  hasContent,
  shortDescription,
  descriptionHtml,
}: {
  defaultClosedOnNarrow: boolean;
  hasContent: boolean;
  shortDescription: string | null | undefined;
  descriptionHtml: string;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(true);
  const [bodyExpanded, setBodyExpanded] = useState(false);
  const [bodyOverflows, setBodyOverflows] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultClosedOnNarrow && typeof window !== "undefined") {
      if (window.innerWidth < 1024) setOpen(false);
    }
  }, [defaultClosedOnNarrow]);

  const contentKey = `${shortDescription ?? ""}\0${descriptionHtml}`;

  useEffect(() => {
    setBodyExpanded(false);
  }, [contentKey]);

  useEffect(() => {
    if (!open) {
      setBodyExpanded(false);
      return;
    }
    const el = bodyRef.current;
    if (!el) return;

    const measure = () => {
      if (!bodyRef.current) return;
      setBodyOverflows(
        bodyRef.current.scrollHeight > PROPERTY_INFO_COLLAPSED_MAX_PX + 2,
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [open, contentKey]);

  if (!hasContent) return null;

  return (
    <div className={cn(DETAIL_SURFACE_CARD, "min-w-0 max-w-full")}>
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-controls={`${panelId}-panel`}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left transition-colors hover:bg-neutral-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold sm:px-5 sm:py-4"
      >
        <span className="font-heading text-lg font-bold leading-snug tracking-tight text-[#1a2b4b] sm:text-xl md:text-2xl">
          Property information
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-neutral-400 transition-transform sm:h-6 sm:w-6",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={`${panelId}-panel`}
          role="region"
          aria-labelledby={`${panelId}-trigger`}
          className="min-w-0 max-w-full border-t border-neutral-200/90 bg-white px-3.5 pb-4 pt-2 sm:px-5 sm:pb-5 sm:pt-3"
        >
          <div
            ref={bodyRef}
            className={cn(
              "relative min-w-0 max-w-full break-words",
              bodyOverflows && !bodyExpanded && "max-h-[20rem] overflow-hidden",
            )}
          >
            {shortDescription?.trim() ? (
              <p className="mb-3 break-words text-[13px] leading-relaxed text-neutral-600 sm:mb-4 sm:text-sm">
                {shortDescription.trim()}
              </p>
            ) : null}
            {descriptionHtml ? (
              <div
                className={cn(
                  PROPERTY_DESCRIPTION_HTML_CLASS,
                  "min-w-0 max-w-full text-[13px] text-neutral-600 sm:text-[15px]",
                  "[&_h1]:!mt-3 [&_h1]:!text-lg [&_h1]:!font-bold [&_h1]:!leading-snug",
                  "[&_h2]:!mt-3 [&_h2]:!text-base [&_h2]:!font-semibold [&_h2]:!leading-snug",
                  "[&_p]:break-words [&_li]:break-words [&_div]:break-words",
                )}
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : null}
            {bodyOverflows && !bodyExpanded ? (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent"
                aria-hidden
              />
            ) : null}
          </div>
          {bodyOverflows ? (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                aria-expanded={bodyExpanded}
                onClick={() => setBodyExpanded((e) => !e)}
                className="rounded-sm text-sm font-semibold text-brand-charcoal underline decoration-brand-gold decoration-2 underline-offset-4 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                {bodyExpanded ? "See less" : "See more"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function PropertyDetailPublicClient({
  identifier,
}: PropertyDetailPublicClientProps) {
  const router = useRouter();
  const { has, toggle } = useWishlist();
  const {
    data: property,
    isLoading,
    isError,
  } = usePublicPropertyByIdOrSlug(identifier);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !property) return <DetailEmpty />;

  const saved = has(property.id);

  const coverUrl = property.cover_image_url ?? "";
  const gallery = property.gallery_images?.filter(Boolean) ?? [];
  const allImages = coverUrl
    ? [coverUrl, ...gallery.filter((u) => u !== coverUrl)]
    : gallery;

  const structureKind = property.structure_type === "plot" ? "plot" : "house";
  const descriptionHtml = sanitizePropertyDescription(property.description);
  const hasInfoBlock =
    Boolean(property.short_description?.trim()) || Boolean(descriptionHtml);

  const priceFigure = formatPropertyPriceValue(
    property.price ?? 0,
    property.price_type,
  );
  const priceSuffix =
    property.price_type === "percent" ? " / Per cent" : " / Total";

  const amenityPreview =
    property.amenities?.filter(Boolean).slice(0, 2).join(", ") ?? "";
  const facingVal = property.facing?.trim();

  const fullAddressLine = [
    property.address?.trim(),
    property.city?.trim(),
    property.state?.trim(),
    property.zip_code?.trim(),
    property.country?.trim(),
  ].filter((part): part is string => Boolean(part && part.length > 0));
  const locationDisplay = fullAddressLine.join(", ");

  const locationMapSrc = propertyMapIframeSrc(
    property.map_embed_url,
    property.latitude,
    property.longitude,
  );

  const areaSlug = property.city?.trim()
    ? getAreaSlugForCity(property.city)
    : null;

  return (
    <div className="min-h-screen overflow-x-clip pb-16">
      <div className={DETAIL_OUTER_FRAME}>
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6 sm:gap-3">
          <button
            type="button"
            onClick={() => router.push("/properties")}
            className={cn(
              DETAIL_SURFACE_CARD,
              "inline-flex min-h-10 items-center gap-2 px-3 py-2 text-sm font-semibold text-[#1a2b4b] transition-colors hover:bg-neutral-50/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
            )}
            aria-label="Back to properties"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 opacity-80" />
            Back
          </button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_max(18rem,calc(100%*5/12-100px))] xl:gap-10 xl:items-start">
          <div className="min-w-0 space-y-4 sm:space-y-6">
            <PropertyDetailGallery images={allImages} title={property.title} />

            <div className="space-y-3 px-0.5 sm:space-y-4 sm:px-0">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <h1 className="min-w-0 flex-1 font-heading text-[1.375rem] font-bold leading-snug tracking-tight text-[#1a2b4b] sm:text-3xl md:text-[2rem] md:leading-tight">
                  {property.title}
                </h1>
                <button
                  type="button"
                  className={cn(
                    "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border bg-white text-[#1a2b4b] shadow-sm transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold xl:hidden",
                    saved
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-neutral-200",
                  )}
                  aria-label={saved ? "Remove from saved" : "Save property"}
                  aria-pressed={saved}
                  onClick={() => {
                    const wasSaved = saved;
                    toggle(property.id);
                    toast.success(
                      wasSaved ? "Removed from saved" : "Saved to your list",
                    );
                  }}
                >
                  <Heart
                    className={cn("h-5 w-5", saved && "fill-current")}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
              </div>

              {locationDisplay ? (
                <address className="not-italic">
                  <p className="flex items-start gap-2 text-[13px] leading-relaxed text-neutral-500 sm:text-base sm:text-neutral-600">
                    <MapPin
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                      style={{ color: LISTING_CARD.metaIcon }}
                      aria-hidden
                    />
                    <span>{locationDisplay}</span>
                  </p>
                  {property.city?.trim() ? (
                    <p className="mt-2 text-sm">
                      <Link
                        href={
                          areaSlug
                            ? `/areas/${areaSlug}`
                            : `/properties?city=${encodeURIComponent(property.city.trim())}`
                        }
                        className="font-semibold text-brand-gold hover:underline"
                      >
                        More listings in {property.city.trim()}
                      </Link>
                      {" · "}
                      <Link
                        href="/services"
                        className="font-semibold text-brand-gold hover:underline"
                      >
                        Our services
                      </Link>
                    </p>
                  ) : null}
                </address>
              ) : null}

              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <data
                  value={String(property.price ?? 0)}
                  className="text-[1.625rem] font-extrabold tabular-nums leading-none sm:text-4xl md:text-[2.5rem]"
                  style={{ color: LISTING_CARD.ctaRed }}
                >
                  {priceFigure}
                </data>
                <span className="text-base font-bold text-neutral-600 sm:text-xl">
                  {priceSuffix}
                </span>
              </p>
            </div>

            <SpecChipsSlider key={property.id}>
              {structureKind === "house" && property.bedrooms != null ? (
                <SpecChip
                  icon={Bed}
                  label="Bedrooms"
                  value={String(property.bedrooms)}
                />
              ) : null}
              {structureKind === "house" && property.bathrooms != null ? (
                <SpecChip
                  icon={Bath}
                  label="Bathrooms"
                  value={String(property.bathrooms)}
                />
              ) : null}
              {property.area_sqft != null ? (
                <SpecChip
                  icon={Square}
                  label="Area"
                  value={`${property.area_sqft} sqft`}
                />
              ) : null}
              {property.total_cent != null ? (
                <SpecChip
                  icon={LandPlot}
                  label="Total cent"
                  value={Number(property.total_cent).toLocaleString("en-IN", {
                    maximumFractionDigits: 4,
                  })}
                />
              ) : null}
              {structureKind === "plot" && property.plot_dimensions?.trim() ? (
                <SpecChip
                  icon={Ruler}
                  label="Dimensions"
                  value={property.plot_dimensions.trim()}
                />
              ) : null}
              {structureKind === "plot" && property.plot_number?.trim() ? (
                <SpecChip
                  icon={Hash}
                  label="Plot no."
                  value={property.plot_number.trim()}
                />
              ) : null}
              {facingVal ? (
                <SpecChip icon={Compass} label="Facing" value={facingVal} />
              ) : null}
              {amenityPreview ? (
                <SpecChip
                  icon={Building2}
                  label="Highlights"
                  value={amenityPreview}
                />
              ) : null}
            </SpecChipsSlider>

            <PropertyInformationCollapsible
              defaultClosedOnNarrow={false}
              hasContent={hasInfoBlock}
              shortDescription={property.short_description}
              descriptionHtml={descriptionHtml}
            />

            {property.amenities && property.amenities.length > 0 ? (
              <PropertyAmenitiesSection amenities={property.amenities} />
            ) : null}

            {locationMapSrc ? (
              <div className={cn(DETAIL_SURFACE_CARD, "p-3.5 sm:p-6")}>
                <h2 className="mb-3 font-heading text-base font-bold text-[#1a2b4b] sm:mb-4 sm:text-lg">
                  Location
                </h2>
                <div
                  className={cn(
                    "relative w-full overflow-hidden rounded-xl border border-neutral-200",
                    "max-md:h-0 max-md:pb-[calc(56.25%+70px)]",
                    "md:aspect-video md:h-auto md:pb-0",
                  )}
                >
                  <iframe
                    title="Location map"
                    src={locationMapSrc}
                    className="absolute inset-0 h-full w-full md:relative md:inset-auto"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <aside className="min-w-0">
            <div className="xl:sticky xl:top-24">
              <PropertyEnquirySidebar
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </aside>
        </div>

        <RelatedGuidesSection />

        <RelatedPropertiesSection
          excludePropertyId={property.id}
          tags={property.tags}
        />
      </div>
    </div>
  );
}
