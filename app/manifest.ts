import type { MetadataRoute } from "next";

const THEME = "#1a1a1a";
const BG = "#ffffff";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Real Business — Real Estate & Property Consultancy",
    short_name: "The Real Business",
    description:
      "Real estate marketing, property consultancy, and buying & selling support in Palakkad, Kerala.",
    start_url: "/?source=pwa",
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
    shortcuts: [
      {
        name: "Admin dashboard",
        short_name: "Admin",
        description: "Open the admin dashboard",
        url: "/admin/dashboard?source=pwa",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Lead alerts",
        short_name: "Alerts",
        description: "Set up push notifications for new leads",
        url: "/admin/notifications?source=pwa",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Leads",
        short_name: "Leads",
        description: "View incoming leads",
        url: "/admin/leads?source=pwa",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
