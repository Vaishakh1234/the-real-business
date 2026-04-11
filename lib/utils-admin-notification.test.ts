import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatAdminNotificationTimestamp,
  isUnreadAdminNotification,
} from "@/lib/utils";

describe("isUnreadAdminNotification", () => {
  it("treats null and undefined as unread", () => {
    expect(isUnreadAdminNotification(null)).toBe(true);
    expect(isUnreadAdminNotification(undefined)).toBe(true);
  });

  it("treats empty or whitespace string as unread", () => {
    expect(isUnreadAdminNotification("")).toBe(true);
    expect(isUnreadAdminNotification("   ")).toBe(true);
  });

  it("treats ISO timestamps as read", () => {
    expect(isUnreadAdminNotification("2026-04-10T12:00:00.000Z")).toBe(false);
  });
});

describe("formatAdminNotificationTimestamp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-11T10:00:00.000Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("includes relative time and IST for events within 24h", () => {
    const oneHourAgo = "2026-04-11T09:00:00.000Z";
    const s = formatAdminNotificationTimestamp(oneHourAgo);
    expect(s).toContain("1h ago");
    expect(s).toContain("IST");
    expect(s).toMatch(/14:30|2:30/);
  });

  it("shows IST only for events older than 24h", () => {
    const threeDaysAgo = "2026-04-08T10:00:00.000Z";
    const s = formatAdminNotificationTimestamp(threeDaysAgo);
    expect(s).not.toContain("ago ·");
    expect(s).toContain("IST");
  });
});
