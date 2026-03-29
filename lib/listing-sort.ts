/** Values accepted by `GET /api/properties` `sort` query param. */
export const LISTING_SORT_VALUES = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
] as const;

export type ListingSortValue = (typeof LISTING_SORT_VALUES)[number];

export function normalizeListingSortParam(
  raw: string | null | undefined,
): ListingSortValue {
  const v = raw ?? "";
  return LISTING_SORT_VALUES.includes(v as ListingSortValue)
    ? (v as ListingSortValue)
    : "newest";
}
