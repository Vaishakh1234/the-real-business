import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/session";
import {
  getAdminRelatedPropertiesByTags,
  getPropertyByIdOrSlug,
} from "@/lib/queries/properties";
import { CONNECTION_UNAVAILABLE_MESSAGE, toUserFriendlyMessage, withConnectionRetry } from "@/lib/db-errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: identifier } = await params;
  const property = await getPropertyByIdOrSlug(identifier);
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  try {
    const data = await withConnectionRetry(() =>
      getAdminRelatedPropertiesByTags(property.id, property.tags, 8),
    );
    return NextResponse.json({ data });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/admin/properties/:id/related]", err);
    const status =
      message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    return NextResponse.json(
      status === 503
        ? { error: "Service temporarily unavailable. Please try again." }
        : { error: message },
      { status },
    );
  }
}
