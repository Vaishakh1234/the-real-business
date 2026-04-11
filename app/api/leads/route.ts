import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/queries/leads";
import { notifyLeadCreated } from "@/lib/notifications/manager";
import type { LeadSource, LeadType } from "@/types";

const ALLOWED_SOURCES: LeadSource[] = [
  "website",
  "meta_ads",
  "google_ads",
  "manual",
  "chatbot",
];

const ALLOWED_LEAD_TYPES: LeadType[] = [
  "enquiry",
  "site_visit",
  "contact",
  "list_property",
  "general",
];

function normalizeSource(raw: unknown): LeadSource {
  if (typeof raw === "string" && ALLOWED_SOURCES.includes(raw as LeadSource)) {
    return raw as LeadSource;
  }
  return "website";
}

function normalizeLeadType(raw: unknown): LeadType {
  if (typeof raw === "string" && ALLOWED_LEAD_TYPES.includes(raw as LeadType)) {
    return raw as LeadType;
  }
  return "enquiry";
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
  } = body as {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    message?: unknown;
    property_id?: unknown;
  };
  const source = normalizeSource(
    (body as { source?: unknown }).source ?? "website",
  );
  const lead_type = normalizeLeadType(
    (body as { lead_type?: unknown }).lead_type,
  );

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  }

  const emailStr =
    typeof email === "string" && email.trim() !== "" ? email.trim() : null;
  const phoneStr =
    typeof phone === "string" && phone.trim() !== "" ? phone.trim() : null;
  const messageStr =
    typeof message === "string" && message.trim() !== ""
      ? message.trim()
      : null;

  if (!emailStr && !phoneStr) {
    return NextResponse.json(
      { error: "Please enter either email or phone number" },
      { status: 400 }
    );
  }

  const propertyIdStr =
    typeof property_id === "string" && property_id.trim() !== ""
      ? property_id.trim()
      : null;

  try {
    const data = await createLead({
      name: name.trim(),
      email: emailStr,
      phone: phoneStr,
      message: messageStr,
      source,
      lead_type,
      status: "new",
      property_id: propertyIdStr,
      property_title: null,
      notes: null,
    });

    try {
      await notifyLeadCreated(data);
    } catch (err) {
      console.error("[POST /api/leads] notifyLeadCreated", err);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit lead";
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
