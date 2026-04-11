import type { AdminSettings } from "@/types";

/**
 * Whether to send a web push for a lead to a registered endpoint.
 *
 * Per-browser opt-in is tracked by `push_subscriptions` rows (presence of a
 * row = the device is subscribed).  The account-level `browser_notifications`
 * flag acts as a second gate: when it is false the Settings PATCH deletes all
 * subscriptions AND we skip the send here, so any subscription that somehow
 * survived a deletion race cannot slip through.
 */
export function shouldSendLeadPushForAdmin(
  settings: AdminSettings | null | undefined,
): boolean {
  if (!settings) return true;
  return (
    settings.notifications_enabled &&
    settings.lead_alerts &&
    settings.browser_notifications
  );
}
