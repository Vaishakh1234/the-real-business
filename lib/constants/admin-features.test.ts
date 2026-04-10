import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_FEATURE_IN_APP_LEAD_NOTIFICATIONS_UI,
  isInAppLeadNotificationsSettingsUiEnabled,
} from "@/lib/constants/admin-features";

describe("admin-features", () => {
  const original = process.env;

  beforeEach(() => {
    process.env = { ...original };
  });

  afterEach(() => {
    process.env = original;
  });

  it("defaults in-app lead notifications settings UI off", () => {
    delete process.env.NEXT_PUBLIC_FEATURE_IN_APP_LEAD_NOTIFICATIONS;
    expect(DEFAULT_FEATURE_IN_APP_LEAD_NOTIFICATIONS_UI).toBe(false);
    expect(isInAppLeadNotificationsSettingsUiEnabled()).toBe(false);
  });

  it("enables when env is true", () => {
    process.env.NEXT_PUBLIC_FEATURE_IN_APP_LEAD_NOTIFICATIONS = "true";
    expect(isInAppLeadNotificationsSettingsUiEnabled()).toBe(true);
  });

  it("disables when env is false", () => {
    process.env.NEXT_PUBLIC_FEATURE_IN_APP_LEAD_NOTIFICATIONS = "false";
    expect(isInAppLeadNotificationsSettingsUiEnabled()).toBe(false);
  });
});
