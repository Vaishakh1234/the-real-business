"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Home,
  Building2,
  Info,
  Briefcase,
  Grid3x3,
  Phone,
  ChevronDown,
  ChevronRight,
  MapPin,
  HousePlus,
  LayoutGrid,
  ListOrdered,
  Sparkles,
  Layers,
  LandPlot,
  Warehouse,
  FileText,
  Shield,
  ArrowUpRight,
  Search,
  Heart,
  Loader2,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { PropertySearchSuggestionLink } from "@/components/properties/PropertySearchSuggestionLink";
import { PublicInstallAppControl } from "@/components/landing/PublicInstallAppControl";
import { cn } from "@/lib/utils";
import {
  POST_PROPERTY_HREF,
  PUBLIC_SEARCH_TYPEWRITER_HINTS,
  SITE_NAME,
} from "@/lib/constants/site";
import {
  publicContentFrameClass,
  PUBLIC_ROUTES_WITH_TOP_HERO,
} from "@/lib/constants/publicLayout";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchTypewriter } from "@/hooks/useSearchTypewriter";
import { useWishlist } from "@/hooks/useWishlist";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { PropertyWithRelations } from "@/types";

const BOTTOM_NAV_HEIGHT = "4rem";

/** Header bar height — keep in sync with `PublicMain` top padding (non-home routes) */
const HEADER_CLASS = "h-16 md:h-20";

/**
 * Equal-width desktop header triggers (Buy in Palakkad + mega-menus).
 * Used only at `xl+` where the full bar fits; tablet uses the sheet menu instead.
 */
const NAV_TRIGGER_CELL =
  "flex h-10 items-center justify-center gap-0.5 rounded-lg px-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 2xl:h-11 2xl:px-3.5 2xl:text-[15px]";

type NavMenuItem = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Optional square thumbnail in the mega menu (e.g. `/images/home-modal/...`) */
  thumbSrc?: string;
};

type NavMenuPromo = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

type NavMenu = {
  id: string;
  label: string;
  icon: LucideIcon;
  sectionLabel: string;
  items: NavMenuItem[];
  promo: NavMenuPromo;
};

const navMenus: NavMenu[] = [
  {
    id: "buyers",
    label: "For Buyers",
    icon: Home,
    sectionLabel: "Explore homes",
    promo: {
      imageSrc: "/images/home-modal/home-modal-3.png",
      imageAlt: "Residential homes in Kerala",
      title: "Find your next home",
      description:
        "Browse sale and rental listings across Palakkad with a brokerage you can talk to in person.",
      href: "/properties",
      ctaLabel: "View listings",
    },
    items: [
      {
        title: "All properties",
        description: "See every active listing",
        href: "/properties",
        icon: LayoutGrid,
      },
      {
        title: "Saved listings",
        description: "Properties you saved on this device",
        href: "/wishlist",
        icon: Heart,
      },
      {
        title: "Plots and Lands",
        description: "Land parcels and plot listings",
        href: "/properties?structure_type=plot",
        icon: LandPlot,
        thumbSrc: "/images/home-modal/home-modal-3.png",
      },
      {
        title: "Areas in Palakkad",
        description: "Town-by-town listing hubs",
        href: "/areas",
        icon: MapPin,
      },
      {
        title: "How it works",
        description: "Steps from search to keys",
        href: "/how-it-works",
        icon: ListOrdered,
      },
    ],
  },
  {
    id: "sellers",
    label: "For Sellers",
    icon: HousePlus,
    sectionLabel: "Partner with us",
    promo: {
      imageSrc: "/images/home-modal/home-modal-5.png",
      imageAlt: "Consulting with a property owner",
      title: "List with confidence",
      description:
        "We meet owners before we market — so buyers see serious, well-prepared listings.",
      href: POST_PROPERTY_HREF,
      ctaLabel: "Post property",
    },
    items: [
      {
        title: "List your property",
        description: "Reach serious buyers and tenants",
        href: POST_PROPERTY_HREF,
        icon: HousePlus,
      },
      {
        title: "Broker & owner services",
        description: "Marketing, paperwork, support",
        href: "/services",
        icon: Briefcase,
      },
      {
        title: "Why The Real Business",
        description: "Trust, reach, and results",
        href: "/about",
        icon: Sparkles,
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: Briefcase,
    sectionLabel: "What we offer",
    promo: {
      imageSrc: "/images/home-modal/home-modal-6.png",
      imageAlt: "Real estate advisory session",
      title: "Support at every step",
      description:
        "Buying, selling, leasing, valuations, and ongoing care — tailored to Palakkad.",
      href: "/services",
      ctaLabel: "Explore services",
    },
    items: [
      {
        title: "End-to-end services",
        description: "Buying, selling, and leasing help",
        href: "/services",
        icon: Layers,
      },
      {
        title: "Property management",
        description: "Ongoing care for landlords",
        href: "/contact",
        icon: Warehouse,
      },
      {
        title: "Contact us",
        description: "Message, call, or visit — we’re here to help",
        href: "/contact",
        icon: Phone,
      },
    ],
  },
  {
    id: "guides",
    label: "Guides & Legal",
    icon: FileText,
    sectionLabel: "Learn more",
    promo: {
      imageSrc: "/images/home-modal/home-modal-2.png",
      imageAlt: "Team collaboration",
      title: "Transparency & trust",
      description:
        "Our story, the people behind the brand, and clear policies for using this site.",
      href: "/about",
      ctaLabel: "About us",
    },
    items: [
      {
        title: "Areas we serve",
        description: "Palakkad localities & listings",
        href: "/areas",
        icon: MapPin,
      },
      {
        title: "Guides & insights",
        description: "Buying, NRI, documents, registration",
        href: "/guides",
        icon: FileText,
      },
      {
        title: "About us",
        description: "Our story and standards",
        href: "/about",
        icon: Info,
      },
      {
        title: "Terms of service",
        description: "Using this website",
        href: "/terms",
        icon: FileText,
      },
      {
        title: "Privacy policy",
        description: "How we handle data",
        href: "/privacy",
        icon: Shield,
      },
    ],
  },
];

const mobileNavLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "About", href: "/about", icon: Info },
  { label: "Services", href: "/services", icon: Grid3x3 },
  { label: "Contact", href: "/contact", icon: Phone },
];

function isNavItemActive(
  href: string,
  pathname: string,
  searchParams: URLSearchParams,
): boolean {
  let url: URL;
  try {
    url = new URL(href, "http://localhost");
  } catch {
    return false;
  }
  if (pathname !== url.pathname) return false;
  for (const key of url.searchParams.keys()) {
    if (searchParams.get(key) !== url.searchParams.get(key)) return false;
  }
  return true;
}

function menuIsActive(
  menu: NavMenu,
  pathname: string,
  searchParams: URLSearchParams,
): boolean {
  return menu.items.some((item) =>
    isNavItemActive(item.href, pathname, searchParams),
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [tabletNavOpen, setTabletNavOpen] = useState(false);
  /** Transparent over hero until scroll; solid white after threshold (home + pages with `#page-hero`) */
  const routesWithTopHero = PUBLIC_ROUTES_WITH_TOP_HERO.has(pathname);
  const [headerSolid, setHeaderSolid] = useState(
    () => pathname !== "/" && !routesWithTopHero,
  );
  const [headerOverlaysHero, setHeaderOverlaysHero] = useState(
    () => pathname === "/" || routesWithTopHero,
  );
  const [headerSearch, setHeaderSearch] = useState("");
  const [headerSearchFocused, setHeaderSearchFocused] = useState(false);
  const [headerSuggestions, setHeaderSuggestions] = useState<
    PropertyWithRelations[]
  >([]);
  const [headerSuggestTotal, setHeaderSuggestTotal] = useState(0);
  const [headerSuggestLoading, setHeaderSuggestLoading] = useState(false);
  const [headerSuggestOpen, setHeaderSuggestOpen] = useState(false);
  const headerSuggestContainerRef = useRef<HTMLDivElement>(null);
  const debouncedHeaderSearch = useDebounce(headerSearch, 300);
  const [headerTypewriterHint, setHeaderTypewriterHint] = useState(0);
  const [headerTypewriterLen, setHeaderTypewriterLen] = useState(0);
  const headerSearchIdlePrev = useRef(false);
  const navMenusId = useId();
  const { count: wishlistCount } = useWishlist();

  const isHome = pathname === "/";

  const closeMenus = useCallback(() => setOpenMenuId(null), []);

  useEffect(() => {
    setTabletNavOpen(false);
  }, [pathname]);

  const submitHeaderSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const q = headerSearch.trim();
      const p = new URLSearchParams();
      if (q) p.set("search", q);
      router.push(q ? `/properties?${p.toString()}` : "/properties");
    },
    [headerSearch, router],
  );

  const headerResultsHref = useMemo(() => {
    const q = headerSearch.trim();
    if (!q) return "/properties";
    return `/properties?${new URLSearchParams({ search: q }).toString()}`;
  }, [headerSearch]);

  useEffect(() => {
    if (!isHome || !headerSolid) {
      setHeaderSuggestions([]);
      setHeaderSuggestTotal(0);
      setHeaderSuggestLoading(false);
      return;
    }

    const q = debouncedHeaderSearch.trim();
    if (q.length < 2) {
      setHeaderSuggestions([]);
      setHeaderSuggestTotal(0);
      setHeaderSuggestLoading(false);
      return;
    }

    const ac = new AbortController();
    setHeaderSuggestLoading(true);
    const params = new URLSearchParams({ search: q });

    fetch(`/api/properties/suggest?${params.toString()}`, {
      signal: ac.signal,
      credentials: "include",
    })
      .then(async (res) => {
        if (ac.signal.aborted) return;
        const json = (await res.json()) as {
          data?: PropertyWithRelations[];
          total?: number;
        };
        if (!res.ok) {
          setHeaderSuggestions([]);
          setHeaderSuggestTotal(0);
          return;
        }
        if (ac.signal.aborted) return;
        setHeaderSuggestions(json.data ?? []);
        setHeaderSuggestTotal(json.total ?? 0);
      })
      .catch(() => {
        if (!ac.signal.aborted) {
          setHeaderSuggestions([]);
          setHeaderSuggestTotal(0);
        }
      })
      .finally(() => {
        if (!ac.signal.aborted) setHeaderSuggestLoading(false);
      });

    return () => ac.abort();
  }, [debouncedHeaderSearch, isHome, headerSolid]);

  useEffect(() => {
    if (debouncedHeaderSearch.trim().length < 2) setHeaderSuggestOpen(false);
  }, [debouncedHeaderSearch]);

  useEffect(() => {
    if (!headerSolid) setHeaderSuggestOpen(false);
  }, [headerSolid]);

  useEffect(() => {
    if (!headerSuggestOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = headerSuggestContainerRef.current;
      if (el && !el.contains(e.target as Node)) setHeaderSuggestOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [headerSuggestOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (headerSuggestOpen) {
          setHeaderSuggestOpen(false);
          return;
        }
        closeMenus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenus, headerSuggestOpen]);

  const headerSearchIdle =
    !headerSearch.trim() && !headerSearchFocused && isHome && headerSolid;

  const headerTypewriterText = useSearchTypewriter(
    headerSearchIdle,
    PUBLIC_SEARCH_TYPEWRITER_HINTS,
  );

  useEffect(() => {
    const update = () => {
      if (pathname === "/") {
        const hero = document.getElementById("home-hero");
        const heroHeight =
          hero?.offsetHeight ?? Math.min(window.innerHeight * 0.78, 620);
        const threshold = heroHeight * 0.5;
        setHeaderSolid(window.scrollY > threshold);
        setHeaderOverlaysHero(true);
        return;
      }

      const pageHero = document.getElementById("page-hero");
      if (pageHero && PUBLIC_ROUTES_WITH_TOP_HERO.has(pathname)) {
        const threshold = pageHero.offsetHeight * 0.45;
        setHeaderSolid(window.scrollY > threshold);
        setHeaderOverlaysHero(true);
        return;
      }

      if (PUBLIC_ROUTES_WITH_TOP_HERO.has(pathname)) {
        const fallbackH = 420;
        const threshold = fallbackH * 0.45;
        setHeaderSolid(window.scrollY > threshold);
        setHeaderOverlaysHero(true);
        return;
      }

      setHeaderSolid(true);
      setHeaderOverlaysHero(false);
    };

    update();
    const postLayout = window.setTimeout(update, 0);
    const postPaint = PUBLIC_ROUTES_WITH_TOP_HERO.has(pathname)
      ? window.setTimeout(update, 50)
      : undefined;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    const homeHero =
      pathname === "/" ? document.getElementById("home-hero") : null;
    const roHome =
      homeHero &&
      new ResizeObserver(() => {
        update();
      });
    if (homeHero && roHome) roHome.observe(homeHero);

    let pageHeroEl =
      pathname !== "/" ? document.getElementById("page-hero") : null;
    let roPage: ResizeObserver | null =
      pageHeroEl &&
      new ResizeObserver(() => {
        update();
      });
    if (pageHeroEl && roPage) roPage.observe(pageHeroEl);

    const attachPageHeroRo = () => {
      const el = document.getElementById("page-hero");
      if (!el || roPage) return;
      roPage = new ResizeObserver(() => {
        update();
      });
      roPage.observe(el);
    };
    if (PUBLIC_ROUTES_WITH_TOP_HERO.has(pathname) && !pageHeroEl) {
      window.setTimeout(attachPageHeroRo, 0);
    }

    return () => {
      window.clearTimeout(postLayout);
      if (postPaint !== undefined) window.clearTimeout(postPaint);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      roHome?.disconnect();
      roPage?.disconnect();
    };
  }, [pathname]);

  const overlayNav = headerOverlaysHero && !headerSolid;
  const showHeaderSuggestPanel =
    headerSuggestOpen && debouncedHeaderSearch.trim().length >= 2;
  /** Mobile: hide bottom nav on `/properties/{slug}` only; keep it on the listing. */
  const isPropertyDetailPage = /^\/properties\/[^/]+/.test(pathname);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 overflow-x-clip pt-[env(safe-area-inset-top)]",
          "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
          headerSolid
            ? "border-b border-border/60 bg-white shadow-[0_1px_0_rgba(0,0,0,0.05)]"
            : "border-b border-transparent bg-transparent shadow-none",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            publicContentFrameClass,
            "flex w-full min-w-0 items-center gap-3 md:gap-4 lg:gap-5",
            HEADER_CLASS,
          )}
        >
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              className={cn(
                "font-site-wordmark text-[28px] xl  :text-4xl font-semibold leading-tight tracking-tight  sm:whitespace-nowrap",
                overlayNav ? "text-white drop-shadow-sm" : "text-brand-gold",
              )}
            >
              {SITE_NAME}
            </Link>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-center px-0 sm:px-1">
            {isHome && headerSolid ? (
              <form
                onSubmit={submitHeaderSearch}
                className="hidden w-full max-w-3xl min-w-0 md:flex 2xl:max-w-4xl"
                role="search"
                aria-label="Search properties"
              >
                <div
                  ref={headerSuggestContainerRef}
                  className="relative w-full min-w-0"
                >
                  <div className="flex h-11 w-full min-w-0 items-stretch overflow-hidden rounded-lg border border-border/60 bg-white shadow-sm ring-1 ring-black/[0.04] transition-[border-color,box-shadow,ring-width,ring-color] focus-within:border-brand-gold/55 focus-within:shadow-md focus-within:ring-2 focus-within:ring-brand-gold/25 focus-within:ring-offset-0 md:h-12 md:rounded-xl">
                    <div className="flex min-h-0 min-w-0 flex-1 items-center gap-2 py-1.5 pl-3 pr-2 md:gap-2.5 md:pl-4 md:pr-3 md:py-0">
                      <Search
                        className="h-4 w-4 shrink-0 text-brand-gold"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <div className="relative min-h-0 min-w-0 flex-1 self-stretch">
                        <input
                          type="search"
                          name="q"
                          value={headerSearch}
                          onChange={(e) => {
                            const v = e.target.value;
                            setHeaderSearch(v);
                            if (v.trim().length >= 2)
                              setHeaderSuggestOpen(true);
                          }}
                          onFocus={() => {
                            setHeaderSearchFocused(true);
                            if (headerSearch.trim().length >= 2) {
                              setHeaderSuggestOpen(true);
                            }
                          }}
                          onBlur={() => {
                            setHeaderSearchFocused(false);
                            requestAnimationFrame(() => {
                              const root = headerSuggestContainerRef.current;
                              if (
                                root &&
                                document.activeElement &&
                                root.contains(document.activeElement)
                              ) {
                                return;
                              }
                              setHeaderSuggestOpen(false);
                            });
                          }}
                          placeholder={
                            headerSearchFocused
                              ? "Area, project, or keyword"
                              : undefined
                          }
                          className="relative z-10 h-full min-h-0 w-full min-w-0 border-0 bg-transparent py-0 pr-1 text-sm leading-normal text-brand-charcoal outline-none placeholder:text-muted-foreground md:text-[15px]"
                          autoComplete="off"
                          aria-label="Search location or keyword"
                          aria-expanded={showHeaderSuggestPanel}
                          aria-controls="header-suggest-list"
                          aria-autocomplete="list"
                        />
                        {headerSearchIdle ? (
                          <span
                            role="status"
                            aria-live="polite"
                            className="pointer-events-none absolute left-0 top-1/2 z-0 max-w-[calc(100%-0.5rem)] -translate-y-1/2 truncate text-left text-sm text-muted-foreground md:max-w-[calc(100%-0.75rem)] md:text-[15px]"
                          >
                            {headerTypewriterText}
                            <span
                              className="ml-px inline-block h-[1em] w-px translate-y-px animate-pulse bg-muted-foreground/70 align-middle"
                              aria-hidden
                            />
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="shrink-0 bg-brand-gold px-4 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-gold/90 focus:outline-none focus-visible:relative focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold md:px-5 md:text-xs"
                    >
                      Search
                    </button>
                  </div>

                  {showHeaderSuggestPanel ? (
                    <div
                      id="header-suggest-list"
                      role="listbox"
                      aria-label="Matching listings"
                      className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-[60] max-h-[min(20rem,50vh)] overflow-y-auto rounded-lg border border-border/80 bg-white py-1 shadow-lg md:rounded-xl"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {headerSuggestLoading ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                          <Loader2
                            className="h-4 w-4 shrink-0 animate-spin"
                            aria-hidden
                          />
                          Searching…
                        </div>
                      ) : headerSuggestions.length === 0 ? (
                        <p className="px-4 py-4 text-sm text-muted-foreground">
                          No listings match that search yet. Try a different
                          keyword or use Search to browse all results.
                        </p>
                      ) : (
                        <ul className="min-w-0 divide-y divide-border/60">
                          {headerSuggestions.map((p) => (
                            <li key={p.id} role="presentation">
                              <PropertySearchSuggestionLink
                                property={p}
                                href={`/properties/${encodeURIComponent(p.slug)}`}
                                variant="header"
                                onSelect={() => setHeaderSuggestOpen(false)}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                      {!headerSuggestLoading &&
                      headerSuggestions.length > 0 &&
                      headerSuggestTotal > 5 ? (
                        <p className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">
                          Showing top 5 of {headerSuggestTotal} matching
                          listings.
                        </p>
                      ) : null}
                      {!headerSuggestLoading && headerSuggestions.length > 0 ? (
                        <div className="border-t border-border/60 px-2 py-1.5">
                          <Link
                            href={headerResultsHref}
                            onClick={() => setHeaderSuggestOpen(false)}
                            className="inline-flex w-full items-center justify-center gap-1 rounded-md px-2 py-2 text-center text-sm font-semibold text-brand-gold hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                          >
                            View all results
                            <ChevronRight
                              className="h-4 w-4 shrink-0 opacity-90"
                              strokeWidth={2}
                              aria-hidden
                            />
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </form>
            ) : (
              <div
                className="hidden min-w-0 flex-1 items-center justify-center gap-3 2xl:flex 2xl:gap-5"
                onMouseLeave={closeMenus}
              >
                <details className="group relative">
                  <summary
                    className={cn(
                      NAV_TRIGGER_CELL,
                      "px-2.5 2xl:px-3",
                      "cursor-pointer list-none whitespace-nowrap [&::-webkit-details-marker]:hidden",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
                      overlayNav
                        ? "text-white hover:bg-white/10 focus-visible:ring-offset-0"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-brand-charcoal focus-visible:ring-offset-2",
                    )}
                  >
                    <MapPin
                      className={cn(
                        "h-4 w-4 shrink-0",
                        overlayNav ? "text-white" : "text-brand-gold",
                      )}
                      aria-hidden
                    />
                    <span className="text-center whitespace-nowrap">
                      Buy in{" "}
                      <span
                        className={cn(
                          "font-semibold",
                          overlayNav ? "text-white" : "text-brand-charcoal",
                        )}
                      >
                        Palakkad
                      </span>
                    </span>
                    <ChevronDown
                      strokeWidth={2}
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 opacity-70 group-open:rotate-180",
                        overlayNav ? "text-white" : "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                  </summary>
                  <div className="absolute left-1/2 top-full z-50 mt-2 w-60 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-border/80 bg-white p-3 text-xs leading-relaxed text-muted-foreground shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                    Listings and visits are focused on{" "}
                    <span className="font-medium text-brand-charcoal">
                      Palakkad district, Kerala
                    </span>
                    .
                  </div>
                </details>

                {navMenus.map((menu) => {
                  const isOpen = openMenuId === menu.id;
                  const isActive = menuIsActive(menu, pathname, searchParams);
                  const menuId = `${navMenusId}-${menu.id}`;

                  return (
                    <div
                      key={menu.id}
                      className="relative"
                      onMouseEnter={() => setOpenMenuId(menu.id)}
                    >
                      <button
                        type="button"
                        className={cn(
                          NAV_TRIGGER_CELL,
                          "gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
                          overlayNav
                            ? "focus-visible:ring-offset-0"
                            : "focus-visible:ring-offset-2",
                          overlayNav
                            ? isActive || isOpen
                              ? "text-white"
                              : "text-white hover:bg-white/10"
                            : isActive || isOpen
                              ? "text-brand-charcoal"
                              : "text-muted-foreground hover:bg-muted/70 hover:text-brand-charcoal",
                        )}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        aria-controls={menuId}
                      >
                        <span className="truncate">{menu.label}</span>
                        <ChevronDown
                          strokeWidth={2}
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-200",
                            isOpen && "rotate-180",
                            overlayNav && "text-white",
                          )}
                          aria-hidden
                        />
                      </button>

                      <div
                        id={menuId}
                        role="region"
                        aria-label={menu.label}
                        className={cn(
                          "absolute left-1/2 top-full z-50 w-[min(calc(100vw-1.25rem),38rem)] max-w-[calc(100vw-1.25rem)] -translate-x-1/2 pt-3 transition-opacity duration-150",
                          isOpen
                            ? "visible opacity-100"
                            : "invisible pointer-events-none opacity-0",
                        )}
                      >
                        <div className="overflow-hidden rounded-lg border border-border/60 bg-[#ffffff] font-sans shadow-[0_20px_50px_rgba(15,23,42,0.1)] sm:rounded-xl">
                          <div className="flex flex-col lg:flex-row lg:items-stretch">
                            <div className="min-w-0 flex-1 p-5 sm:p-6">
                              <p className="mb-3 text-[13px] font-bold uppercase leading-tight tracking-[0.16em] text-black">
                                {menu.sectionLabel}
                              </p>
                              <ul className="list-outside list-disc space-y-1 pl-5 marker:text-brand-charcoal/40">
                                {menu.items.map((item) => {
                                  const itemActive = isNavItemActive(
                                    item.href,
                                    pathname,
                                    searchParams,
                                  );
                                  return (
                                    <li key={`${menu.id}:${item.title}`}>
                                      <Link
                                        href={item.href}
                                        className={cn(
                                          "block rounded-md py-2 pr-2 pl-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 focus-visible:ring-offset-2",
                                          itemActive
                                            ? "bg-muted/90"
                                            : "hover:bg-muted/60",
                                        )}
                                        onFocus={() => setOpenMenuId(menu.id)}
                                      >
                                        <span className="block text-[16px] font-medium leading-snug tracking-tight text-black">
                                          {item.title}
                                        </span>
                                        <span className="mt-0.5 block text-[14px] font-normal leading-relaxed text-muted-foreground">
                                          {item.description}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            <div className="relative border-t border-border/50 bg-[#faf7f0] p-6 sm:p-7 lg:w-[min(100%,15.5rem)] lg:shrink-0 lg:border-l lg:border-t-0 lg:px-8 lg:py-8 xl:w-[17rem] xl:px-9 xl:py-9">
                              <Link
                                href={menu.promo.href}
                                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 focus-visible:ring-offset-2"
                                onClick={() => setOpenMenuId(null)}
                              >
                                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted/80 ring-1 ring-black/[0.04]">
                                  <Image
                                    src={menu.promo.imageSrc}
                                    alt={menu.promo.imageAlt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 272px"
                                  />
                                </div>
                                <p className="mt-4 text-[17px] font-semibold leading-snug tracking-tight text-black">
                                  {menu.promo.title}
                                </p>
                                <p className="mt-2 text-[14px] font-normal leading-relaxed text-muted-foreground">
                                  {menu.promo.description}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-[16px] font-medium text-black transition-colors group-hover:text-black/70">
                                  {menu.promo.ctaLabel}
                                  <ArrowUpRight
                                    className="h-3.5 w-3.5 shrink-0"
                                    strokeWidth={1.75}
                                    aria-hidden
                                  />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2.5 sm:gap-3 md:gap-3.5">
            <Link
              href="/wishlist"
              prefetch={true}
              className={cn(
                "relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border text-[#1a2b4b] transition-[background-color,box-shadow,transform] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-[0.98]",
                overlayNav
                  ? "border-white/35 bg-white/15 text-white shadow-sm hover:bg-white/22 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
                  : "border-neutral-200 bg-neutral-100 shadow-sm hover:bg-neutral-200/90 focus-visible:ring-offset-2",
              )}
              aria-label={
                wishlistCount > 0
                  ? `Saved listings (${wishlistCount})`
                  : "Saved listings"
              }
            >
              <Heart
                className="h-5 w-5"
                strokeWidth={2}
                fill={wishlistCount > 0 ? "currentColor" : "none"}
                aria-hidden
              />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              ) : null}
            </Link>
            <PublicInstallAppControl overlayNav={overlayNav} />
            <Link
              href={POST_PROPERTY_HREF}
              className={cn(
                "hidden min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-semibold tracking-tight transition-[background-color,box-shadow,transform] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-[0.98] md:inline-flex md:py-2.5 2xl:px-8",
                overlayNav
                  ? "bg-white text-brand-charcoal shadow-[0_2px_20px_rgba(0,0,0,0.18)] hover:bg-white hover:shadow-[0_6px_28px_rgba(0,0,0,0.22)] focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
                  : "bg-brand-charcoal text-white shadow-[0_2px_12px_rgba(0,0,0,0.1)] hover:bg-brand-charcoal/92 hover:shadow-[0_4px_20px_rgba(0,0,0,0.14)] focus-visible:ring-offset-2",
              )}
            >
              Post property
              <HousePlus
                className="h-4 w-4 shrink-0 opacity-90"
                strokeWidth={2}
                aria-hidden
              />
            </Link>
            <Sheet open={tabletNavOpen} onOpenChange={setTabletNavOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold md:inline-flex 2xl:hidden",
                    overlayNav
                      ? "border-white/35 bg-white/10 text-white hover:bg-white/18 focus-visible:ring-offset-0"
                      : "border-neutral-200 bg-white text-brand-charcoal hover:bg-neutral-50 focus-visible:ring-offset-2",
                  )}
                  aria-label="Open site menu"
                  aria-expanded={tabletNavOpen}
                >
                  <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="z-[100] flex w-full flex-col gap-0 p-0 sm:max-w-md"
              >
                <SheetHeader className="border-b border-border/70 px-5 py-4 text-left">
                  <SheetTitle className="font-heading text-brand-charcoal">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Focus area
                  </p>
                  <div className="mb-5 rounded-lg border border-border/70 bg-muted/35 p-3 text-sm leading-relaxed text-muted-foreground">
                    Listings and visits are focused on{" "}
                    <span className="font-medium text-brand-charcoal">
                      Palakkad district, Kerala
                    </span>
                    .
                  </div>
                  <nav className="space-y-2 pb-6" aria-label="Site sections">
                    {navMenus.map((menu) => {
                      const MenuIcon = menu.icon;
                      return (
                        <details
                          key={`sheet-${menu.id}`}
                          className="group rounded-xl border border-border/80 bg-white shadow-sm"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-3 text-[15px] font-semibold text-brand-charcoal [&::-webkit-details-marker]:hidden">
                            <span className="flex items-center gap-2.5">
                              <MenuIcon
                                className="h-[18px] w-[18px] shrink-0 text-brand-gold"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                              {menu.label}
                            </span>
                            <ChevronDown
                              strokeWidth={2}
                              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                              aria-hidden
                            />
                          </summary>
                          <div className="space-y-0.5 border-t border-border/60 px-2 py-2">
                            {menu.items.map((item) => {
                              const itemActive = isNavItemActive(
                                item.href,
                                pathname,
                                searchParams,
                              );
                              return (
                                <Link
                                  key={`${menu.id}:${item.title}`}
                                  href={item.href}
                                  onClick={() => setTabletNavOpen(false)}
                                  className={cn(
                                    "flex items-start gap-2.5 rounded-lg px-2 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50",
                                    itemActive
                                      ? "bg-muted/90"
                                      : "hover:bg-muted/50",
                                  )}
                                >
                                  <item.icon
                                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                    strokeWidth={1.75}
                                    aria-hidden
                                  />
                                  <div className="min-w-0 flex-1">
                                    <span className="block text-[15px] font-medium text-brand-charcoal">
                                      {item.title}
                                    </span>
                                    <span className="mt-0.5 block text-[13px] text-muted-foreground">
                                      {item.description}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                            <Link
                              href={menu.promo.href}
                              onClick={() => setTabletNavOpen(false)}
                              className="mt-2 flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-brand-gold hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                            >
                              {menu.promo.ctaLabel}
                              <ArrowUpRight
                                className="h-3.5 w-3.5 shrink-0"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </Link>
                          </div>
                        </details>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <nav
        aria-label="Main navigation"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-white shadow-[0_-1px_6px_rgba(0,0,0,0.06)] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] [touch-action:manipulation] md:hidden",
          isPropertyDetailPage && "hidden",
        )}
        style={{ minHeight: BOTTOM_NAV_HEIGHT }}
      >
        {mobileNavLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          const isContact = link.href === "/contact";
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={cn(
                "flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-inset sm:text-xs",
                isContact && isActive && "text-brand-gold",
                isContact &&
                  !isActive &&
                  "text-muted-foreground active:text-brand-gold",
                !isContact && isActive && "text-brand-charcoal",
                !isContact &&
                  !isActive &&
                  "text-muted-foreground active:text-brand-charcoal",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="relative flex flex-col items-center gap-0.5">
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full p-1.5 transition-colors",
                    isContact && isActive && "bg-brand-gold/15 text-brand-gold",
                    isContact && !isActive && "text-muted-foreground",
                    !isContact && isActive && "text-brand-gold",
                    !isContact && !isActive && "text-muted-foreground",
                  )}
                >
                  <Icon
                    className="h-5 w-5 shrink-0 sm:h-5 sm:w-5"
                    strokeWidth={isActive ? 2.25 : 1.75}
                    aria-hidden
                  />
                </span>
                {isActive && !isContact && (
                  <span
                    className="h-0.5 w-4 rounded-full bg-brand-gold"
                    aria-hidden
                  />
                )}
              </span>
              <span className="max-w-[4rem] truncate leading-tight sm:max-w-[4.5rem]">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
