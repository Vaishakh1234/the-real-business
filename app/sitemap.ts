import type { MetadataRoute } from "next";
import { SITEMAP_STATIC_PATHS } from "@/lib/constants/sitemap-paths";
import { getActivePropertySlugsForSitemap } from "@/lib/queries/properties";
import { getSiteOrigin } from "@/lib/seo/site";
import { SEO_AREA_SLUGS } from "@/lib/constants/areas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = SITEMAP_STATIC_PATHS.map(
    (path) => ({
      url: path === "/" ? origin : `${origin}${path}`,
      lastModified: now,
      changeFrequency:
        path === "/" || path === "/properties" ? "daily" : "weekly",
      priority: path === "/" ? 1 : path === "/properties" ? 0.95 : 0.8,
    }),
  );

  const areaEntries: MetadataRoute.Sitemap = SEO_AREA_SLUGS.map((slug) => ({
    url: `${origin}/areas/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const propertyRows = await getActivePropertySlugsForSitemap();
  const propertyEntries: MetadataRoute.Sitemap = propertyRows.map((row) => ({
    url: `${origin}/properties/${encodeURIComponent(row.slug)}`,
    lastModified: new Date(row.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...areaEntries, ...propertyEntries];
}
