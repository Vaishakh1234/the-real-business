"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
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
  MapPin,
  HousePlus,
  LayoutGrid,
  ListOrdered,
  Sparkles,
  Layers,
  LandPlot,
  TrendingUp,
  Warehouse,
  Users,
  FileText,
  Shield,
  ArrowUpRight,
  Search,
  Heart,
  type LucideIcon,
} from "lucide-react";
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
import { useSearchTypewriter } from "@/hooks/useSearchTypewriter";
import { useWishlist } from "@/hooks/useWishlist";

const BOTTOM_NAV_HEIGHT = "4rem";

/** Header bar height — keep in sync with `PublicMain` top padding (non-home routes) */
const HEADER_CLASS = "h-16 md:h-20";

/** Equal-width desktop header triggers (Buy in Palakkad + mega-menus) */
const NAV_TRIGGER_CELL =
  "flex h-10 w-[9.75rem] shrink-0 items-center justify-center gap-0.5 rounded-lg px-1.5 text-[15px] font-medium transition-colors duration-200 md:h-11 md:w-[10.25rem] md:text-base";

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
  sectionLabel: string;
  items: NavMenuItem[];
  promo: NavMenuPromo;
};

const navMenus: NavMenu[] = [
  {
    id: "buyers",
    label: "For Buyers",
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
        title: "Valuation & advisory",
        description: "Expert guidance for your asset",
        href: "/contact",
        icon: TrendingUp,
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
        title: "About us",
        description: "Our story and standards",
        href: "/about",
        icon: Info,
      },
      {
        title: "Our team",
        description: "People behind the brand",
        href: "/team",
        icon: Users,
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
  const [headerTypewriterHint, setHeaderTypewriterHint] = useState(0);
  const [headerTypewriterLen, setHeaderTypewriterLen] = useState(0);
  const headerSearchIdlePrev = useRef(false);
  const navMenusId = useId();
  const { count: wishlistCount } = useWishlist();

  const isHome = pathname === "/";

  const closeMenus = useCallback(() => setOpenMenuId(null), []);

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenus]);

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
      if (pageHero) {
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
  /** Mobile: hide bottom nav on `/properties/{slug}` only; keep it on the listing. */
  const isPropertyDetailPage = /^\/properties\/[^/]+/.test(pathname);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)]",
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
            "flex items-center justify-between",
            "md:grid md:items-center md:justify-normal",
            isHome && headerSolid
              ? "md:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] md:gap-3"
              : "md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
            HEADER_CLASS,
          )}
        >
          <div className="flex min-w-0 flex-1 items-center justify-start md:min-w-0 md:flex-none md:justify-self-start">
            <Link
              href="/"
              className={cn(
                "font-site-wordmark min-w-0 shrink-0 text-2xl font-semibold leading-tight tracking-tight xs:text-3xl sm:text-3xl sm:whitespace-nowrap md:text-4xl",
                overlayNav ? "text-white drop-shadow-sm" : "text-brand-gold",
              )}
            >
              {SITE_NAME}
            </Link>
          </div>

          {isHome && headerSolid ? (
            <form
              onSubmit={submitHeaderSearch}
              className="hidden min-w-0 w-full max-w-3xl justify-self-center lg:max-w-4xl md:flex"
              role="search"
              aria-label="Search properties"
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
                      onChange={(e) => setHeaderSearch(e.target.value)}
                      onFocus={() => setHeaderSearchFocused(true)}
                      onBlur={() => setHeaderSearchFocused(false)}
                      placeholder={
                        headerSearchFocused
                          ? "Area, project, or keyword"
                          : undefined
                      }
                      className="relative z-10 h-full min-h-0 w-full min-w-0 border-0 bg-transparent py-0 pr-1 text-sm leading-normal text-brand-charcoal outline-none placeholder:text-muted-foreground md:text-[15px]"
                      autoComplete="off"
                      aria-label="Search location or keyword"
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
            </form>
          ) : (
            <div
              className="hidden shrink-0 items-center gap-0 md:flex md:justify-self-center"
              onMouseLeave={closeMenus}
            >
              <details className="group relative hidden lg:block">
                <summary
                  className={cn(
                    NAV_TRIGGER_CELL,
                    "w-auto max-w-none px-2.5 md:w-auto md:px-3",
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

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none md:justify-self-end">
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
            <Link
              href={POST_PROPERTY_HREF}
              className={cn(
                "hidden min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 text-sm font-semibold tracking-tight transition-[background-color,box-shadow,transform] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-[0.98] md:inline-flex md:py-2.5 lg:px-8",
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
