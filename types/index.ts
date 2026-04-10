// ─── Shared ──────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AdminSession {
  isAdmin: boolean;
  email: string;
}

// ─── Categories (initial migration) ─────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  sort_by?: "name" | "created_at";
  sort_order?: "asc" | "desc";
}

// ─── Properties (initial migration) ──────────────────────────────────────────

export type PropertyType = "sale" | "rent";
/** House (built unit) vs plot (land). Distinct from PropertyType (sale/rent). */
export type PropertyStructureType = "house" | "plot" | "building";
export type PropertyStatus = "active" | "sold" | "rented" | "draft" | "closed";
export type PropertyFurnished = "furnished" | "semi-furnished" | "unfurnished";

export interface Property {
  id: string;
  /** Human-readable application listing id (e.g. TRB-000001), set by DB on insert */
  listing_ref: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  type: PropertyType;
  /** House vs plot (land). Omitted in older rows is treated as house. */
  structure_type?: PropertyStructureType | null;
  status: PropertyStatus;
  is_featured: boolean;
  category_id: string | null;
  price: number;
  /** Generated in DB for text search (see migration); optional until migrated. */
  price_search_text?: string | null;
  price_type?: "total" | "percent";
  area_sqft: number | null;
  /** Land extent in cents (e.g. Kerala); null if unset. */
  total_cent?: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floors: number | null;
  facing: string | null;
  furnished: PropertyFurnished | null;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  map_embed_url: string | null;
  cover_image_url: string | null;
  gallery_images: string[] | null;
  amenities: string[] | null;
  /** Admin-defined labels for grouping; used for tag-based related listings in admin. */
  tags?: string[] | null;
  highlights: string[] | null;
  plot_number: string | null;
  plot_dimensions: string | null;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyWithRelations extends Property {
  category: { id: string; name: string; slug: string } | null;
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PropertyStatus | "all";
  type?: PropertyType | "all";
  category_id?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// ─── Leads (initial migration) ─────────────────────────────────────────────

export type LeadSource = "website" | "meta_ads" | "google_ads" | "manual" | "chatbot";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

/** Intent of the lead (channel is still `source`: website, chatbot, etc.). */
export type LeadType =
  | "enquiry"
  | "site_visit"
  | "contact"
  | "list_property"
  | "general";

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  lead_type: LeadType;
  /** When an admin last opened this lead; null means not yet seen in the panel. */
  seen_at: string | null;
  /** Pastel background for the initial avatar; assigned on insert (DB trigger + palette). */
  profile_bg_color: string;
  property_id: string | null;
  property_title: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Fields accepted when creating a lead (`profile_bg_color` and `seen_at` are set by the DB). */
export type LeadInsert = Omit<
  Lead,
  "id" | "created_at" | "updated_at" | "profile_bg_color" | "seen_at"
>;

export interface LeadWithProperty extends Lead {
  property: {
    id: string;
    title: string;
    slug: string;
    price?: number;
    listing_ref?: string;
  } | null;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus | "all";
  source?: LeadSource | "all";
  lead_type?: LeadType | "all";
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// ─── Reports (dashboard/reports) ───────────────────────────────────────────

export interface PropertyStats {
  total: number;
  active: number;
  draft: number;
  sold: number;
  rented: number;
  closed: number;
  for_sale: number;
  for_rent: number;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  by_source: { source: LeadSource; count: number }[];
  by_type: { type: LeadType; count: number }[];
}

export interface CategoryDistribution {
  id: string;
  name: string;
  property_count: number;
}

export interface RecentActivity {
  type: "property" | "lead";
  id: string;
  title: string;
  subtitle: string;
  created_at: string;
}

export interface ReportsData {
  property_stats: PropertyStats;
  lead_stats: LeadStats;
  category_distribution: CategoryDistribution[];
  recent_activity: RecentActivity[];
}

// ─── Dashboard & Analytics ───────────────────────────────────────────────────

export interface PropertyStatusCount {
  status: PropertyStatus;
  count: number;
}

export interface LeadStatusCount {
  status: LeadStatus;
  count: number;
}

export interface DashboardStats {
  total_properties: number;
  active_properties: number;
  total_leads: number;
  new_leads: number;
  properties_by_status: PropertyStatusCount[];
  leads_by_status: LeadStatusCount[];
  recent_properties: Pick<
    PropertyWithRelations,
    "id" | "listing_ref" | "title" | "city" | "status" | "created_at" | "cover_image_url"
  >[];
  recent_leads: Pick<LeadWithProperty, "id" | "name" | "email" | "status" | "created_at">[];
}

// ─── Admin Settings ───────────────────────────────────────────────────────────

export type ThemePreference = "light" | "dark" | "system";

export interface AdminSettings {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  notifications_enabled: boolean;
  email_notifications: boolean;
  lead_alerts: boolean;
  browser_notifications: boolean;
  /** When true, new leads appear in the admin notification inbox (Settings). */
  in_app_lead_notifications: boolean;
  theme: ThemePreference;
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSettingsUpdate {
  display_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  notifications_enabled?: boolean;
  email_notifications?: boolean;
  lead_alerts?: boolean;
  browser_notifications?: boolean;
  in_app_lead_notifications?: boolean;
  theme?: ThemePreference;
  language?: string;
  timezone?: string;
}

/** In-app notification row (one per lead per admin when enabled). */
export interface AdminNotificationRow {
  id: string;
  admin_email: string;
  lead_id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

// ─── Web Push (service worker subscriptions) ────────────────────────────────

export interface PushSubscriptionRow {
  id: string;
  admin_email: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

/** Browser PushManager.subscribe shape (keys as base64url strings). */
export interface WebPushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface WebPushSubscriptionInput {
  endpoint: string;
  keys: WebPushSubscriptionKeys;
}
