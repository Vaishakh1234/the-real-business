import { createAdminClient } from "@/lib/supabase/admin";
import { toUserFriendlyMessage } from "@/lib/db-errors";
import type { AdminSettings, AdminSettingsUpdate } from "@/types";

export async function getAdminSettingsByEmail(
  email: string
): Promise<AdminSettings | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as AdminSettings | null;
}

export async function updateAdminSettingsByEmail(
  email: string,
  patch: AdminSettingsUpdate
): Promise<AdminSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_settings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("email", email)
    .select()
    .single();

  if (error) throw new Error(toUserFriendlyMessage(error));
  return data as AdminSettings;
}
