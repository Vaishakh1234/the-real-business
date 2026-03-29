import { HOME_EXPLORE } from "@/lib/constants/site";

const PREFIX = HOME_EXPLORE.listingRefPrefix;

/** Match and normalize a listing reference (e.g. trb-42 → TRB-000042). */
export function canonicalListingRef(input: string): string | null {
  const m = input
    .trim()
    .match(new RegExp(`^(${PREFIX})-(\\d+)$`, "i"));
  if (!m) return null;
  return `${m[1].toUpperCase()}-${m[2].padStart(6, "0")}`;
}

export function isListingRefIdentifier(input: string): boolean {
  return canonicalListingRef(input) !== null;
}
