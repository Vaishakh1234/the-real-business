import { countUnseenLeads } from "@/lib/queries/leads";
import { countUnreadNotificationsForAdmin } from "@/lib/queries/admin-notifications";

export type AdminAttentionCounts = {
  /** All leads with `seen_at` null (Leads queue); not added to the bell — see `bellTotal`. */
  unseenLeads: number;
  /** Unread in-app notification rows for this admin — matches inbox “New” rows. */
  unreadNotifications: number;
  /**
   * Header bell badge: unread in-app notifications only (same count as inbox “New”).
   * Unseen leads without an inbox row are surfaced on Leads, not the bell.
   */
  bellTotal: number;
};

export async function getAdminAttentionCounts(
  adminEmail: string,
): Promise<AdminAttentionCounts> {
  const [unseenLeads, unreadNotifications] = await Promise.all([
    countUnseenLeads(),
    countUnreadNotificationsForAdmin(adminEmail),
  ]);
  return {
    unseenLeads,
    unreadNotifications,
    bellTotal: unreadNotifications,
  };
}
