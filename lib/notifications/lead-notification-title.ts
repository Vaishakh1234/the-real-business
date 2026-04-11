import type { Lead } from "@/types";

/** In-app + web push title for a newly created lead (contact page uses `contact` type). */
export function leadNotificationTitle(lead: Lead): string {
  if (lead.lead_type === "contact") {
    return `New contact: ${lead.name}`;
  }
  return `New lead: ${lead.name}`;
}
