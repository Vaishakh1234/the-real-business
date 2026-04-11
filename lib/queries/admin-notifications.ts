import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";
import type { AdminNotificationRow, Lead } from "@/types";
import { LEAD_TYPE_LABELS } from "@/lib/constants/lead-types";
import { leadNotificationTitle } from "@/lib/notifications/lead-notification-title";

function buildLeadNotificationCopy(lead: Lead): { title: string; body: string | null } {
  const title = leadNotificationTitle(lead);
  const parts: string[] = [];
  if (lead.lead_type) {
    parts.push(`Type: ${LEAD_TYPE_LABELS[lead.lead_type] ?? lead.lead_type}`);
  }
  if (lead.source) parts.push(`Source: ${lead.source}`);
  if (lead.message) {
    const snippet =
      lead.message.length > 120
        ? `${lead.message.slice(0, 117)}…`
        : lead.message;
    parts.push(snippet);
  }
  const body = parts.length > 0 ? parts.join(" · ") : null;
  return { title, body };
}

/**
 * Inserts one in-app notification per admin who opted in. Idempotent per (lead, admin).
 */
export async function insertNotificationsForNewLead(lead: Lead): Promise<void> {
  const supabase = createAdminClient();
  const { data: admins, error } = await supabase
    .from("admin_settings")
    .select("email")
    .eq("in_app_lead_notifications", true);

  if (error) throw new Error(toUserFriendlyMessage(error));
  if (!admins?.length) return;

  const { title, body } = buildLeadNotificationCopy(lead);
  const rows = admins.map((a) => ({
    admin_email: a.email,
    lead_id: lead.id,
    title,
    body,
  }));

  const { error: insErr } = await supabase
    .from("admin_notifications")
    .upsert(rows, {
      onConflict: "lead_id,admin_email",
      ignoreDuplicates: true,
    });

  if (insErr) throw new Error(toUserFriendlyMessage(insErr));
}

export async function listNotificationsForAdmin(
  adminEmail: string,
  opts: { limit: number; offset: number }
): Promise<{ data: AdminNotificationRow[]; total: number }> {
  const supabase = createAdminClient();
  const { limit, offset } = opts;

  const { data, error, count } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact" })
    .eq("admin_email", adminEmail)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(toUserFriendlyMessage(error));
  return { data: (data as AdminNotificationRow[]) ?? [], total: count ?? 0 };
}

export async function countUnreadNotificationsForAdmin(
  adminEmail: string
): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("admin_notifications")
    .select("id", { count: "exact", head: true })
    .eq("admin_email", adminEmail)
    .is("read_at", null);

  if (error) throw new Error(toUserFriendlyMessage(error));
  return count ?? 0;
}

export async function markNotificationRead(
  id: string,
  adminEmail: string
): Promise<AdminNotificationRow | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("admin_email", adminEmail)
    .select()
    .maybeSingle();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as AdminNotificationRow | null;
}

export async function markAllNotificationsReadForAdmin(
  adminEmail: string
): Promise<void> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("admin_notifications")
    .update({ read_at: now })
    .eq("admin_email", adminEmail)
    .is("read_at", null);

  if (error) throw new Error(toUserFriendlyMessage(error));
}
