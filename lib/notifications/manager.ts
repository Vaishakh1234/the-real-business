import type { Lead, PushSubscriptionRow } from "@/types";
import { LEAD_TYPE_LABELS } from "@/lib/constants/lead-types";
import { getAdminSettingsByEmail } from "@/lib/queries/admin-settings";
import { insertNotificationsForNewLead } from "@/lib/queries/admin-notifications";
import {
  deletePushSubscriptionByEndpoint,
  getAllPushSubscriptions,
} from "@/lib/queries/push-subscriptions";
import { shouldSendLeadPushForAdmin } from "@/lib/notifications/lead-push-policy";
import { ensureWebPushConfigured, webpush } from "@/lib/notifications/vapid";

const NOTIFICATION_ICON = "/icons/icon-192.png";

function buildLeadPayload(lead: Lead) {
  const title = `New lead: ${lead.name}`;
  const parts: string[] = [];
  if (lead.lead_type) {
    parts.push(`Type: ${LEAD_TYPE_LABELS[lead.lead_type] ?? lead.lead_type}`);
  }
  if (lead.source) parts.push(`Source: ${lead.source}`);
  if (lead.message) {
    const snippet =
      lead.message.length > 120
        ? `${lead.message.slice(0, 117)}…`
        : lead.message;
    parts.push(snippet);
  }
  const body = parts.length > 0 ? parts.join(" · ") : "Open admin to view details.";
  const url = `/admin/leads`;
  return JSON.stringify({
    title,
    body,
    url,
    icon: NOTIFICATION_ICON,
    leadId: lead.id,
    /** Dedupe by lead; `renotify` in SW makes each lead feel like a new message on mobile. */
    tag: `lead-${lead.id}`,
  });
}

function toWebPushSubscription(row: PushSubscriptionRow) {
  return {
    endpoint: row.endpoint,
    keys: {
      p256dh: row.p256dh,
      auth: row.auth,
    },
  };
}

/**
 * After a lead is persisted: web push (if configured) + in-app notification rows.
 * Fire-and-forget from API routes; errors are logged, not thrown to callers.
 */
export async function notifyLeadCreated(lead: Lead): Promise<void> {
  const results = await Promise.allSettled([
    sendLeadNotification(lead),
    insertNotificationsForNewLead(lead),
  ]);
  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[notifyLeadCreated]", r.reason);
    }
  }
}

/**
 * Fire-and-forget from POST /api/leads. Never throws to caller.
 */
export async function sendLeadNotification(lead: Lead): Promise<void> {
  if (!ensureWebPushConfigured()) {
    console.warn("[push] VAPID not configured; skip lead notification");
    return;
  }

  let rows: PushSubscriptionRow[];
  try {
    rows = await getAllPushSubscriptions();
  } catch (e) {
    console.error("[push] load subscriptions", e);
    return;
  }

  if (rows.length === 0) return;

  const settingsCache = new Map<string, boolean>();
  const payload = buildLeadPayload(lead);

  for (const row of rows) {
    let allow = settingsCache.get(row.admin_email);
    if (allow === undefined) {
      try {
        const s = await getAdminSettingsByEmail(row.admin_email);
        allow = shouldSendLeadPushForAdmin(s);
        settingsCache.set(row.admin_email, allow);
      } catch (e) {
        console.error("[push] admin_settings", row.admin_email, e);
        continue;
      }
    }
    if (!allow) continue;

    try {
      await webpush.sendNotification(toWebPushSubscription(row), payload, {
        TTL: 86_400,
      });
    } catch (err: unknown) {
      const statusCode =
        err && typeof err === "object" && "statusCode" in err
          ? (err as { statusCode?: number }).statusCode
          : undefined;
      if (statusCode === 404 || statusCode === 410) {
        try {
          await deletePushSubscriptionByEndpoint(row.endpoint);
        } catch (delErr) {
          console.error("[push] remove stale subscription", delErr);
        }
      } else {
        console.error("[push] send", err);
      }
    }
  }
}
