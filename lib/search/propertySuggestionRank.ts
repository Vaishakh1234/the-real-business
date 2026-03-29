import type { PropertyWithRelations } from "@/types";

function stripHtmlLoose(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Higher score = better rank. Title matches always beat non-title matches.
 */
export function propertySuggestionRankScore(
  row: PropertyWithRelations,
  needleRaw: string,
): number {
  const needle = needleRaw.trim().toLowerCase();
  if (!needle) return 0;

  const title = (row.title ?? "").toLowerCase();
  const tIdx = title.indexOf(needle);
  if (tIdx >= 0) {
    let score = 10_000_000;
    if (tIdx === 0) score += 50_000;
    else {
      const prev = title[tIdx - 1] ?? " ";
      if (!/[\p{L}\p{N}]/u.test(prev)) score += 25_000;
    }
    score += 10_000 - Math.min(tIdx, 9999);
    return score;
  }

  const sub = (hay: string, tierBase: number): number => {
    const h = hay.toLowerCase();
    const i = h.indexOf(needle);
    if (i < 0) return 0;
    return tierBase + (1000 - Math.min(i, 999));
  };

  const descPlain = stripHtmlLoose(row.description ?? "");
  const priceText =
    row.price_search_text?.trim() ?? String(row.price ?? "");

  return Math.max(
    sub(row.short_description ?? "", 5_000_000),
    sub(descPlain, 4_000_000),
    sub(row.listing_ref ?? "", 4_500_000),
    sub(row.meta_title ?? "", 3_500_000),
    sub(row.city ?? "", 3_000_000),
    sub(row.address ?? "", 2_500_000),
    sub(row.state ?? "", 2_000_000),
    sub(priceText, 1_500_000),
    sub(row.slug ?? "", 1_000_000),
    1,
  );
}

export function sortPropertiesForSuggestions(
  rows: PropertyWithRelations[],
  needleRaw: string,
): PropertyWithRelations[] {
  const needle = needleRaw.trim();
  const copy = [...rows];
  copy.sort((a, b) => {
    const ra = propertySuggestionRankScore(a, needle);
    const rb = propertySuggestionRankScore(b, needle);
    if (rb !== ra) return rb - ra;
    const ta = new Date(a.created_at).getTime();
    const tb = new Date(b.created_at).getTime();
    return tb - ta;
  });
  return copy;
}
