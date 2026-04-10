import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { getAdminAttentionCounts } from "@/lib/queries/admin-attention";
import { CONNECTION_UNAVAILABLE_MESSAGE, withConnectionRetry } from "@/lib/db-errors";

export async function GET() {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const counts = await withConnectionRetry(() =>
      getAdminAttentionCounts(session.email),
    );
    return NextResponse.json(counts);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load attention counts";
    console.error("[GET /api/admin/attention-count]", err);
    const status =
      message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    const body =
      status === 503
        ? { error: "Service temporarily unavailable. Please try again." }
        : { error: message };
    return NextResponse.json(body, { status });
  }
}
