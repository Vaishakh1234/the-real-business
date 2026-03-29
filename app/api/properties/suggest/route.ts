import { NextRequest, NextResponse } from "next/server";
import { getPublicPropertySearchSuggestions } from "@/lib/queries/properties";
import {
  CONNECTION_UNAVAILABLE_MESSAGE,
  toUserFriendlyMessage,
  withConnectionRetry,
} from "@/lib/db-errors";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MIN_SEARCH_LEN = 2;
const MAX_CANDIDATE = 40;

/** Allow slower Supabase/PostgREST responses on serverless hosts. */
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") ?? "").trim();
  const categoryRaw = searchParams.get("category_id") ?? "";
  const category_id =
    categoryRaw !== "" && UUID_REGEX.test(categoryRaw.trim())
      ? categoryRaw.trim()
      : undefined;

  if (categoryRaw !== "" && !category_id) {
    return NextResponse.json(
      { error: "Invalid category_id", data: [], total: 0 },
      { status: 400 },
    );
  }

  if (search.length < MIN_SEARCH_LEN) {
    return NextResponse.json({
      data: [],
      total: 0,
    });
  }

  try {
    const { data, total } = await withConnectionRetry(() =>
      getPublicPropertySearchSuggestions({
        search,
        category_id,
        candidateLimit: MAX_CANDIDATE,
        resultLimit: 5,
      }),
    );
    return NextResponse.json({ data, total });
  } catch (err) {
    const message = toUserFriendlyMessage(err);
    console.error("[GET /api/properties/suggest]", err);
    const status =
      message === CONNECTION_UNAVAILABLE_MESSAGE ? 503 : 500;
    return NextResponse.json({ error: message, data: [], total: 0 }, { status });
  }
}
