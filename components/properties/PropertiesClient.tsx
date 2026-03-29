"use client";

import {
  LayoutGrid,
  Search,
  AlertCircle,
  SearchX,
  SlidersHorizontal,
  ArrowDownWideNarrow,
  LandPlot,
  Sparkles,
  Percent,
  X,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  mobileFilterBottomSheetContentClassName,
  mobileFilterSheetSectionLabelClassName,
  MobileFilterSheetHandle,
  MobileFilterSheetHead,
  MobileFilterSheetList,
  MobileFilterSheetOption,
  MobileFilterSheetScrollBody,
} from "@/components/ui/mobile-filter-sheet";
import { FilterSelect } from "@/components/ui/filter-select";
import { usePublicCategories } from "@/hooks/useCategories";
import { useInfinitePublicProperties } from "@/hooks/useProperties";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import {
  PROPERTIES_LISTING_SEARCH_PLACEHOLDER,
  PUBLIC_PROPERTIES_PAGE_SIZE,
  SITE_NAME,
} from "@/lib/constants/site";
import {
  normalizeListingSortParam,
  type ListingSortValue,
} from "@/lib/listing-sort";
import { cn, formatListingCountCompact } from "@/lib/utils";
import {
  DirectoryPropertyListingCard,
  PropertyListingCardSkeleton,
} from "@/components/properties/PropertyListingCard";
import { ListingResultsHeaderSkeleton } from "@/components/properties/ListingResultsHeaderSkeleton";

const LISTING_NAVY = "#1a2b4b" as const;

function parseCentInputToParam(raw: string): number | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

const SORT_OPTIONS: { value: ListingSortValue; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price_asc", label: "Price: Low to high" },
  { value: "price_desc", label: "Price: High to low" },
];

/** Decode legacy `?price=` presets for API filters and headlines (no budget UI). */
const PRICE_RANGES = [
  { value: "", label: "Any Price", min: undefined, max: undefined },
  { value: "0-10l", label: "Up to ₹10 L", min: 0, max: 10_00_000 },
  { value: "0-20l", label: "Up to ₹20 L", min: 0, max: 20_00_000 },
  { value: "0-50l", label: "Up to ₹50 L", min: 0, max: 50_00_000 },
  {
    value: "50l-1cr",
    label: "₹50 L – ₹1 Cr",
    min: 50_00_000,
    max: 1_00_00_000,
  },
  {
    value: "1cr-5cr",
    label: "₹1 Cr – ₹5 Cr",
    min: 1_00_00_000,
    max: 5_00_00_000,
  },
  { value: "5cr+", label: "₹5 Cr +", min: 5_00_00_000, max: undefined },
];

function buildResultsHeadline(args: {
  categoryName: string | null;
  structure_type: "plot" | "house" | undefined;
  search: string;
  priceLabel: string;
}): string {
  const { categoryName, structure_type, search, priceLabel } = args;
  const q = search.trim();

  if (q) {
    return `Matching “${q}”`;
  }

  const structurePhrase =
    structure_type === "plot"
      ? "Plots & land"
      : structure_type === "house"
        ? "House / villa"
        : null;

  const parts: string[] = [];
  if (categoryName) {
    if (structurePhrase) {
      parts.push(`${categoryName} · ${structurePhrase}`);
    } else {
      parts.push(categoryName);
    }
  } else if (structurePhrase) {
    parts.push(structurePhrase);
  } else {
    parts.push("Plots, land & homes");
  }
  parts.push("in Kerala");

  const suffix: string[] = [];
  if (priceLabel && priceLabel !== "Any Price") suffix.push(priceLabel);

  const head = parts.join(" ");
  return suffix.length ? `${head} · ${suffix.join(" · ")}` : head;
}

export function PropertiesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [propertyTypeSheetOpen, setPropertyTypeSheetOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [highlightSheetOpen, setHighlightSheetOpen] = useState(false);
  const [mobileFilterSheetFocus, setMobileFilterSheetFocus] = useState<
    "all" | "price"
  >("all");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const structure_type_raw = searchParams.get("structure_type") ?? "";
  const structure_type =
    structure_type_raw === "plot" || structure_type_raw === "house"
      ? structure_type_raw
      : undefined;
  const category_id = searchParams.get("category_id") ?? "";
  const priceRange = searchParams.get("price") ?? "";
  const sort = normalizeListingSortParam(searchParams.get("sort"));
  const search = searchParams.get("search") ?? "";
  const price_type_param = searchParams.get("price_type") ?? "";
  const price_type_filter =
    price_type_param === "percent" || price_type_param === "total"
      ? price_type_param
      : undefined;
  const min_total_cent_str = searchParams.get("min_total_cent") ?? "";
  const max_total_cent_str = searchParams.get("max_total_cent") ?? "";
  const featuredOnly =
    searchParams.get("featured") === "1" ||
    searchParams.get("featured") === "true";
  const [searchInput, setSearchInput] = useState(search);
  const [minCentInput, setMinCentInput] = useState(min_total_cent_str);
  const [maxCentInput, setMaxCentInput] = useState(max_total_cent_str);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setMinCentInput(min_total_cent_str);
    setMaxCentInput(max_total_cent_str);
  }, [min_total_cent_str, max_total_cent_str]);

  const priceRangeOption = PRICE_RANGES.find((r) => r.value === priceRange);
  const min_price = priceRangeOption?.min;
  const max_price = priceRangeOption?.max;

  const min_total_cent =
    min_total_cent_str !== "" && Number.isFinite(Number(min_total_cent_str))
      ? Number(min_total_cent_str)
      : undefined;
  const max_total_cent =
    max_total_cent_str !== "" && Number.isFinite(Number(max_total_cent_str))
      ? Number(max_total_cent_str)
      : undefined;

  const { data: categories = [], isPending: categoriesPending } =
    usePublicCategories();

  const categoryName = useMemo(
    () => categories.find((c) => c.id === category_id)?.name ?? null,
    [categories, category_id],
  );

  const infiniteFilters: Omit<
    import("@/hooks/useProperties").PublicPropertyFilters,
    "page" | "limit"
  > = {
    sort,
    structure_type,
    category_id: category_id || undefined,
    min_price,
    max_price,
    search: search.trim() || undefined,
    status: "active",
    price_type: price_type_filter,
    min_total_cent,
    max_total_cent,
    featured: featuredOnly ? 1 : undefined,
  };

  const {
    data: infiniteData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfinitePublicProperties(infiniteFilters);

  const properties = infiniteData?.pages.flatMap((p) => p.data) ?? [];
  const total = infiniteData?.pages[0]?.total ?? 0;

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "" || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      router.push(`/properties?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateParamsRef = useRef(updateParams);
  updateParamsRef.current = updateParams;
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      updateParamsRef.current({
        search: searchInput.trim() || undefined,
      });
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const syncCentParamsToUrl = useCallback(() => {
    updateParams({
      min_total_cent: parseCentInputToParam(minCentInput),
      max_total_cent: parseCentInputToParam(maxCentInput),
    });
  }, [minCentInput, maxCentInput, updateParams]);

  const errorMessage =
    isError && error
      ? error instanceof Error
        ? error.message
        : "Failed to load properties"
      : null;
  const hasFilters =
    search ||
    category_id ||
    priceRange ||
    structure_type ||
    price_type_filter ||
    min_total_cent_str ||
    max_total_cent_str ||
    featuredOnly;
  const filterCount = [
    category_id,
    priceRange,
    search.trim(),
    structure_type,
    price_type_filter,
    min_total_cent_str,
    max_total_cent_str,
    featuredOnly,
  ].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    router.push("/properties", { scroll: false });
  }, [router]);

  const priceLabel =
    PRICE_RANGES.find((r) => r.value === priceRange)?.label ?? "Any Price";

  const headline = buildResultsHeadline({
    categoryName,
    structure_type,
    search,
    priceLabel,
  });

  const filterSidebar = (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black">
          Filters
        </p>
        {hasFilters ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {category_id && categoryName ? (
              <button
                type="button"
                onClick={() => updateParams({ category_id: undefined })}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted"
              >
                {categoryName}
                <X className="h-3 w-3" aria-hidden />
              </button>
            ) : null}
            {structure_type === "plot" ? (
              <button
                type="button"
                onClick={() => updateParams({ structure_type: undefined })}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted"
              >
                Plots & land
                <X className="h-3 w-3" aria-hidden />
              </button>
            ) : null}
            {structure_type === "house" ? (
              <button
                type="button"
                onClick={() => updateParams({ structure_type: undefined })}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted"
              >
                House / villa
                <X className="h-3 w-3" aria-hidden />
              </button>
            ) : null}
            {price_type_filter === "percent" ? (
              <button
                type="button"
                onClick={() => updateParams({ price_type: undefined })}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted"
              >
                Per cent pricing
                <X className="h-3 w-3" aria-hidden />
              </button>
            ) : null}
            {price_type_filter === "total" ? (
              <button
                type="button"
                onClick={() => updateParams({ price_type: undefined })}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted"
              >
                Total price
                <X className="h-3 w-3" aria-hidden />
              </button>
            ) : null}
            {min_total_cent_str || max_total_cent_str ? (
              <button
                type="button"
                onClick={() => {
                  setMinCentInput("");
                  setMaxCentInput("");
                  updateParams({
                    min_total_cent: undefined,
                    max_total_cent: undefined,
                  });
                }}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted max-w-full"
              >
                <span className="truncate">
                  Extent
                  {min_total_cent_str ? ` ≥ ${min_total_cent_str}` : ""}
                  {max_total_cent_str ? ` ≤ ${max_total_cent_str}` : ""} cent
                </span>
                <X className="h-3 w-3 shrink-0" aria-hidden />
              </button>
            ) : null}
            {featuredOnly ? (
              <button
                type="button"
                onClick={() => updateParams({ featured: undefined })}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted"
              >
                Featured only
                <X className="h-3 w-3" aria-hidden />
              </button>
            ) : null}
            {priceRange ? (
              <button
                type="button"
                onClick={() => updateParams({ price: undefined })}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted"
              >
                {priceLabel}
                <X className="h-3 w-3" aria-hidden />
              </button>
            ) : null}
            {search.trim() ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  updateParams({ search: undefined });
                }}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-brand-charcoal hover:bg-muted max-w-full"
              >
                <span className="truncate max-w-[140px]">
                  “{search.trim()}”
                </span>
                <X className="h-3 w-3 shrink-0" aria-hidden />
              </button>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mb-2">
            No filters applied
          </p>
        )}
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-brand-gold hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="space-y-4 border-t border-border pt-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-brand-charcoal">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder={PROPERTIES_LISTING_SEARCH_PLACEHOLDER}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-brand-charcoal placeholder:text-muted-foreground focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              aria-label="Search properties"
            />
          </div>
        </div>
        <FilterSelect
          label="Property kind"
          value={structure_type ?? ""}
          onValueChange={(v) =>
            updateParams({
              structure_type: v === "plot" || v === "house" ? v : undefined,
            })
          }
          options={[
            { value: "", label: "All types" },
            { value: "house", label: "House / villa" },
            { value: "plot", label: "Plots & land" },
          ]}
          icon={<LandPlot className="h-4 w-4" />}
          triggerClassName="h-11 bg-white"
        />
        <FilterSelect
          label="Category"
          value={category_id}
          onValueChange={(v) => updateParams({ category_id: v || undefined })}
          options={[
            { value: "", label: "All categories" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
          icon={<LayoutGrid className="h-4 w-4" />}
          triggerClassName="h-11 bg-white"
          isOptionsLoading={categoriesPending}
          optionsLoadingText="Loading categories…"
        />
        <FilterSelect
          label="Price basis"
          value={price_type_filter ?? ""}
          onValueChange={(v) =>
            updateParams({
              price_type: v === "percent" || v === "total" ? v : undefined,
            })
          }
          options={[
            { value: "", label: "Any (total or per cent)" },
            { value: "total", label: "Total price" },
            { value: "percent", label: "Per cent" },
          ]}
          icon={<Percent className="h-4 w-4" />}
          triggerClassName="h-11 bg-white"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-charcoal">
              Min extent (cent)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="e.g. 5"
              value={minCentInput}
              onChange={(e) => setMinCentInput(e.target.value)}
              onBlur={syncCentParamsToUrl}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-charcoal tabular-nums placeholder:text-muted-foreground focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              aria-label="Minimum land extent in cent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-charcoal">
              Max extent (cent)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="e.g. 25"
              value={maxCentInput}
              onChange={(e) => setMaxCentInput(e.target.value)}
              onBlur={syncCentParamsToUrl}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-brand-charcoal tabular-nums placeholder:text-muted-foreground focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              aria-label="Maximum land extent in cent"
            />
          </div>
        </div>
        <FilterSelect
          label="Highlight"
          value={featuredOnly ? "1" : ""}
          onValueChange={(v) =>
            updateParams({ featured: v === "1" ? "1" : undefined })
          }
          options={[
            { value: "", label: "All listings" },
            { value: "1", label: "Featured only" },
          ]}
          icon={<Sparkles className="h-4 w-4" />}
          triggerClassName="h-11 bg-white"
        />
      </div>
    </div>
  );

  const chipBase =
    "inline-flex shrink-0 items-center gap-1 rounded-full border bg-white px-3.5 py-2 text-sm font-semibold text-[#1a2b4b] shadow-sm transition-[border-color,background-color,box-shadow] active:bg-neutral-50";
  const chipInactive = "border-neutral-200";
  const chipActive = "border-brand-gold bg-brand-gold/15";

  const resultsToolbar = !isLoading &&
    !errorMessage &&
    properties.length > 0 && (
      <div className="mb-6 hidden md:mb-8 lg:block">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2">
          <h2 className="min-w-0 shrink text-base font-bold leading-snug sm:py-0.5 sm:text-lg md:text-[1.25rem] md:leading-snug">
            <span className="tabular-nums" style={{ color: LISTING_NAVY }}>
              {total.toLocaleString("en-IN")} results
            </span>
            <span
              className="px-1.5 font-bold text-neutral-300 sm:px-2"
              aria-hidden
            >
              |
            </span>
            <span className="font-bold" style={{ color: LISTING_NAVY }}>
              {headline}
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <span
                className="whitespace-nowrap text-sm font-semibold leading-none"
                style={{ color: LISTING_NAVY }}
              >
                Sort by
              </span>
              <FilterSelect
                value={sort}
                onValueChange={(v) =>
                  updateParams({
                    sort: normalizeListingSortParam(v),
                  })
                }
                options={SORT_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                placeholder="Select"
                icon={
                  <ArrowDownWideNarrow
                    className="h-4 w-4 shrink-0"
                    style={{ color: LISTING_NAVY }}
                    aria-hidden
                  />
                }
                triggerClassName="h-10 min-h-10 min-w-[9.5rem] rounded-full border border-neutral-200 bg-white text-sm font-semibold shadow-none hover:bg-neutral-50/80 [&>span]:text-[#1a2b4b] md:min-w-[11rem]"
                aria-label="Sort results"
              />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <>
      <section className="sticky top-[calc(env(safe-area-inset-top)+4rem)] z-40 border-b border-border bg-white pb-3 pt-3 lg:hidden">
        <div className={publicContentFrameClass}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.history.length > 1
                  ) {
                    router.back();
                  } else {
                    router.push("/");
                  }
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-[#1a2b4b] shadow-sm active:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <div className="relative min-w-0 flex-1">
                <input
                  type="search"
                  placeholder="Search City/Locality/Project"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-11 w-full rounded-full border border-neutral-200 bg-white py-2 pl-11 pr-4 text-[15px] text-brand-charcoal shadow-sm placeholder:text-muted-foreground focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  aria-label="Search properties"
                />
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto pt-2 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => {
                  setMobileFilterSheetFocus("all");
                  setFilterSheetOpen(true);
                }}
                className={`${chipBase} relative ${chipInactive}`}
                aria-label={
                  filterCount
                    ? `Filters (${filterCount} active)`
                    : "Open filters"
                }
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                {filterCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {filterCount > 9 ? "9+" : filterCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSortSheetOpen(true)}
                className={`${chipBase} ${sort !== "newest" ? chipActive : chipInactive}`}
              >
                Sort
                <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setPropertyTypeSheetOpen(true)}
                className={`${chipBase} max-w-[11rem] truncate ${structure_type ? chipActive : chipInactive}`}
              >
                Property type
                <ChevronDown
                  className="h-4 w-4 shrink-0 opacity-70"
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => setCategorySheetOpen(true)}
                className={`${chipBase} min-w-0 max-w-[11rem] ${category_id ? chipActive : chipInactive}`}
                aria-label={
                  categoryName ? `Category: ${categoryName}` : "Choose category"
                }
              >
                <span className="min-w-0 truncate">
                  {categoryName ?? "Category"}
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 opacity-70"
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileFilterSheetFocus("price");
                  setFilterSheetOpen(true);
                }}
                className={`${chipBase} max-w-[11rem] truncate ${price_type_filter ? chipActive : chipInactive}`}
              >
                Price basis
                <ChevronDown
                  className="h-4 w-4 shrink-0 opacity-70"
                  aria-hidden
                />
              </button>
              <button
                type="button"
                onClick={() => setHighlightSheetOpen(true)}
                className={`${chipBase} max-w-[11rem] truncate ${featuredOnly ? chipActive : chipInactive}`}
                aria-label={
                  featuredOnly
                    ? "Highlight: featured only"
                    : "Choose highlight filter"
                }
              >
                Highlights
                <ChevronDown
                  className="h-4 w-4 shrink-0 opacity-70"
                  aria-hidden
                />
              </button>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border/80 text-xs font-medium text-muted-foreground active:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
              >
                <X className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>Clear all filters</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <Sheet
        open={filterSheetOpen}
        onOpenChange={(open) => {
          setFilterSheetOpen(open);
          if (!open) setMobileFilterSheetFocus("all");
        }}
      >
        <SheetContent
          side="bottom"
          className={mobileFilterBottomSheetContentClassName}
        >
          <MobileFilterSheetHandle />
          <MobileFilterSheetHead>
            <SheetHeader className="space-y-0 border-0 p-0 text-left">
              <SheetTitle className="text-base font-semibold tracking-tight text-[#1a2b4b]">
                {mobileFilterSheetFocus === "price"
                  ? "Price basis"
                  : "All filters"}
              </SheetTitle>
            </SheetHeader>
          </MobileFilterSheetHead>
          <MobileFilterSheetScrollBody className="flex-1">
            <div className="grid gap-4 pb-1">
              {mobileFilterSheetFocus === "all" ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label
                      className={mobileFilterSheetSectionLabelClassName}
                      htmlFor="mobile-filters-search"
                    >
                      Search
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="mobile-filters-search"
                        type="search"
                        placeholder={PROPERTIES_LISTING_SEARCH_PLACEHOLDER}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="min-h-[46px] w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-3 text-[15px] text-brand-charcoal placeholder:text-neutral-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/35"
                        aria-label="Search properties"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className={mobileFilterSheetSectionLabelClassName}>
                      Property kind
                    </p>
                    <MobileFilterSheetList>
                      {(
                        [
                          { value: "" as const, label: "All types" },
                          { value: "house" as const, label: "House / villa" },
                          { value: "plot" as const, label: "Plots & land" },
                        ] as const
                      ).map((o) => (
                        <MobileFilterSheetOption
                          key={o.value || "all"}
                          selected={(structure_type ?? "") === o.value}
                          onClick={() =>
                            updateParams({
                              structure_type:
                                o.value === "plot" || o.value === "house"
                                  ? o.value
                                  : undefined,
                            })
                          }
                        >
                          {o.label}
                        </MobileFilterSheetOption>
                      ))}
                    </MobileFilterSheetList>
                  </div>
                  <div className="space-y-1.5">
                    <p className={mobileFilterSheetSectionLabelClassName}>
                      Category
                    </p>
                    {categoriesPending ? (
                      <p className="py-2 text-sm text-neutral-500">
                        Loading categories…
                      </p>
                    ) : (
                      <MobileFilterSheetList>
                        <MobileFilterSheetOption
                          selected={!category_id}
                          onClick={() =>
                            updateParams({ category_id: undefined })
                          }
                        >
                          All categories
                        </MobileFilterSheetOption>
                        {categories.map((c) => (
                          <MobileFilterSheetOption
                            key={c.id}
                            selected={category_id === c.id}
                            onClick={() => updateParams({ category_id: c.id })}
                          >
                            {c.name}
                          </MobileFilterSheetOption>
                        ))}
                      </MobileFilterSheetList>
                    )}
                  </div>
                </>
              ) : null}
              <div
                id="filters-price-basis-block"
                className="scroll-mt-3 space-y-1.5"
              >
                {mobileFilterSheetFocus === "all" ? (
                  <p className={mobileFilterSheetSectionLabelClassName}>
                    Price basis
                  </p>
                ) : null}
                <MobileFilterSheetList>
                  {(
                    [
                      { value: "" as const, label: "Any (total or per cent)" },
                      { value: "total" as const, label: "Total price" },
                      { value: "percent" as const, label: "Per cent" },
                    ] as const
                  ).map((o) => (
                    <MobileFilterSheetOption
                      key={o.value || "any"}
                      selected={(price_type_filter ?? "") === o.value}
                      onClick={() =>
                        updateParams({
                          price_type:
                            o.value === "percent" || o.value === "total"
                              ? o.value
                              : undefined,
                        })
                      }
                    >
                      {o.label}
                    </MobileFilterSheetOption>
                  ))}
                </MobileFilterSheetList>
              </div>
              <div className="space-y-1.5">
                <p className={mobileFilterSheetSectionLabelClassName}>
                  Extent (cent)
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-neutral-600">
                      Min
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 5"
                      value={minCentInput}
                      onChange={(e) => setMinCentInput(e.target.value)}
                      onBlur={syncCentParamsToUrl}
                      className="min-h-[44px] w-full rounded-lg border border-neutral-200 bg-white px-2.5 text-[15px] text-brand-charcoal tabular-nums placeholder:text-neutral-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/35"
                      aria-label="Minimum extent in cent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-neutral-600">
                      Max
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 25"
                      value={maxCentInput}
                      onChange={(e) => setMaxCentInput(e.target.value)}
                      onBlur={syncCentParamsToUrl}
                      className="min-h-[44px] w-full rounded-lg border border-neutral-200 bg-white px-2.5 text-[15px] text-brand-charcoal tabular-nums placeholder:text-neutral-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/35"
                      aria-label="Maximum extent in cent"
                    />
                  </div>
                </div>
              </div>
              {mobileFilterSheetFocus === "all" ? (
                <div className="space-y-1.5">
                  <p className={mobileFilterSheetSectionLabelClassName}>
                    Highlight
                  </p>
                  <MobileFilterSheetList>
                    <MobileFilterSheetOption
                      selected={!featuredOnly}
                      onClick={() => updateParams({ featured: undefined })}
                    >
                      All listings
                    </MobileFilterSheetOption>
                    <MobileFilterSheetOption
                      selected={featuredOnly}
                      onClick={() => updateParams({ featured: "1" })}
                    >
                      Featured only
                    </MobileFilterSheetOption>
                  </MobileFilterSheetList>
                </div>
              ) : null}
            </div>
          </MobileFilterSheetScrollBody>
          <SheetFooter className="mt-0 flex shrink-0 flex-row flex-wrap items-stretch justify-end gap-2 border-t border-neutral-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:justify-end">
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setFilterSheetOpen(false);
                }}
                className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-[#1a2b4b] hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
              >
                <X className="h-4 w-4 shrink-0" aria-hidden />
                <span>Clear all</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="min-h-[44px] shrink-0 rounded-lg bg-brand-charcoal px-5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              Done
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={sortSheetOpen} onOpenChange={setSortSheetOpen}>
        <SheetContent
          side="bottom"
          className={mobileFilterBottomSheetContentClassName}
        >
          <MobileFilterSheetHandle />
          <MobileFilterSheetHead>
            <SheetHeader className="space-y-0 border-0 p-0 text-left">
              <SheetTitle className="text-base font-semibold tracking-tight text-[#1a2b4b]">
                Sort
              </SheetTitle>
            </SheetHeader>
          </MobileFilterSheetHead>
          <MobileFilterSheetScrollBody>
            <MobileFilterSheetList>
              {SORT_OPTIONS.map((o) => (
                <MobileFilterSheetOption
                  key={o.value}
                  selected={sort === o.value}
                  onClick={() => {
                    updateParams({
                      sort: o.value,
                    });
                    setSortSheetOpen(false);
                  }}
                >
                  {o.label}
                </MobileFilterSheetOption>
              ))}
            </MobileFilterSheetList>
          </MobileFilterSheetScrollBody>
        </SheetContent>
      </Sheet>

      <Sheet
        open={propertyTypeSheetOpen}
        onOpenChange={setPropertyTypeSheetOpen}
      >
        <SheetContent
          side="bottom"
          className={mobileFilterBottomSheetContentClassName}
        >
          <MobileFilterSheetHandle />
          <MobileFilterSheetHead>
            <SheetHeader className="space-y-0 border-0 p-0 text-left">
              <SheetTitle className="text-base font-semibold tracking-tight text-[#1a2b4b]">
                Property type
              </SheetTitle>
            </SheetHeader>
          </MobileFilterSheetHead>
          <MobileFilterSheetScrollBody>
            <MobileFilterSheetList>
              {(
                [
                  { value: "" as const, label: "All types" },
                  { value: "house" as const, label: "House / villa" },
                  { value: "plot" as const, label: "Plots & land" },
                ] as const
              ).map((o) => (
                <MobileFilterSheetOption
                  key={o.value || "all"}
                  selected={(structure_type ?? "") === o.value}
                  onClick={() => {
                    updateParams({
                      structure_type: o.value || undefined,
                    });
                    setPropertyTypeSheetOpen(false);
                  }}
                >
                  {o.label}
                </MobileFilterSheetOption>
              ))}
            </MobileFilterSheetList>
          </MobileFilterSheetScrollBody>
        </SheetContent>
      </Sheet>

      <Sheet open={categorySheetOpen} onOpenChange={setCategorySheetOpen}>
        <SheetContent
          side="bottom"
          className={mobileFilterBottomSheetContentClassName}
        >
          <MobileFilterSheetHandle />
          <MobileFilterSheetHead>
            <SheetHeader className="space-y-0 border-0 p-0 text-left">
              <SheetTitle className="text-base font-semibold tracking-tight text-[#1a2b4b]">
                Category
              </SheetTitle>
            </SheetHeader>
          </MobileFilterSheetHead>
          <MobileFilterSheetScrollBody className="max-h-[min(52dvh,20rem)]">
            {categoriesPending ? (
              <p className="py-2 text-sm text-neutral-500">
                Loading categories…
              </p>
            ) : (
              <MobileFilterSheetList>
                <MobileFilterSheetOption
                  selected={!category_id}
                  onClick={() => {
                    updateParams({ category_id: undefined });
                    setCategorySheetOpen(false);
                  }}
                >
                  All categories
                </MobileFilterSheetOption>
                {categories.map((c) => (
                  <MobileFilterSheetOption
                    key={c.id}
                    selected={category_id === c.id}
                    onClick={() => {
                      updateParams({ category_id: c.id });
                      setCategorySheetOpen(false);
                    }}
                  >
                    {c.name}
                  </MobileFilterSheetOption>
                ))}
              </MobileFilterSheetList>
            )}
          </MobileFilterSheetScrollBody>
        </SheetContent>
      </Sheet>

      <Sheet open={highlightSheetOpen} onOpenChange={setHighlightSheetOpen}>
        <SheetContent
          side="bottom"
          className={mobileFilterBottomSheetContentClassName}
        >
          <MobileFilterSheetHandle />
          <MobileFilterSheetHead>
            <SheetHeader className="space-y-0 border-0 p-0 text-left">
              <SheetTitle className="text-base font-semibold tracking-tight text-[#1a2b4b]">
                Highlights
              </SheetTitle>
            </SheetHeader>
          </MobileFilterSheetHead>
          <MobileFilterSheetScrollBody>
            <MobileFilterSheetList>
              <MobileFilterSheetOption
                selected={!featuredOnly}
                onClick={() => {
                  updateParams({ featured: undefined });
                  setHighlightSheetOpen(false);
                }}
              >
                All listings
              </MobileFilterSheetOption>
              <MobileFilterSheetOption
                selected={featuredOnly}
                onClick={() => {
                  updateParams({ featured: "1" });
                  setHighlightSheetOpen(false);
                }}
              >
                Featured only
              </MobileFilterSheetOption>
            </MobileFilterSheetList>
          </MobileFilterSheetScrollBody>
        </SheetContent>
      </Sheet>

      <section className="bg-muted/40 pb-12 pt-4 sm:pb-16 sm:pt-6 md:bg-muted/50 md:pb-20 md:pt-8 lg:pb-24 lg:pt-10">
        <div className={publicContentFrameClass}>
          {isLoading && (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
              <aside className="hidden lg:block lg:self-start">
                <div className="sticky top-20 z-10 max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-y-contain pr-1 md:top-24 md:max-h-[calc(100svh-6.5rem)] [scrollbar-gutter:stable]">
                  {filterSidebar}
                </div>
              </aside>
              <div className="min-w-0 lg:min-h-0">
                <ListingResultsHeaderSkeleton />
                <div className="flex flex-col gap-5">
                  {Array.from({ length: PUBLIC_PROPERTIES_PAGE_SIZE }).map(
                    (_, i) => (
                      <PropertyListingCardSkeleton
                        key={i}
                        variant="directory"
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {!isLoading && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center px-4 py-12 text-center sm:py-16 md:py-24"
            >
              <div className="mb-4 rounded-full bg-destructive/10 p-4">
                <AlertCircle
                  className="h-10 w-10 text-destructive"
                  aria-hidden
                />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Failed to load properties
              </h2>
              <p className="mb-6 max-w-md text-base text-muted-foreground">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-charcoal px-6 py-3 font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              >
                Try again
              </button>
            </motion.div>
          )}

          {!isLoading && !errorMessage && properties.length === 0 && (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
              <aside className="hidden lg:block lg:self-start">
                <div className="sticky top-20 z-10 max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-y-contain pr-1 md:top-24 md:max-h-[calc(100svh-6.5rem)] [scrollbar-gutter:stable]">
                  {filterSidebar}
                </div>
              </aside>
              <div className="min-w-0 lg:min-h-0">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  className="flex justify-center px-4 py-12 sm:py-16 lg:py-14"
                >
                  <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white px-6 py-8 text-center shadow-sm sm:px-8">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                      <SearchX
                        className="h-7 w-7 text-neutral-500"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                    <h2
                      className="text-lg font-bold leading-snug text-balance sm:text-xl"
                      style={{ color: LISTING_NAVY }}
                    >
                      No properties found
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {hasFilters
                        ? "Try clearing filters or widening your search."
                        : "Nothing listed yet. Check back later."}
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                      {hasFilters ? (
                        <button
                          type="button"
                          onClick={() => router.push("/properties")}
                          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand-charcoal px-4 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:w-auto"
                        >
                          Clear all filters
                        </button>
                      ) : null}
                      <Link
                        href="/"
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-brand-charcoal hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:w-auto"
                      >
                        {hasFilters ? "Home" : "Go to homepage"}
                      </Link>
                    </div>
                    <p className="mt-6 text-xs text-neutral-400">{SITE_NAME}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {!isLoading && !errorMessage && properties.length > 0 && (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
              <aside className="hidden lg:block lg:self-start">
                <div className="sticky top-20 z-10 max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-y-contain pr-1 md:top-24 md:max-h-[calc(100svh-6.5rem)] [scrollbar-gutter:stable]">
                  {filterSidebar}
                </div>
              </aside>
              <div className="min-w-0 lg:min-h-0">
                <div className="mb-3 min-w-0 lg:hidden">
                  <h2 className="flex min-w-0 items-center gap-x-1.5 text-[15px] font-bold leading-snug text-[#1a2b4b]">
                    <span className="shrink-0 tabular-nums tracking-wide">
                      {formatListingCountCompact(total)} RESULTS
                    </span>
                    <span className="shrink-0 text-neutral-300" aria-hidden>
                      |
                    </span>
                    <span
                      className="min-w-0 truncate capitalize"
                      title={headline}
                    >
                      {headline}
                    </span>
                  </h2>
                </div>
                {resultsToolbar}
                <div className="flex flex-col gap-5">
                  {properties.map((property, index) => (
                    <DirectoryPropertyListingCard
                      key={property.id}
                      property={property}
                      index={index}
                    />
                  ))}
                </div>
                <div
                  ref={loadMoreRef}
                  className="flex min-h-[72px] flex-col items-center justify-center py-8 md:py-10"
                  aria-busy={isFetchingNextPage || undefined}
                >
                  {isFetchingNextPage ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.28,
                        ease: "easeOut",
                      }}
                      className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-white px-6 py-5 shadow-sm ring-1 ring-black/[0.04]"
                      role="status"
                      aria-live="polite"
                      aria-label="Loading more property listings"
                    >
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-muted/80"
                        aria-hidden
                      >
                        <motion.div
                          className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-brand-gold to-transparent"
                          style={{ opacity: 0.95 }}
                          animate={
                            reduceMotion
                              ? { x: "0%" }
                              : { x: ["-100%", "400%"] }
                          }
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : {
                                  duration: 1.35,
                                  repeat: Infinity,
                                  ease: "linear",
                                }
                          }
                        />
                      </div>
                      <div className="flex flex-col items-center gap-4 pt-1">
                        <div
                          className="flex h-6 items-end justify-center gap-2"
                          aria-hidden
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="block size-2 rounded-full bg-brand-gold"
                              animate={
                                reduceMotion
                                  ? { opacity: 0.85 }
                                  : {
                                      y: [0, -10, 0],
                                      scaleY: [1, 1.15, 1],
                                      opacity: [0.55, 1, 0.55],
                                    }
                              }
                              transition={
                                reduceMotion
                                  ? { duration: 0 }
                                  : {
                                      duration: 0.75,
                                      repeat: Infinity,
                                      delay: i * 0.14,
                                      ease: [0.45, 0, 0.55, 1],
                                    }
                              }
                            />
                          ))}
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="font-heading text-[0.7rem] font-bold uppercase tracking-[0.22em] text-brand-gold">
                            Loading more
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pulling the next set of listings for you
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : hasNextPage ? (
                    <span className="sr-only">Scroll for more results</span>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
