/**
 * Property list substring search across text columns (+ generated `price_search_text`).
 * PostgREST `.or()` uses commas as delimiters — strip characters that break the filter string.
 */
export function sanitizePropertySearchTerm(raw: string): string {
  return raw
    .trim()
    .replace(/%/g, "")
    .replace(/_/g, "")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Text columns used in public/admin property substring search (no generated price column). */
export const PROPERTY_SUBSTRING_SEARCH_COLUMNS = [
  "title",
  "short_description",
  "description",
  "address",
  "city",
  "state",
  "zip_code",
  "country",
  "listing_ref",
  "plot_number",
  "slug",
  "facing",
  "meta_title",
  "meta_description",
  "meta_keywords",
] as const;

/**
 * Comma-separated PostgREST `.or()` clause: match any column (substring, case-insensitive).
 * Set `includePriceSearchText` false if the DB has not applied the `price_search_text` migration.
 */
export function buildPropertySubstringSearchOrClause(
  safeTerm: string,
  includePriceSearchText = true,
): string {
  if (!safeTerm) return "";
  const q = safeTerm;
  const cols = includePriceSearchText
    ? [...PROPERTY_SUBSTRING_SEARCH_COLUMNS, "price_search_text" as const]
    : [...PROPERTY_SUBSTRING_SEARCH_COLUMNS];
  return cols.map((c) => `${c}.ilike.%${q}%`).join(",");
}
