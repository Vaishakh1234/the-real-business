import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";
import type { PushSubscriptionRow, WebPushSubscriptionInput } from "@/types";

export async function upsertPushSubscription(
  adminEmail: string,
  input: WebPushSubscriptionInput,
  userAgent: string | null
): Promise<PushSubscriptionRow> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("push_subscriptions")
    .upsert(
      {
        admin_email: adminEmail,
        endpoint: input.endpoint,
        p256dh: input.keys.p256dh,
        auth: input.keys.auth,
        user_agent: userAgent,
        updated_at: now,
      },
      { onConflict: "endpoint" }
    )
    .select()
    .single();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as PushSubscriptionRow;
}

export async function getAllPushSubscriptions(): Promise<PushSubscriptionRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("push_subscriptions").select("*");

  if (error) throw new Error(toUserFriendlyMessage(error));
  return (data as PushSubscriptionRow[]) ?? [];
}

export async function deletePushSubscriptionByEndpoint(
  endpoint: string
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint);

  if (error) throw new Error(toUserFriendlyMessage(error));
}

export async function deleteAllPushSubscriptionsForAdmin(
  adminEmail: string
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("admin_email", adminEmail);

  if (error) throw new Error(toUserFriendlyMessage(error));
}

export async function isEndpointRegisteredForAdmin(
  adminEmail: string,
  endpoint: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("id")
    .eq("admin_email", adminEmail)
    .eq("endpoint", endpoint)
    .maybeSingle();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data != null;
}
