import {
  LandPlot,
  LayoutGrid,
  Loader2,
  Percent,
  Search,
  Sparkles,
} from "lucide-react";
import { PROPERTIES_LISTING_SEARCH_PLACEHOLDER } from "@/lib/constants/site";

/**
 * Non-interactive filter panel for the initial route loading fallback.
 * Matches the live sidebar layout without skeleton pulses on the whole column.
 */
export function PropertiesFilterSidebarStatic() {
  const field =
    "flex h-11 w-full items-center gap-2 rounded-xl border border-border bg-white px-3 text-sm text-muted-foreground";
  const label = "text-sm font-semibold text-brand-charcoal";

  return (
    <div className="space-y-6 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-black">
          Filters
        </p>
        <p className="text-xs text-muted-foreground mb-2">No filters applied</p>
      </div>

      <div className="space-y-4 border-t border-border pt-5">
        <div className="space-y-1.5">
          <label className={label}>Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              readOnly
              tabIndex={-1}
              placeholder={PROPERTIES_LISTING_SEARCH_PLACEHOLDER}
              className="h-11 w-full cursor-default rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-brand-charcoal placeholder:text-muted-foreground"
              aria-hidden
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Property kind
          </label>
          <div className={field}>
            <LandPlot className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">All types</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Category
          </label>
          <div
            className={`${field} cursor-wait pl-3`}
            aria-busy="true"
            aria-label="Loading categories"
          >
            <LayoutGrid className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Loader2
              className="h-4 w-4 shrink-0 animate-spin text-muted-foreground"
              aria-hidden
            />
            <span className="flex-1 truncate text-sm text-muted-foreground">
              Loading categories…
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Price basis
          </label>
          <div className={field}>
            <Percent className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">Any (total or per cent)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={label}>Min extent (cent)</label>
            <input
              readOnly
              tabIndex={-1}
              placeholder="e.g. 5"
              className="h-11 w-full cursor-default rounded-xl border border-border bg-white px-3 text-sm tabular-nums placeholder:text-muted-foreground"
              aria-hidden
            />
          </div>
          <div className="space-y-1.5">
            <label className={label}>Max extent (cent)</label>
            <input
              readOnly
              tabIndex={-1}
              placeholder="e.g. 25"
              className="h-11 w-full cursor-default rounded-xl border border-border bg-white px-3 text-sm tabular-nums placeholder:text-muted-foreground"
              aria-hidden
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            Highlight
          </label>
          <div className={field}>
            <Sparkles className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">All listings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
