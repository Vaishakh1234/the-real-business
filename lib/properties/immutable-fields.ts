/** Columns that must never be updated from API payloads (IDs are route-scoped; listing_ref is DB-assigned). */
export function stripImmutablePropertyFields(
  row: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...row };
  delete next.id;
  delete next.listing_ref;
  delete next.created_at;
  return next;
}
