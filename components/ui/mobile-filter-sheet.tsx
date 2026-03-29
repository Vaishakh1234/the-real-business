"use client";

import type { ComponentProps, HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Base `SheetContent` classes for mobile bottom filter / picker sheets (use with `side="bottom"`). */
export const mobileFilterBottomSheetContentClassName =
  "flex max-h-[min(85dvh,820px)] flex-col gap-0 overflow-hidden rounded-t-[1.35rem] border-0 bg-white p-0 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_48px_rgba(0,0,0,0.14)]";

export const mobileFilterSheetSectionLabelClassName =
  "text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500";

export function MobileFilterSheetHandle() {
  return (
    <div className="flex shrink-0 justify-center pt-2.5 pb-1" aria-hidden>
      <div className="h-[3px] w-[2.25rem] rounded-full bg-neutral-300" />
    </div>
  );
}

type MobileFilterSheetOptionProps = ComponentProps<"button"> & {
  selected: boolean;
};

export function MobileFilterSheetOption({
  selected,
  className,
  children,
  ...props
}: MobileFilterSheetOptionProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-[44px] w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[15px] leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 focus-visible:ring-offset-1",
        selected
          ? "bg-brand-gold/[0.12] font-semibold text-[#1a2b4b] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.28)]"
          : "bg-white font-medium text-[#1a2b4b]/92 ring-1 ring-neutral-200/80 hover:bg-neutral-50/95 active:bg-neutral-100/85",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center"
        aria-hidden
      >
        {selected ? (
          <Check className="h-4 w-4 text-brand-gold" strokeWidth={2.5} />
        ) : null}
      </span>
    </button>
  );
}

type MobileFilterSheetListProps = HTMLAttributes<HTMLDivElement>;

export function MobileFilterSheetList({
  className,
  ...props
}: MobileFilterSheetListProps) {
  return (
    <div
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

type MobileFilterSheetScrollBodyProps = HTMLAttributes<HTMLDivElement>;

/** Scrollable region below header in picker sheets (sort, category, …). */
export function MobileFilterSheetScrollBody({
  className,
  ...props
}: MobileFilterSheetScrollBodyProps) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-2 [scrollbar-gutter:stable]",
        className,
      )}
      {...props}
    />
  );
}

type MobileFilterSheetHeadProps = HTMLAttributes<HTMLDivElement>;

export function MobileFilterSheetHead({
  className,
  ...props
}: MobileFilterSheetHeadProps) {
  return (
    <div
      className={cn(
        "shrink-0 border-b border-neutral-100 px-4 pb-2.5 pt-0.5 pr-12",
        className,
      )}
      {...props}
    />
  );
}
