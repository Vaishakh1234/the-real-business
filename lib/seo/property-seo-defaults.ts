import { SITE_NAME } from "@/lib/constants/site";
import { generateSeoFromContent } from "@/lib/utils";

/** Strip HTML from listing description for SEO snippets. */
export function plainTextFromPropertyHtml(html: string | null | undefined): string {
  if (!html?.trim()) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isBlank(v: unknown): boolean {
  if (v == null) return true;
  return String(v).trim() === "";
}

function toNullIfEmpty(s: string): string | null {
  const t = s.trim();
  return t === "" ? null : t;
}

export type PropertySeoSource = {
  title: string;
  description?: string | null;
  short_description?: string | null;
  city?: string | null;
  type?: "sale" | "rent" | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
};

/**
 * Fills empty meta_title / meta_description / meta_keywords from listing title,
 * plain-text description, city, and sale/rent — same rules as manual SEO, automated.
 * Non-empty fields from the source are kept (SEO engineer overrides preserved).
 */
export function fillBlankPropertySeoFields(
  source: PropertySeoSource,
): {
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
} {
  const title = (source.title ?? "").trim();
  const plainDesc = plainTextFromPropertyHtml(source.description ?? "");
  const short = (source.short_description ?? "").trim();
  const city = (source.city ?? "").trim();
  const typeHint =
    source.type === "rent"
      ? "For rent"
      : source.type === "sale"
        ? "For sale"
        : "";

  const body = plainDesc || short || title;
  const parts = [body, city || undefined, typeHint || undefined].filter(
    (p): p is string => Boolean(p && String(p).trim()),
  );
  const combinedForSnippet = parts.length ? parts.join(" · ") : title;

  const gen = generateSeoFromContent(
    title,
    combinedForSnippet || title,
    SITE_NAME,
  );

  return {
    meta_title: isBlank(source.meta_title)
      ? toNullIfEmpty(gen.meta_title)
      : String(source.meta_title).trim(),
    meta_description: isBlank(source.meta_description)
      ? toNullIfEmpty(gen.meta_description)
      : String(source.meta_description).trim(),
    meta_keywords: isBlank(source.meta_keywords)
      ? toNullIfEmpty(gen.meta_keywords)
      : String(source.meta_keywords).trim(),
  };
}
