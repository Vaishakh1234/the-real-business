import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import { countUnseenLeads } from "@/lib/queries/leads";
import { CONNECTION_UNAVAILABLE_MESSAGE, withConnectionRetry } from "@/lib/db-errors";

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await withConnectionRetry(() => countUnseenLeads());
    return NextResponse.json({ count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to count unseen leads";
    console.error("[GET /api/admin/leads/unseen-count]", err);
    const status = message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    const body =
      status === 503
        ? { error: "Service temporarily unavailable. Please try again." }
        : { error: message };
    return NextResponse.json(body, { status });
  }
}
