import { NextResponse } from "next/server";
import {
  getPropertyByIdOrSlug,
  getPublicRelatedPropertiesByTags,
  isPublicPropertyListingStatus,
} from "@/lib/queries/properties";
import {
  CONNECTION_UNAVAILABLE_MESSAGE,
  toUserFriendlyMessage,
  withConnectionRetry,
} from "@/lib/db-errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id: identifier } = await params;
  try {
    const property = await withConnectionRetry(() =>
      getPropertyByIdOrSlug(identifier),
    );
    if (!property || !isPublicPropertyListingStatus(property.status)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const data = await withConnectionRetry(() =>
      getPublicRelatedPropertiesByTags(property.id, property.tags, 8),
    );
    return NextResponse.json({ data });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/properties/:id/related]", err);
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
