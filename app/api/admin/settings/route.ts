import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import {
  getAdminSettingsByEmail,
  updateAdminSettingsByEmail,
} from "@/lib/queries/admin-settings";
import { adminSettingsPatchSchema } from "@/lib/validations/admin-settings-patch.schema";
import { deleteAllPushSubscriptionsForAdmin } from "@/lib/queries/push-subscriptions";

export async function GET() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getAdminSettingsByEmail(session.email);
    if (!settings) {
      return NextResponse.json(
        { error: "No admin settings row for this account. Run the database seed." },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: settings });
  } catch (err) {
    console.error("[GET /api/admin/settings]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

  const parsed = adminSettingsPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const patch = parsed.data;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No changes" }, { status: 400 });
  }

  try {
    if (patch.browser_notifications === false) {
      await deleteAllPushSubscriptionsForAdmin(session.email);
    }
    const data = await updateAdminSettingsByEmail(session.email, patch);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[PATCH /api/admin/settings]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 }
    );
  }
}
