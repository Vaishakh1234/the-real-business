"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  /** Override default title sizes (e.g. smaller heading on dense pages). */
  titleClassName?: string;
  /** Subtitle text or custom JSX (e.g. colored location · status · type) */
  subtitle?: React.ReactNode;
  /** Override default subtitle size (default is text-base). */
  subtitleClassName?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  /** Optional date display - removed from pages, kept for backwards compat */
  showDate?: boolean;
  /** On mobile, show a back link above the title (e.g. from edit property page) */
  backHref?: string;
  /** Used for `aria-label` on the icon-only back control (mobile). */
  backLabel?: string;
  /** Merged onto `<header>` (e.g. `bg-white border-b border-slate-100`). */
  className?: string;
}

export function PageHeader({
  title,
  titleClassName,
  subtitle,
  subtitleClassName,
  breadcrumbs,
  actions,
  showDate = false,
  backHref,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-[#f5f5f5] px-4 pt-4 pb-4 sm:px-6 sm:pt-5 sm:pb-4 lg:px-8 lg:pt-6 lg:pb-5",
        className,
      )}
    >
      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-2 hidden items-center gap-1.5 text-base text-muted-foreground lg:flex"
            >
              {breadcrumbs.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  )}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="font-medium transition-colors hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {backHref ? (
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href={backHref}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-slate-100/90 text-brand-blue shadow-sm transition-colors hover:bg-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
                aria-label={backLabel}
              >
                <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2.25} />
              </Link>
              <h1
                className={cn(
                  "min-w-0 flex-1 text-2xl font-semibold tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-4xl",
                  titleClassName,
                )}
              >
                {title}
              </h1>
            </div>
          ) : (
            <h1
              className={cn(
                "text-2xl font-semibold tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-4xl",
                titleClassName,
              )}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <div
              className={cn(
                "mt-3 hidden text-base text-muted-foreground [&>p]:inline [&>p]:m-0 md:block",
                subtitleClassName,
              )}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
          {showDate && (
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  timeZone: "Asia/Kolkata",
                })}
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
          {actions}
        </div>
      </div>
    </header>
  );
}
