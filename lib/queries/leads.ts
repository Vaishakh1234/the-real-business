import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";
import type { Lead, LeadInsert, LeadWithProperty, LeadFilters } from "@/types";

export async function getLeads(
  opts: Partial<LeadFilters>
): Promise<{ data: LeadWithProperty[]; total: number }> {
  const supabase = createAdminClient();
  const {
    page = 1,
    limit = 10,
    search,
    status,
    source,
    lead_type,
    sort_by = "created_at",
    sort_order = "desc",
  } = opts;

  let query = supabase
    .from("leads")
    .select("*, property:properties(id,title,slug,price,listing_ref)", {
      count: "exact",
    });

  if (status && status !== "all") query = query.eq("status", status);
  if (source && source !== "all") query = query.eq("source", source);
  if (lead_type && lead_type !== "all") query = query.eq("lead_type", lead_type);
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  query = query.order(sort_by, { ascending: sort_order === "asc" });

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(toUserFriendlyMessage(error));

  return { data: (data as LeadWithProperty[]) ?? [], total: count ?? 0 };
}

export async function getLeadById(id: string): Promise<LeadWithProperty | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, property:properties(id,title,slug,price,listing_ref)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as LeadWithProperty;
}

/** Insert payload; `profile_bg_color` is set by the database trigger. */
export async function createLead(input: LeadInsert): Promise<Lead> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({ ...input, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as Lead;
}

export async function updateLead(
  id: string,
  input: Partial<Omit<Lead, "id" | "created_at">>
): Promise<Lead> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as Lead;
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(toUserFriendlyMessage(error));
}

export async function countUnseenLeads(): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .is("seen_at", null);
  if (error) throw new Error(toUserFriendlyMessage(error));
  return count ?? 0;
}

export async function markLeadSeen(id: string): Promise<Lead> {
  return updateLead(id, { seen_at: new Date().toISOString() });
}
