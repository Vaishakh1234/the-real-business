import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";
import { countUnseenLeads } from "@/lib/queries/leads";
import { countUnreadNotificationsForAdmin } from "@/lib/queries/admin-notifications";

/**
 * Unread in-app notifications whose lead is still unseen (`seen_at` null).
 * Used to dedupe the header bell: one new lead should not count as both
 * an unseen lead and an unread notification.
 */
async function countUnreadNotifsForUnseenLeads(
  adminEmail: string,
): Promise<number> {
  const supabase = createAdminClient();
  const { data: rows, error } = await supabase
    .from("admin_notifications")
    .select("lead_id")
    .eq("admin_email", adminEmail)
    .is("read_at", null);

  if (error) throw new Error(toUserFriendlyMessage(error));
  if (!rows?.length) return 0;

  const leadIds = [...new Set(rows.map((r) => r.lead_id))];
  const { count, error: cErr } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .in("id", leadIds)
    .is("seen_at", null);

  if (cErr) throw new Error(toUserFriendlyMessage(cErr));
  return count ?? 0;
}

export type AdminAttentionCounts = {
  unseenLeads: number;
  unreadNotifications: number;
  /** Single badge total for the bell (no double-counting lead + notif). */
  bellTotal: number;
};

export async function getAdminAttentionCounts(
  adminEmail: string,
): Promise<AdminAttentionCounts> {
  const [unseenLeads, unreadNotifications, overlap] = await Promise.all([
    countUnseenLeads(),
    countUnreadNotificationsForAdmin(adminEmail),
    countUnreadNotifsForUnseenLeads(adminEmail),
  ]);
  const bellTotal = unseenLeads + unreadNotifications - overlap;
  return {
    unseenLeads,
    unreadNotifications,
    bellTotal: Math.max(0, bellTotal),
  };
}
