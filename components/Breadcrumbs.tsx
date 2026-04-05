import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { getSiteOrigin } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Omit `href` for the current page (not linked). */
  href?: string;
}

const linkClass =
  "rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:bg-brand-gold/10 hover:text-brand-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F3ED]";

export function Breadcrumbs({
  items,
  className,
  /** Current path (e.g. `/contact`) so the last crumb has an `item` URL in JSON-LD. */
  currentPath,
}: {
  items: BreadcrumbItem[];
  className?: string;
  currentPath?: string;
}) {
  if (items.length === 0) return null;

  const origin = getSiteOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const isLast = i === items.length - 1;
      let path = item.href?.startsWith("/")
        ? item.href
        : item.href
          ? `/${item.href}`
          : undefined;
      if (!path && isLast && currentPath) {
        path = currentPath.startsWith("/") ? currentPath : `/${currentPath}`;
      }
      const entry: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
      };
      if (path) entry.item = `${origin}${path}`;
      return entry;
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "hidden border-b border-brand-gold/20 bg-white/55 shadow-[0_1px_0_rgba(26,26,26,0.04)] backdrop-blur-md sm:block",
          className,
        )}
      >
        <div className={publicContentFrameClass}>
          <ol
            className={cn(
              "flex max-w-full flex-nowrap items-center gap-x-0.5 py-2.5 sm:gap-x-1 sm:py-3",
              "overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              const isHome = i === 0 && item.href === "/";

              return (
                <li
                  key={`${item.label}-${i}`}
                  className={cn(
                    "flex min-w-0 shrink-0 items-center gap-x-0.5 sm:gap-x-1",
                    isLast &&
                      "min-w-0 flex-1 sm:flex-none sm:max-w-[min(100%,42rem)]",
                  )}
                >
                  {i > 0 ? (
                    <ChevronRight
                      className="h-3.5 w-3.5 shrink-0 text-brand-gold/50 sm:h-4 sm:w-4"
                      aria-hidden
                    />
                  ) : null}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      aria-label={isHome ? item.label : undefined}
                      className={cn(
                        linkClass,
                        "inline-flex max-w-full items-center gap-1 text-xs font-medium sm:text-sm",
                        isHome && "pl-1 pr-2 sm:pl-1.5",
                      )}
                    >
                      {isHome ? (
                        <>
                          <Home
                            className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                            aria-hidden
                          />
                          <span className="hidden sm:inline">{item.label}</span>
                        </>
                      ) : (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        "block truncate px-1.5 py-1 text-xs font-semibold text-brand-charcoal sm:text-sm",
                        isLast && "text-left",
                      )}
                      aria-current={isLast ? "page" : undefined}
                      title={item.label}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
