import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";
import { canonicalListingRef } from "@/lib/listing-ref";
import { sortPropertiesForSuggestions } from "@/lib/search/propertySuggestionRank";
import {
  buildPropertySubstringSearchOrClause,
  sanitizePropertySearchTerm,
} from "@/lib/search/propertyTextSearch";
import { normalizePropertyTags } from "@/lib/utils";
import type {
  PropertyWithRelations,
  PropertyFilters,
  PropertyStatus,
} from "@/types";

/** Only these listings are returned on public list/detail APIs. */
export function isPublicPropertyListingStatus(status: PropertyStatus): boolean {
  return status === "active";
}

export interface AdminListPropertiesOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  category_id?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PublicPropertiesOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  category_id?: string;
  /** Land / plot listings only (column `structure_type`). */
  structure_type?: "house" | "plot";
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  /** Price quoted as full amount vs per cent of land. */
  price_type?: "total" | "percent";
  min_total_cent?: number;
  max_total_cent?: number;
  /** When true, only `is_featured` listings. */
  featured?: boolean;
  /** PostgREST count mode; default `exact`, or `planned` when `publicSearchSuggest` is true. */
  countPrecision?: "exact" | "planned" | "estimated";
  /**
   * Lighter select + planned count for typeahead — cuts payload and avoids expensive exact counts
   * on wide `OR`/trigram queries (reduces intermittent timeouts / “connection” errors).
   */
  publicSearchSuggest?: boolean;
}

const PUBLIC_SUGGEST_SELECT = [
  "id",
  "slug",
  "title",
  "price",
  "city",
  "state",
  "address",
  "zip_code",
  "country",
  "listing_ref",
  "plot_number",
  "facing",
  "short_description",
  "description",
  "meta_title",
  "meta_description",
  "meta_keywords",
  "cover_image_url",
  "created_at",
  "category_id",
  "structure_type",
  "type",
  "area_sqft",
  "total_cent",
  "price_type",
  "category:categories(id,name,slug)",
].join(", ");

function isMissingPriceSearchTextError(err: unknown): boolean {
  const e = err as { message?: string; details?: string; code?: string };
  const blob = `${e?.code ?? ""} ${e?.message ?? ""} ${e?.details ?? ""}`.toLowerCase();
  if (!blob.includes("price_search_text")) return false;
  return (
    blob.includes("does not exist") ||
    blob.includes("undefined_column") ||
    blob.includes("42703") ||
    blob.includes("schema cache")
  );
}

export async function getProperties(
  opts: PublicPropertiesOptions
): Promise<{ data: PropertyWithRelations[]; total: number }> {
  const supabase = createAdminClient();
  const {
    page = 1,
    limit = 12,
    search,
    type,
    status = "active",
    category_id,
    structure_type,
    city,
    min_price,
    max_price,
    bedrooms,
    sort = "newest",
    price_type,
    min_total_cent,
    max_total_cent,
    featured,
    countPrecision,
    publicSearchSuggest,
  } = opts;

  const countPref =
    countPrecision ?? (publicSearchSuggest ? "planned" : "exact");
  const selectStr = publicSearchSuggest
    ? PUBLIC_SUGGEST_SELECT
    : "*, category:categories(id,name,slug)";

  const run = async (includePriceSearchOr: boolean) => {
    let query = supabase
      .from("properties")
      .select(selectStr, { count: countPref });

    if (status && status !== "all") query = query.eq("status", status);
    if (type && type !== "all") query = query.eq("type", type);
    if (category_id) query = query.eq("category_id", category_id);
    if (structure_type === "plot") {
      query = query.eq("structure_type", "plot");
    } else if (structure_type === "house") {
      query = query.or("structure_type.eq.house,structure_type.is.null");
    }
    if (city) query = query.ilike("city", `%${city}%`);
    if (min_price !== undefined) query = query.gte("price", min_price);
    if (max_price !== undefined) query = query.lte("price", max_price);
    if (bedrooms !== undefined) query = query.eq("bedrooms", bedrooms);
    if (price_type) query = query.eq("price_type", price_type);
    if (min_total_cent !== undefined)
      query = query.gte("total_cent", min_total_cent);
    if (max_total_cent !== undefined)
      query = query.lte("total_cent", max_total_cent);
    if (featured === true) query = query.eq("is_featured", true);
    if (search) {
      const safe = sanitizePropertySearchTerm(search);
      if (safe) {
        query = query.or(
          buildPropertySubstringSearchOrClause(safe, includePriceSearchOr),
        );
      }
    }

    switch (sort) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    return query;
  };

  let includePriceOr = true;
  let { data, error, count } = await run(includePriceOr);
  if (
    error &&
    search &&
    includePriceOr &&
    isMissingPriceSearchTextError(error)
  ) {
    includePriceOr = false;
    ({ data, error, count } = await run(includePriceOr));
  }

  if (error) throw new Error(toUserFriendlyMessage(error));

  return {
    data: (data as unknown as PropertyWithRelations[]) ?? [],
    total: count ?? 0,
  };
}

export interface PublicPropertySearchSuggestionsOptions {
  search: string;
  category_id?: string;
  /** First-page pool size (newest first); same text search as /properties. */
  candidateLimit?: number;
  resultLimit?: number;
}

/**
 * Hero/header typeahead: top substring matches (same fields as property list search), capped.
 */
export async function getPublicPropertySearchSuggestions(
  opts: PublicPropertySearchSuggestionsOptions,
): Promise<{ data: PropertyWithRelations[]; total: number }> {
  const {
    search,
    category_id,
    candidateLimit = 50,
    resultLimit = 5,
  } = opts;
  const q = search.trim();
  if (!q) return { data: [], total: 0 };

  const { data: candidates, total } = await getProperties({
    page: 1,
    limit: candidateLimit,
    search: q,
    status: "active",
    category_id,
    sort: "newest",
    publicSearchSuggest: true,
    /** Exact count so “top 5 of N” matches the real filter (planned is planner-estimate). */
    countPrecision: "exact",
  });

  const safe = sanitizePropertySearchTerm(q);
  const ranked = safe
    ? sortPropertiesForSuggestions(candidates, safe)
    : candidates;

  return {
    data: ranked.slice(0, resultLimit),
    total,
  };
}

export async function getPropertiesForAdmin(
  opts: AdminListPropertiesOptions
): Promise<{ data: PropertyWithRelations[]; total: number }> {
  const supabase = createAdminClient();
  const {
    page = 1,
    limit = 10,
    search,
    status,
    type,
    category_id,
    city,
    min_price,
    max_price,
    bedrooms,
    sort_by = "created_at",
    sort_order = "desc",
  } = opts;

  let query = supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)", { count: "exact" });

  if (status && status !== "all") query = query.eq("status", status);
  if (type && type !== "all") query = query.eq("type", type);
  if (category_id) query = query.eq("category_id", category_id);
  if (city) query = query.ilike("city", `%${city}%`);
  if (min_price !== undefined) query = query.gte("price", min_price);
  if (max_price !== undefined) query = query.lte("price", max_price);
  if (bedrooms !== undefined) query = query.eq("bedrooms", bedrooms);
  if (search) {
    const safe = sanitizePropertySearchTerm(search);
    if (safe) {
      query = query.or(buildPropertySubstringSearchOrClause(safe));
    }
  }

  query = query.order(sort_by, { ascending: sort_order === "asc" });

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(toUserFriendlyMessage(error));

  return { data: (data as PropertyWithRelations[]) ?? [], total: count ?? 0 };
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isPropertyId(id: string): boolean {
  return UUID_REGEX.test(id);
}

const MAX_PUBLIC_PROPERTIES_BY_IDS = 100;

/** Active public listings only; caps and dedupes IDs; ignores invalid UUID strings. */
export async function getPublicPropertiesByIds(
  ids: string[],
): Promise<PropertyWithRelations[]> {
  const seen = new Set<string>();
  const valid: string[] = [];
  for (const id of ids) {
    if (valid.length >= MAX_PUBLIC_PROPERTIES_BY_IDS) break;
    const t = id.trim();
    if (!isPropertyId(t) || seen.has(t)) continue;
    seen.add(t);
    valid.push(t);
  }
  if (valid.length === 0) return [];

  const supabase = createAdminClient();
  const chunkSize = 100;
  const out: PropertyWithRelations[] = [];
  for (let i = 0; i < valid.length; i += chunkSize) {
    const batch = valid.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("properties")
      .select("*, category:categories(id,name,slug)")
      .eq("status", "active")
      .in("id", batch);
    if (error) throw new Error(toUserFriendlyMessage(error));
    out.push(...((data as PropertyWithRelations[]) ?? []));
  }
  return out;
}

export async function getPropertyById(id: string): Promise<PropertyWithRelations | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as PropertyWithRelations;
}

export async function getPropertyByListingRef(
  ref: string,
): Promise<PropertyWithRelations | null> {
  const canonical = canonicalListingRef(ref);
  if (!canonical) return null;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .eq("listing_ref", canonical)
    .maybeSingle();

  if (error) return null;
  return data as PropertyWithRelations | null;
}

export async function getPropertyBySlug(slug: string): Promise<PropertyWithRelations | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as PropertyWithRelations;
}

export async function getPropertyByIdOrSlug(
  identifier: string
): Promise<PropertyWithRelations | null> {
  const trimmed = identifier.trim();
  if (!trimmed) return null;
  if (isPropertyId(trimmed)) {
    return getPropertyById(trimmed);
  }
  const byRef = await getPropertyByListingRef(trimmed);
  if (byRef) return byRef;
  return getPropertyBySlug(trimmed);
}

/**
 * Latest active listings, newest first — no city or other filters.
 * Use for home preview grids (avoids `count: exact` overhead of `getProperties`).
 */
export async function getLatestActiveProperties(
  limit: number
): Promise<PropertyWithRelations[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(toUserFriendlyMessage(error));
  return (data as PropertyWithRelations[]) ?? [];
}

export async function getFeaturedProperties(limit = 6): Promise<PropertyWithRelations[]> {
  return getLatestActiveProperties(limit);
}

/** Sitemap: active listings only. Returns empty if Supabase is not configured. */
export async function getActivePropertySlugsForSitemap(): Promise<
  { slug: string; updated_at: string }[]
> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("properties")
      .select("slug, updated_at")
      .eq("status", "active");
    if (error || !data) return [];
    return data
      .filter((row) => typeof row.slug === "string" && row.slug.length > 0)
      .map((row) => ({
        slug: row.slug as string,
        updated_at: (row.updated_at as string) ?? new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

/** Admin: other listings that share at least one tag (any status). */
export async function getAdminRelatedPropertiesByTags(
  propertyId: string,
  tags: string[] | null | undefined,
  limit = 8,
): Promise<PropertyWithRelations[]> {
  const normalized = normalizePropertyTags(tags ?? []);
  if (normalized.length === 0) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .neq("id", propertyId)
    .overlaps("tags", normalized)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(toUserFriendlyMessage(error));
  return (data as PropertyWithRelations[]) ?? [];
}

/** Public site: active listings that share at least one tag with the current listing. */
export async function getPublicRelatedPropertiesByTags(
  propertyId: string,
  tags: string[] | null | undefined,
  limit = 8,
): Promise<PropertyWithRelations[]> {
  const normalized = normalizePropertyTags(tags ?? []);
  if (normalized.length === 0) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, category:categories(id,name,slug)")
    .eq("status", "active")
    .neq("id", propertyId)
    .overlaps("tags", normalized)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(toUserFriendlyMessage(error));
  return (data as PropertyWithRelations[]) ?? [];
}
