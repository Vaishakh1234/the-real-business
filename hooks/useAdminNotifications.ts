"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ADMIN_ATTENTION_QUERY_KEY } from "@/hooks/useLeads";
import type { AdminNotificationRow } from "@/types";

const QK = {
  list: (page: number, limit: number) =>
    ["admin-notifications", page, limit] as const,
  unread: ["admin-notifications-unread-count"] as const,
  preview: ["admin-notifications-preview"] as const,
};

export function useAdminNotificationUnreadCount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.unread,
    queryFn: async () => {
      const res = await fetch("/api/admin/notifications/unread-count", {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) return 0;
      if (!res.ok) throw new Error("Failed to fetch unread count");
      const json = (await res.json()) as { count?: number };
      return typeof json.count === "number" ? json.count : 0;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useAdminNotificationsList(page: number, limit: number) {
  return useQuery({
    queryKey: QK.list(page, limit),
    queryFn: async () => {
      const qs = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      const res = await fetch(`/api/admin/notifications?${qs}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(
          typeof j.error === "string" ? j.error : "Failed to load notifications"
        );
      }
      return res.json() as Promise<{
        data: AdminNotificationRow[];
        total: number;
        page: number;
        limit: number;
      }>;
    },
    placeholderData: (prev) => prev,
  });
}

/** Recent items for header popover (fixed limit). */
export function useAdminNotificationsPreview(limit: number) {
  return useQuery({
    queryKey: [...QK.preview, limit],
    queryFn: async () => {
      const qs = new URLSearchParams({ page: "1", limit: String(limit) });
      const res = await fetch(`/api/admin/notifications?${qs}`, {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        return { data: [] as AdminNotificationRow[], total: 0 };
      }
      if (!res.ok) throw new Error("Failed to load");
      return res.json() as Promise<{
        data: AdminNotificationRow[];
        total: number;
      }>;
    },
    staleTime: 15_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof json.error === "string" ? json.error : "Failed to update"
        );
      }
      return json.data as AdminNotificationRow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      qc.invalidateQueries({ queryKey: QK.unread });
      qc.invalidateQueries({ queryKey: QK.preview });
      qc.invalidateQueries({ queryKey: ADMIN_ATTENTION_QUERY_KEY });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_all_read" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof json.error === "string" ? json.error : "Failed to update"
        );
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      qc.invalidateQueries({ queryKey: QK.unread });
      qc.invalidateQueries({ queryKey: QK.preview });
      qc.invalidateQueries({ queryKey: ADMIN_ATTENTION_QUERY_KEY });
    },
  });
}
