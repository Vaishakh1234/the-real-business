import { SITE_NAME } from "@/lib/constants/site";
import { absoluteUrl } from "@/lib/seo/site";
import type { PropertyWithRelations } from "@/types";
import { formatPropertyPriceValue } from "@/lib/utils";

/**
 * Body text for wa.me `?text=` — listing context + polite “interested” line.
 * Kept concise so it fits WhatsApp clients’ prefill limits.
 */
export function buildPropertyWhatsAppPrefillMessage(
  property: PropertyWithRelations,
  listingPath: string,
): string {
  const url = absoluteUrl(listingPath);

  const priceFigure = formatPropertyPriceValue(
    property.price ?? 0,
    property.price_type ?? undefined,
  );
  const priceDisplay =
    priceFigure === "—" || priceFigure.startsWith("₹")
      ? priceFigure
      : `₹${priceFigure}`;
  const priceBasis =
    property.price_type === "percent" ? "per cent" : "total";

  const loc = [property.city?.trim(), property.state?.trim()]
    .filter(Boolean)
    .join(", ");

  const areaParts: string[] = [];
  if (property.total_cent != null) {
    areaParts.push(
      `${Number(property.total_cent).toLocaleString("en-IN", {
        maximumFractionDigits: 4,
      })} cent`,
    );
  } else if (property.area_sqft != null && property.area_sqft > 0) {
    areaParts.push(
      `${property.area_sqft.toLocaleString("en-IN")} sqft`,
    );
  }

  const lines: (string | null)[] = [
    `Hi ${SITE_NAME},`,
    "",
    "I'm interested in this listing:",
    "",
    property.title.trim(),
    loc ? `Location: ${loc}` : null,
    `Price: ${priceDisplay} (${priceBasis})`,
    areaParts.length ? `Area: ${areaParts.join(", ")}` : null,
    property.listing_ref?.trim()
      ? `Listing ref: ${property.listing_ref.trim()}`
      : null,
    "",
    `Open listing: ${url}`,
  ];

  return lines.filter((x): x is string => x != null).join("\n");
}
