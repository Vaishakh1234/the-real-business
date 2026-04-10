import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import {
  getPublicVapidKey,
  isVapidConfigured,
} from "@/lib/notifications/vapid";
import { isEndpointRegisteredForAdmin } from "@/lib/queries/push-subscriptions";

export async function GET(request: NextRequest) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configured = isVapidConfigured();
  const publicKey = getPublicVapidKey();
  const endpoint = request.nextUrl.searchParams.get("endpoint");

  let isRegistered = false;
  if (endpoint && configured) {
    try {
      isRegistered = await isEndpointRegisteredForAdmin(session.email, endpoint);
    } catch (e) {
      console.error("[GET /api/admin/push/status]", e);
      return NextResponse.json(
        { error: "Failed to check subscription" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    vapidConfigured: configured,
    publicKey: configured ? publicKey : null,
    isRegistered,
  });
}
