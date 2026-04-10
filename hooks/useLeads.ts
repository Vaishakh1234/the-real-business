"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { buildQueryString } from "@/lib/utils";
import type { AdminAttentionCounts } from "@/lib/queries/admin-attention";
import type {
  Lead,
  LeadInsert,
  LeadWithProperty,
  LeadFilters,
} from "@/types";

/** React Query key; also invalidated from `useAdminNotifications` mutations. */
export const ADMIN_ATTENTION_QUERY_KEY = ["admin-attention-count"] as const;

export function useLeads(filters: LeadFilters = {}) {
  return useQuery<{
    data: LeadWithProperty[];
    total: number;
    page?: number;
    limit?: number;
  }>({
    queryKey: ["leads", filters],
    queryFn: async () => {
      const qs = buildQueryString(
        filters as Record<string, string | number | boolean | undefined>
      );
      const res = await fetch(`/api/admin/leads?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: LeadInsert) => {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create lead");
      return json.data as Lead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["admin-leads-unseen-count"] });
      qc.invalidateQueries({ queryKey: ADMIN_ATTENTION_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      qc.invalidateQueries({ queryKey: ["admin-notifications-unread-count"] });
      qc.invalidateQueries({ queryKey: ["admin-notifications-preview"] });
      toast.success("Lead created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<Omit<Lead, "id" | "created_at">>;
    }) => {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update lead");
      return json.data as Lead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["admin-leads-unseen-count"] });
      qc.invalidateQueries({ queryKey: ADMIN_ATTENTION_QUERY_KEY });
      toast.success("Lead updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete lead");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["admin-leads-unseen-count"] });
      qc.invalidateQueries({ queryKey: ADMIN_ATTENTION_QUERY_KEY });
      toast.success("Lead deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/** Deduped counts for header bell + Leads nav badge (requires session). */
export function useAdminAttentionCounts(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ADMIN_ATTENTION_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/admin/attention-count", {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) {
        return {
          unseenLeads: 0,
          unreadNotifications: 0,
          bellTotal: 0,
        } satisfies AdminAttentionCounts;
      }
      if (!res.ok) throw new Error("Failed to fetch attention counts");
      return (await res.json()) as AdminAttentionCounts;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  });
}

/** Unseen lead count for admin header badge (requires session). */
export function useAdminUnseenLeadCount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["admin-leads-unseen-count"],
    queryFn: async () => {
      const res = await fetch("/api/admin/leads/unseen-count", {
        credentials: "include",
      });
      if (res.status === 401 || res.status === 403) return 0;
      if (!res.ok) throw new Error("Failed to fetch unseen count");
      const json = (await res.json()) as { count?: number };
      return typeof json.count === "number" ? json.count : 0;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: 60_000,
    staleTime: 30_000,
    retry: 1,
  });
}

/** Mark a lead as seen when opened in the admin panel. */
export function useMarkLeadSeen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ seen_at: new Date().toISOString() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update lead");
      return json.data as Lead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["admin-leads-unseen-count"] });
      qc.invalidateQueries({ queryKey: ADMIN_ATTENTION_QUERY_KEY });
    },
  });
}

/** Public contact form submission — POSTs to /api/leads; UI should show inline feedback, invalidates admin leads list */
export function useSubmitContactForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      name: string;
      email: string;
      phone?: string | null;
      message: string;
      source?: Lead["source"];
      lead_type?: Lead["lead_type"];
    }) => {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          source: body.source ?? "website",
          lead_type: body.lead_type ?? "enquiry",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message");
      return json.data as Lead;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
