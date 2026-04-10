import type { AdminAttentionCounts } from "@/lib/queries/admin-attention";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Building2,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import {
  LEAD_TYPE_LABELS,
  LEAD_TYPE_ORDER,
  coerceLeadType,
} from "@/lib/constants/lead-types";
import type { LeadType } from "@/types";

/** "New lead: Name" → bold name; otherwise null (show full title as-is). */
export function parseNewLeadTitle(title: string): {
  prefix: string;
  name: string;
} | null {
  const m = /^New lead:\s*(.+)$/i.exec(title.trim());
  if (!m?.[1]) return null;
  return { prefix: "New lead: ", name: m[1].trim() };
}

/** Infer lead type from notification body: `Type: Enquiry · Source: …` */
export function inferLeadTypeFromNotificationBody(
  body: string | null | undefined,
): LeadType {
  if (!body || typeof body !== "string") return "enquiry";
  const typeMatch = /Type:\s*([^·]+)/i.exec(body);
  if (!typeMatch?.[1]) return "enquiry";
  const raw = typeMatch[1].trim().toLowerCase();
  for (const t of LEAD_TYPE_ORDER) {
    if (LEAD_TYPE_LABELS[t].toLowerCase() === raw) return t;
  }
  const normalized = raw.replace(/\s+/g, "_");
  return coerceLeadType(normalized);
}

const TYPE_ICONS: Record<LeadType, LucideIcon> = {
  enquiry: MessageSquare,
  site_visit: MapPin,
  contact: Phone,
  list_property: Building2,
  general: Bell,
};

/** Colored icon tile classes (match Leads admin accents). */
const TYPE_TILE: Record<LeadType, string> = {
  enquiry: "bg-sky-100 text-sky-800 ring-1 ring-sky-200/90 shadow-sm",
  site_visit: "bg-violet-100 text-violet-800 ring-1 ring-violet-200/90 shadow-sm",
  contact: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/90 shadow-sm",
  list_property: "bg-rose-100 text-rose-800 ring-1 ring-rose-200/90 shadow-sm",
  general: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/90 shadow-sm",
};

/**
 * Header notification popover copy: must match row-level unread state (not the bell
 * badge total, which dedupes unseen leads vs unread notifications).
 */
export function getNotificationPopoverSubtitle(
  attention: AdminAttentionCounts | undefined,
  options: { isPending: boolean; hasSession: boolean },
): string {
  if (options.isPending && options.hasSession) return "Loading…";
  const unread = attention?.unreadNotifications ?? 0;
  const unseen = attention?.unseenLeads ?? 0;
  if (unread > 0) {
    return `${unread} unread notification${unread === 1 ? "" : "s"}`;
  }
  if (unseen > 0) {
    return `${unseen} new lead${unseen === 1 ? "" : "s"} to review`;
  }
  return "You're all caught up";
}

export function getNotificationTypePresentation(body: string | null | undefined): {
  Icon: LucideIcon;
  tileClassName: string;
  type: LeadType;
} {
  const type = inferLeadTypeFromNotificationBody(body);
  return {
    type,
    Icon: TYPE_ICONS[type],
    tileClassName: TYPE_TILE[type],
  };
}
