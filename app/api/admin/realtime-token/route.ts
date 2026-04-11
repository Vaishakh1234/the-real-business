import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { signAdminRealtimeJwt } from "@/lib/supabase/realtime-jwt";

export async function GET() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await signAdminRealtimeJwt(session.email);
    return NextResponse.json({ token });
  } catch (err) {
    console.error("[GET /api/admin/realtime-token]", err);
    const message =
      err instanceof Error && err.message === "Missing SUPABASE_JWT_SECRET"
        ? "Server configuration error"
        : "Failed to issue token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
