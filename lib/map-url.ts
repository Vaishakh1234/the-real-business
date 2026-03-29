/**
 * Google Maps URLs: sanitize pasted input, validate, normalize for storage/iframe.
 * - Embed URLs (.../maps/embed?...) stay as-is (with optional output=embed on other /maps/* paths).
 * - Short links (maps.app.goo.gl, goo.gl, g.co) resolve on the server via redirect when possible.
 */

const EMBED_PATH = "/maps/embed";
/** Hosts that serve standard Maps web URLs we can rewrite for iframes. */
const VALID_EMBED_HOSTS = [
  "www.google.com",
  "google.com",
  "maps.google.com",
  "m.google.com",
];

function isEmbedPath(url: URL): boolean {
  return url.pathname.toLowerCase().includes(EMBED_PATH);
}

function isGoogleMapsHost(host: string): boolean {
  return VALID_EMBED_HOSTS.includes(host.toLowerCase());
}

function isShortMapHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === "maps.app.goo.gl" || h === "goo.gl" || h === "g.co";
}

/**
 * Strip invisible / format characters often pasted from Maps, WhatsApp, or IME.
 * Coerce http→https and add https:// when the host is clearly Google Maps.
 */
export function sanitizeGoogleMapsUrlInput(value: string): string {
  let s = String(value).trim();
  s = s.replace(/^[\uFEFF\u200B-\u200D\u2060\u00A0]+|[\uFEFF\u200B-\u200D\u2060\u00A0]+$/g, "");
  s = s.trim();
  s = s.replace(/^https：\/\//i, "https://");
  s = s.replace(/^http：\/\//i, "http://");

  if (
    /^http:\/\/(([\w-]+\.)?google\.com|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl|g\.co)(\/|$)/i.test(
      s,
    )
  ) {
    s = s.replace(/^http:\/\//i, "https://");
  }

  if (!/^https?:\/\//i.test(s)) {
    const looksLikeMaps =
      /^(maps\.app\.goo\.gl|goo\.gl|g\.co)(\/|$)/i.test(s) ||
      /^(www\.)?google\.com\/maps/i.test(s) ||
      /^maps\.google\.com(\/|$)/i.test(s) ||
      /^m\.google\.com\/maps/i.test(s);
    if (looksLikeMaps) s = `https://${s}`;
  }

  return s.trim();
}

/** True if empty, or a Google Maps embed/share URL we accept on listing forms. */
export function isValidMapUrl(value: string): boolean {
  try {
    const trimmed = sanitizeGoogleMapsUrlInput(value);
    if (!trimmed) return true;
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();

    if (isShortMapHost(host)) return true;
    if (host === "maps.google.com") return true;

    if (isGoogleMapsHost(host)) {
      if (path.includes("/maps/embed")) return true;
      if (path === "/maps" || path === "/maps/" || path.startsWith("/maps/")) return true;
      return false;
    }

    return false;
  } catch {
    return false;
  }
}

/** Lat,lng pair as text (used in `q`, `query`, sometimes `ll`). */
const Q_PARAM_LAT_LNG = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/;

function isValidLatLng(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function parseLatLngFromMapsQParam(q: string | null | undefined): { lat: number; lng: number } | null {
  const trimmed = q?.trim();
  if (!trimmed) return null;
  const m = trimmed.match(Q_PARAM_LAT_LNG);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  if (!isValidLatLng(lat, lng)) return null;
  return { lat, lng };
}

/**
 * Best-effort extraction of coordinates from a **resolved** Google Maps href (share link, place URL, etc.).
 * Share links almost always include `@lat,lng` in the path; many URLs also use `!3d` / `!4d` fragments.
 */
export function parseLatLngFromGoogleMapsUrlString(urlString: string): { lat: number; lng: number } | null {
  try {
    const url = new URL(sanitizeGoogleMapsUrlInput(urlString));
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (!isGoogleMapsHost(host) && host !== "maps.google.com") return null;

    const q = parseLatLngFromMapsQParam(url.searchParams.get("q"));
    if (q) return q;

    const queryParam = parseLatLngFromMapsQParam(url.searchParams.get("query"));
    if (queryParam) return queryParam;

    const ll = url.searchParams.get("ll");
    if (ll) {
      const fromLl = parseLatLngFromMapsQParam(ll);
      if (fromLl) return fromLl;
    }

    const center = url.searchParams.get("center");
    if (center) {
      const fromCenter = parseLatLngFromMapsQParam(center);
      if (fromCenter) return fromCenter;
    }

    let decodedHref = url.href;
    try {
      decodedHref = decodeURIComponent(url.href);
    } catch {
      // keep raw href if % sequences are invalid
    }
    const atMatch = decodedHref.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,|\/?|$|\?)/);
    if (atMatch) {
      const lat = Number(atMatch[1]);
      const lng = Number(atMatch[2]);
      if (isValidLatLng(lat, lng)) return { lat, lng };
    }

    const m3 = decodedHref.match(/!3d(-?\d+(?:\.\d+)?)/);
    const m4 = decodedHref.match(/!4d(-?\d+(?:\.\d+)?)/);
    if (m3 && m4) {
      const lat = Number(m3[1]);
      const lng = Number(m4[1]);
      if (isValidLatLng(lat, lng)) return { lat, lng };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * OpenStreetMap embed — allowed in iframes without an API key (unlike `maps?q=…&output=embed`).
 * @param delta half-width/height in degrees (~0.02 ≈ neighbourhood zoom)
 */
export function openStreetMapEmbedFromLatLng(
  lat: number,
  lng: number,
  delta: number = 0.02,
): string {
  const minLon = lng - delta;
  const maxLon = lng + delta;
  const minLat = lat - delta;
  const maxLat = lat + delta;
  const params = new URLSearchParams({
    bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
    layer: "mapnik",
    marker: `${lat},${lng}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

/**
 * Google "Share" and place URLs are not iframe-embeddable (X-Frame / Connect). If we can read coordinates,
 * use an OpenStreetMap embed so the Location map works without a Maps API key.
 */
function googleNonEmbedPageUrlToOsmIframeSrc(urlString: string): string | null {
  try {
    const url = new URL(sanitizeGoogleMapsUrlInput(urlString));
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (!isGoogleMapsHost(host) && host !== "maps.google.com") return null;
    if (isEmbedPath(url)) return null;
    const coords = parseLatLngFromGoogleMapsUrlString(url.toString());
    if (!coords) return null;
    return openStreetMapEmbedFromLatLng(coords.lat, coords.lng);
  } catch {
    return null;
  }
}

/**
 * Best-effort URL for <iframe src>: rewrite same-origin Maps links to an embed-friendly form.
 * Short links are returned unchanged (browser follows redirects).
 */
export function toIframeMapSrc(urlString: string | null | undefined): string | null {
  const raw = urlString?.trim();
  if (!raw) return null;
  const s = sanitizeGoogleMapsUrlInput(raw);
  const embedded = toEmbedUrlSync(s);
  const candidate = embedded ?? s;
  return googleNonEmbedPageUrlToOsmIframeSrc(candidate) ?? candidate;
}

/**
 * True when the iframe src would still hit Google share/place pages or unresolved short links
 * (blocked in iframes), so we should use lat/lng when available.
 */
function mapIframeSrcNeedsLatLngFallback(iframeSrc: string | null | undefined): boolean {
  if (!iframeSrc?.trim()) return true;
  try {
    const u = new URL(iframeSrc);
    const host = u.hostname.toLowerCase();
    if (host === "www.openstreetmap.org" || host === "openstreetmap.org") return false;
    if (isShortMapHost(host)) return true;
    const path = u.pathname.toLowerCase();
    if ((isGoogleMapsHost(host) || host === "maps.google.com") && !path.includes(EMBED_PATH)) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

/**
 * Resolves the map URL for a property: Google share / place links become OpenStreetMap embeds when
 * coordinates can be read from the URL; otherwise uses stored `latitude` & `longitude` as fallback.
 */
export function propertyMapIframeSrc(
  mapEmbedUrl: string | null | undefined,
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): string | null {
  const trimmed = mapEmbedUrl?.trim() ?? "";
  const lat = latitude;
  const lng = longitude;
  const coordsOk =
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    isValidLatLng(lat, lng);

  const fromUrl = trimmed ? toIframeMapSrc(trimmed) : null;
  if (coordsOk && mapIframeSrcNeedsLatLngFallback(fromUrl ?? (trimmed || null))) {
    return openStreetMapEmbedFromLatLng(lat!, lng!);
  }
  if (fromUrl) return fromUrl;
  if (trimmed) return trimmed;
  if (coordsOk) return openStreetMapEmbedFromLatLng(lat!, lng!);
  return null;
}

/**
 * Converts a Google Maps page URL to a form that usually loads in an iframe.
 */
export function toEmbedUrlSync(urlString: string): string | null {
  try {
    const trimmed = sanitizeGoogleMapsUrlInput(urlString);
    if (!trimmed) return null;
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();

    if (!isGoogleMapsHost(host)) return null;

    if (isEmbedPath(url)) return url.toString();

    if (url.pathname === "/maps" || url.pathname === "/maps/") {
      const embedUrl = new URL(url);
      embedUrl.pathname = EMBED_PATH;
      return embedUrl.toString();
    }

    if (url.pathname.toLowerCase().startsWith("/maps/")) {
      const out = new URL(url);
      if (!out.searchParams.has("output")) {
        out.searchParams.set("output", "embed");
      }
      return out.toString();
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Normalize for database: resolve short links (redirect), then apply embed-friendly rewriting.
 */
export async function normalizeMapUrl(urlString: string | null | undefined): Promise<string | null> {
  const raw = urlString?.trim();
  if (!raw) return null;

  const trimmed = sanitizeGoogleMapsUrlInput(raw);
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();

    if (isGoogleMapsHost(host)) {
      return toEmbedUrlSync(trimmed) ?? trimmed;
    }

    if (isShortMapHost(host)) {
      try {
        const res = await fetch(trimmed, {
          method: "GET",
          redirect: "follow",
          headers: { "User-Agent": "Mozilla/5.0 (compatible; MapEmbedResolver/1.0)" },
        });
        const finalUrl = res.url;
        let finalHost: string;
        try {
          finalHost = new URL(finalUrl).hostname.toLowerCase();
        } catch {
          return trimmed;
        }
        if (isGoogleMapsHost(finalHost) || finalHost === "maps.google.com") {
          return toEmbedUrlSync(finalUrl) ?? finalUrl;
        }
        if (finalHost.endsWith(".google.com") && finalUrl.includes("/maps")) {
          return toEmbedUrlSync(finalUrl) ?? finalUrl;
        }
        return trimmed;
      } catch {
        return trimmed;
      }
    }

    return null;
  } catch {
    return null;
  }
}
