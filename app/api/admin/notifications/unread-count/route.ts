import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { countUnreadNotificationsForAdmin } from "@/lib/queries/admin-notifications";

export async function GET() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await countUnreadNotificationsForAdmin(session.email);
    return NextResponse.json({ count });
  } catch (err) {
    console.error("[GET /api/admin/notifications/unread-count]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
