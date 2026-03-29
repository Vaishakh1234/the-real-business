import { NextRequest, NextResponse } from "next/server";
import {
  getLatestActiveProperties,
  getProperties,
  getPublicPropertiesByIds,
} from "@/lib/queries/properties";
import {
  CONNECTION_UNAVAILABLE_MESSAGE,
  toUserFriendlyMessage,
  withConnectionRetry,
} from "@/lib/db-errors";

// Public endpoint — serves the landing page featured properties
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  /** Home grid: newest active only, no filters (lighter than full `getProperties`). */
  if (searchParams.get("latest") === "1") {
    const raw = parseInt(searchParams.get("limit") ?? "6", 10);
    const limit = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 50) : 6;
    try {
      const data = await withConnectionRetry(() => getLatestActiveProperties(limit));
      return NextResponse.json({ data, total: data.length });
    } catch (err) {
      const message = toUserFriendlyMessage(err);
      console.error("[GET /api/properties?latest=1]", err);
      const status =
        message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }

  const idsParam = searchParams.get("ids");
  if (idsParam != null && idsParam !== "") {
    const rawIds = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const data = await withConnectionRetry(() =>
        getPublicPropertiesByIds(rawIds),
      );
      return NextResponse.json({ data, total: data.length });
    } catch (err) {
      const message = toUserFriendlyMessage(err);
      console.error("[GET /api/properties?ids=]", err);
      const status =
        message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  }

  const rawStructure = searchParams.get("structure_type");
  const structure_type =
    rawStructure === "plot" || rawStructure === "house" ? rawStructure : undefined;
  const category_id = searchParams.get("category_id") ?? undefined;
  const min_price = searchParams.get("min_price");
  const max_price = searchParams.get("max_price");
  const sort =
    (searchParams.get("sort") as
      | "newest"
      | "oldest"
      | "price_asc"
      | "price_desc") ?? "newest";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const search = searchParams.get("search") ?? undefined;
  const rawPriceType = searchParams.get("price_type");
  const price_type =
    rawPriceType === "percent" || rawPriceType === "total"
      ? rawPriceType
      : undefined;
  const min_total_cent_param = searchParams.get("min_total_cent");
  const max_total_cent_param = searchParams.get("max_total_cent");
  const min_total_cent =
    min_total_cent_param != null && min_total_cent_param !== ""
      ? Number(min_total_cent_param)
      : undefined;
  const max_total_cent =
    max_total_cent_param != null && max_total_cent_param !== ""
      ? Number(max_total_cent_param)
      : undefined;
  const featuredRaw = searchParams.get("featured");
  const featured =
    featuredRaw === "1" || featuredRaw === "true" ? true : undefined;
  try {
    const { data, total } = await withConnectionRetry(() =>
      getProperties({
        structure_type,
        category_id,
        min_price: min_price ? Number(min_price) : undefined,
        max_price: max_price ? Number(max_price) : undefined,
        status: "active",
        search,
        sort,
        page,
        limit,
        price_type,
        min_total_cent:
          min_total_cent !== undefined && Number.isFinite(min_total_cent)
            ? min_total_cent
            : undefined,
        max_total_cent:
          max_total_cent !== undefined && Number.isFinite(max_total_cent)
            ? max_total_cent
            : undefined,
        featured,
      }),
    );
    return NextResponse.json({ data, total });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/properties]", err);
    const status =
      message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
