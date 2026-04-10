import type { LeadType } from "@/types";

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  enquiry: "Enquiry",
  site_visit: "Site visit",
  contact: "Contact",
  list_property: "List property",
  general: "General",
};

export const LEAD_TYPE_ORDER: LeadType[] = [
  "enquiry",
  "site_visit",
  "contact",
  "list_property",
  "general",
];

/** Safe for API rows before/without migration or bad data. */
export function coerceLeadType(raw: string | null | undefined): LeadType {
  if (raw && (LEAD_TYPE_ORDER as readonly string[]).includes(raw)) {
    return raw as LeadType;
  }
  return "enquiry";
}
