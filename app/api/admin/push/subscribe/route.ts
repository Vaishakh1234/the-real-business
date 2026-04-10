import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { isVapidConfigured } from "@/lib/notifications/vapid";
import {
  deletePushSubscriptionByEndpoint,
  isEndpointRegisteredForAdmin,
  upsertPushSubscription,
} from "@/lib/queries/push-subscriptions";
import {
  webPushSubscriptionSchema,
  webPushUnsubscribeSchema,
} from "@/lib/validations/push.schema";

export async function POST(request: NextRequest) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isVapidConfigured()) {
    return NextResponse.json(
      { error: "Push is not configured on the server (VAPID keys missing)." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = webPushSubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid subscription payload" }, { status: 400 });
  }

  const ua = request.headers.get("user-agent");

  try {
    await upsertPushSubscription(session.email, parsed.data, ua);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/admin/push/subscribe]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

  const parsed = webPushUnsubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const ok = await isEndpointRegisteredForAdmin(
      session.email,
      parsed.data.endpoint
    );
    if (!ok) {
      return NextResponse.json({ success: true, removed: false });
    }
    await deletePushSubscriptionByEndpoint(parsed.data.endpoint);
    return NextResponse.json({ success: true, removed: true });
  } catch (err) {
    console.error("[DELETE /api/admin/push/subscribe]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to remove" },
      { status: 500 }
    );
  }
}
