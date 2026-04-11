import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/constants/site";

const THEME = "#1a1a1a";
const BG = "#ffffff";

const ICON_192 = {
  src: "/icons/icon-192.png",
  sizes: "192x192",
  type: "image/png",
} as const;

/** PWA launch URL when the manifest is served with an admin session (install from admin / logged-in fetch). */
export const PWA_ADMIN_START_URL = "/admin/dashboard?source=pwa" as const;

/** Shown in the installed app launcher for signed-in admins only (not for public installs). */
const ADMIN_SHORTCUTS: MetadataRoute.Manifest["shortcuts"] = [
  {
    name: "Admin dashboard",
    short_name: "Admin",
    description: "Open the admin dashboard",
    url: PWA_ADMIN_START_URL,
    icons: [{ ...ICON_192 }],
  },
  {
    name: "Admin settings",
    short_name: "Settings",
    description: "Account and lead alert preferences",
    url: "/admin/settings?source=pwa",
    icons: [{ ...ICON_192 }],
  },
  {
    name: "Leads",
    short_name: "Leads",
    description: "View incoming leads",
    url: "/admin/leads?source=pwa",
    icons: [{ ...ICON_192 }],
  },
];

/**
 * Web app manifest. When `includeAdminShortcuts` is false (anonymous visitor),
 * `start_url` is the public home; when true (admin session), launching the installed PWA opens admin first.
 * Admin routes are not advertised as shortcuts for anonymous visitors; access is still enforced by proxy.
 */
export function buildWebAppManifest(
  includeAdminShortcuts: boolean,
): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Real Estate & Property Consultancy`,
    short_name: SITE_NAME,
    description:
      "Real estate marketing, property consultancy, and buying & selling support in Palakkad, Kerala.",
    start_url: includeAdminShortcuts ? PWA_ADMIN_START_URL : "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: BG,
    theme_color: THEME,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    ...(includeAdminShortcuts ? { shortcuts: ADMIN_SHORTCUTS } : {}),
  };
}
