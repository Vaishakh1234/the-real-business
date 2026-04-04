/**
 * Single content frame for the public site: navbar, hero inner, portal sections, footer, and major pages.
 * Keeps max width and horizontal gutters aligned (1680px cap; responsive padding).
 */
export const PUBLIC_CONTENT_MAX_WIDTH_PX = 1680 as const;

export const publicContentFrameClass =
  "mx-auto w-full max-w-[1680px] px-4 xs:px-5 sm:px-6 lg:px-16 xl:px-24";

/**
 * Public routes whose first section is a full-bleed **dark** hero under the fixed navbar
 * (transparent header + light text until scroll). Each such page should render `#page-hero`
 * for scroll thresholds. Home (`/`) is handled separately in the Navbar.
 *
 * Light hero pages (e.g. `/services`) must NOT be listed here — use default solid header.
 */
export const PUBLIC_ROUTES_WITH_TOP_HERO = new Set<string>([]);
