import type { AdminSettings } from "@/types";

/**
 * Whether to send a web push for a lead to a registered endpoint.
 * Per-browser opt-in is tracked by `push_subscriptions` rows; account-level
 * `browser_notifications` is only for "turn off all devices" via Settings PATCH.
 */
export function shouldSendLeadPushForAdmin(
  settings: AdminSettings | null | undefined,
): boolean {
  if (!settings) return true;
  return settings.notifications_enabled && settings.lead_alerts;
}
