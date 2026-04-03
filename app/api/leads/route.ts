import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/queries/leads";
import type { Lead, LeadSource } from "@/types";

const ALLOWED_SOURCES: LeadSource[] = [
  "website",
  "meta_ads",
  "google_ads",
  "manual",
  "chatbot",
];

function normalizeSource(raw: unknown): LeadSource {
  if (typeof raw === "string" && ALLOWED_SOURCES.includes(raw as LeadSource)) {
    return raw as LeadSource;
  }
  return "website";
}

// Public route — accepts lead submissions from the landing page CTA form
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    name,
    email,
    phone,
    message,
    property_id,
  } = body as Partial<Lead> & { property_id?: string };
  const source = normalizeSource(
    (body as Partial<Lead>).source ?? "website",
  );

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  }

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Please enter either email or phone number" },
      { status: 400 }
    );
  }

  try {
    const data = await createLead({
      name: name.trim(),
      email: email ?? null,
      phone: phone ?? null,
      message: message ?? null,
      source,
      status: "new",
      property_id: property_id ?? null,
      property_title: null,
      notes: null,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit lead";
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
