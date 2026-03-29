/** Persist “use desktop web” hint dismissal for the admin panel (mobile viewports). */
export const ADMIN_MOBILE_WEB_NOTICE_KEY =
  "real-business:admin-mobile-web-notice-dismissed";

export function isAdminMobileWebNoticeDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ADMIN_MOBILE_WEB_NOTICE_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissAdminMobileWebNotice(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ADMIN_MOBILE_WEB_NOTICE_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}
