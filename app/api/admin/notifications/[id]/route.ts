import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { markNotificationRead } from "@/lib/queries/admin-notifications";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const read =
    body &&
    typeof body === "object" &&
    "read" in body &&
    (body as { read?: unknown }).read === true;

  if (!read) {
    return NextResponse.json({ error: "Expected { \"read\": true }" }, { status: 400 });
  }

  try {
    const row = await markNotificationRead(id, session.email);
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: row });
  } catch (err) {
    console.error("[PATCH /api/admin/notifications/[id]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
