/**
 * Canonical site URL for metadata, sitemap, robots, and JSON-LD.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://www.example.com).
 */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (raw) return raw;
  return "http://localhost:4000";
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`);
}

export function absoluteUrl(path: string): string {
  const origin = getSiteOrigin();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}
