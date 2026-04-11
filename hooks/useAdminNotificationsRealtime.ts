"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClientSupabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { ADMIN_ATTENTION_QUERY_KEY } from "@/hooks/useLeads";
import { ADMIN_NOTIFICATIONS_LIST_QUERY_KEY } from "@/lib/query-keys/admin-notifications";

const REFRESH_MS = 45 * 60 * 1000;

/**
 * Subscribes to `admin_notifications` for the logged-in admin email and syncs
 * React Query (bell, unread, preview, and the paginated inbox list on this page).
 */
export function useAdminNotificationsRealtime() {
  const queryClient = useQueryClient();
  const email = useAuthStore((s) => s.email);

  useEffect(() => {
    if (!email?.trim()) return;
    const adminEmail = email;

    let cancelled = false;
    const supabase = createClientSupabase();
    let channel: RealtimeChannel | null = null;

    async function syncNotificationQueries() {
      await queryClient.invalidateQueries({ queryKey: ADMIN_ATTENTION_QUERY_KEY });
      await queryClient.invalidateQueries({
        queryKey: ["admin-notifications-unread-count"],
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-notifications-preview"] });
      await queryClient.refetchQueries({
        queryKey: [ADMIN_NOTIFICATIONS_LIST_QUERY_KEY],
        type: "active",
      });
    }

    async function subscribe() {
      const res = await fetch("/api/admin/realtime-token", {
        credentials: "include",
      });
      if (!res.ok || cancelled) return;
      const json = (await res.json()) as { token?: string };
      const token = json.token;
      if (!token || cancelled) return;

      if (channel) {
        await supabase.removeChannel(channel);
        channel = null;
      }

      supabase.realtime.setAuth(token);

      const filter = `admin_email=eq.${encodeURIComponent(adminEmail)}`;
      channel = supabase
        .channel(`admin_notifications:${adminEmail}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "admin_notifications",
            filter,
          },
          () => {
            void syncNotificationQueries();
          }
        )
        .subscribe((status, err) => {
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.warn("[admin-notifications-realtime]", status, err);
          }
        });
    }

    void subscribe();
    const intervalId = window.setInterval(() => {
      void subscribe();
    }, REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [email, queryClient]);
}
