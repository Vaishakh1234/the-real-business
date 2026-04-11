import { describe, expect, it } from "vitest";
import {
  getNotificationPopoverSubtitle,
  parseNewLeadTitle,
} from "@/lib/admin-notification-display";

describe("parseNewLeadTitle", () => {
  it("parses New lead prefix", () => {
    expect(parseNewLeadTitle("New lead: Jane Doe")).toEqual({
      prefix: "New lead: ",
      name: "Jane Doe",
    });
  });

  it("parses New contact prefix", () => {
    expect(parseNewLeadTitle("New contact: Ramesh Kumar")).toEqual({
      prefix: "New contact: ",
      name: "Ramesh Kumar",
    });
  });
});

describe("getNotificationPopoverSubtitle", () => {
  it("shows loading when pending and session exists", () => {
    expect(
      getNotificationPopoverSubtitle(undefined, {
        isPending: true,
        hasSession: true,
      }),
    ).toBe("Loading…");
  });

  it("does not show loading when pending but no session", () => {
    expect(
      getNotificationPopoverSubtitle(undefined, {
        isPending: true,
        hasSession: false,
      }),
    ).toBe("You're all caught up");
  });

  it("prioritizes unread notification copy", () => {
    expect(
      getNotificationPopoverSubtitle(
        {
          unseenLeads: 2,
          unreadNotifications: 3,
          bellTotal: 3,
        },
        { isPending: false, hasSession: true },
      ),
    ).toBe("3 unread notifications");
  });

  it("shows unseen leads when there are no unread notifications", () => {
    expect(
      getNotificationPopoverSubtitle(
        {
          unseenLeads: 4,
          unreadNotifications: 0,
          bellTotal: 0,
        },
        { isPending: false, hasSession: true },
      ),
    ).toBe("4 new leads to review");
  });

  it("uses singular forms", () => {
    expect(
      getNotificationPopoverSubtitle(
        {
          unseenLeads: 0,
          unreadNotifications: 1,
          bellTotal: 1,
        },
        { isPending: false, hasSession: true },
      ),
    ).toBe("1 unread notification");
    expect(
      getNotificationPopoverSubtitle(
        {
          unseenLeads: 1,
          unreadNotifications: 0,
          bellTotal: 0,
        },
        { isPending: false, hasSession: true },
      ),
    ).toBe("1 new lead to review");
  });
});
