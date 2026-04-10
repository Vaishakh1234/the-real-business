import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import {
  listNotificationsForAdmin,
  markAllNotificationsReadForAdmin,
} from "@/lib/queries/admin-notifications";

export async function GET(request: NextRequest) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "20", 10), 1),
    100
  );
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);
  const offset = (page - 1) * limit;

  try {
    const { data, total } = await listNotificationsForAdmin(session.email, {
      limit,
      offset,
    });
    return NextResponse.json({ data, total, page, limit });
  } catch (err) {
    console.error("[GET /api/admin/notifications]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action =
    body && typeof body === "object" && "action" in body
      ? (body as { action?: unknown }).action
      : undefined;

  if (action !== "mark_all_read") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    await markAllNotificationsReadForAdmin(session.email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/notifications]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
