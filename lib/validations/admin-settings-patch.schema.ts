import { z } from "zod";

const themePreference = z.enum(["light", "dark", "system"]);

export const adminSettingsPatchSchema = z
  .object({
    display_name: z.string().nullable().optional(),
    avatar_url: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    notifications_enabled: z.boolean().optional(),
    email_notifications: z.boolean().optional(),
    lead_alerts: z.boolean().optional(),
    browser_notifications: z.boolean().optional(),
    in_app_lead_notifications: z.boolean().optional(),
    theme: themePreference.optional(),
    language: z.string().optional(),
    timezone: z.string().optional(),
  })
  .strict();
