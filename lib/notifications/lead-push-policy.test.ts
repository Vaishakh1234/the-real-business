import { describe, expect, it } from "vitest";
import { shouldSendLeadPushForAdmin } from "@/lib/notifications/lead-push-policy";
import type { AdminSettings } from "@/types";

function baseSettings(
  overrides: Partial<AdminSettings> = {},
): AdminSettings {
  return {
    id: "x",
    email: "a@b.com",
    display_name: null,
    avatar_url: null,
    phone: null,
    notifications_enabled: true,
    email_notifications: true,
    lead_alerts: true,
    browser_notifications: true,
    in_app_lead_notifications: true,
    theme: "system",
    language: "en",
    timezone: "UTC",
    created_at: "",
    updated_at: "",
    ...overrides,
  };
}

describe("shouldSendLeadPushForAdmin", () => {
  it("returns true when settings are missing (legacy / load failure)", () => {
    expect(shouldSendLeadPushForAdmin(undefined)).toBe(true);
    expect(shouldSendLeadPushForAdmin(null)).toBe(true);
  });

  it("requires notifications_enabled and lead_alerts", () => {
    expect(
      shouldSendLeadPushForAdmin(
        baseSettings({ notifications_enabled: false, lead_alerts: true }),
      ),
    ).toBe(false);
    expect(
      shouldSendLeadPushForAdmin(
        baseSettings({ notifications_enabled: true, lead_alerts: false }),
      ),
    ).toBe(false);
    expect(
      shouldSendLeadPushForAdmin(
        baseSettings({ notifications_enabled: true, lead_alerts: true }),
      ),
    ).toBe(true);
  });

  it("returns false when browser_notifications is off (account-level kill-switch)", () => {
    expect(
      shouldSendLeadPushForAdmin(
        baseSettings({
          notifications_enabled: true,
          lead_alerts: true,
          browser_notifications: false,
        }),
      ),
    ).toBe(false);
  });

  it("returns true only when all three flags are enabled", () => {
    expect(
      shouldSendLeadPushForAdmin(
        baseSettings({
          notifications_enabled: true,
          lead_alerts: true,
          browser_notifications: true,
        }),
      ),
    ).toBe(true);
  });
});
