import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getPublicVapidKey, isVapidConfigured } from "@/lib/notifications/vapid";

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configured = isVapidConfigured();
  const publicKey = getPublicVapidKey();
  return NextResponse.json({
    configured,
    publicKey: configured ? publicKey : null,
  });
}
