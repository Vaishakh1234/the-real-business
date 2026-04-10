/**
 * Admin UI feature flags. Defaults are conservative (features off) until ready.
 *
 * Override at build time with `NEXT_PUBLIC_FEATURE_IN_APP_LEAD_NOTIFICATIONS=true`
 * to show the in-app lead notifications row on Settings.
 */

/** When env is unset, the in-app lead notifications settings card stays hidden. */
export const DEFAULT_FEATURE_IN_APP_LEAD_NOTIFICATIONS_UI = false;

export function isInAppLeadNotificationsSettingsUiEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_FEATURE_IN_APP_LEAD_NOTIFICATIONS?.trim();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return DEFAULT_FEATURE_IN_APP_LEAD_NOTIFICATIONS_UI;
}
