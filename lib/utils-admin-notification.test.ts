import { describe, expect, it } from "vitest";
import { isUnreadAdminNotification } from "@/lib/utils";

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
