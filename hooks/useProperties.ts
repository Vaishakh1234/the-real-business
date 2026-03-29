"use client";

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PUBLIC_PROPERTIES_PAGE_SIZE } from "@/lib/constants/site";
import { buildQueryString } from "@/lib/utils";
import type { PropertyWithRelations, PropertyFilters } from "@/types";
import type { PropertyFormValues } from "@/lib/validations/property.schema";

export interface PublicPropertyFilters {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
  structure_type?: "house" | "plot";
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  status?: string;
  price_type?: "total" | "percent";
  min_total_cent?: number;
  max_total_cent?: number;
  /** Serialize as `featured=1` in the request query string. */
  featured?: 1;
}

/** Public properties list with infinite scroll (for /properties page). */
export function useInfinitePublicProperties(filters: Omit<PublicPropertyFilters, "page" | "limit"> = {}) {
  const { page: _p, limit: _ignoredLimit, ...rest } = filters as PublicPropertyFilters;
  const params = { ...rest, limit: PUBLIC_PROPERTIES_PAGE_SIZE };
  return useInfiniteQuery({
    queryKey: ["properties", "public", "infinite", params],
    queryFn: async ({ pageParam }) => {
      const qs = buildQueryString({ ...params, page: pageParam });
      const res = await fetch(`/api/properties?${qs}`, { credentials: "include" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? "Failed to load properties");
      }
      const json = await res.json();
      return { data: json.data ?? [], total: json.total ?? 0 };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0);
      if (loaded >= lastPage.total || lastPage.data.length === 0) return undefined;
      return allPages.length + 1;
    },
    staleTime: 2 * 60 * 1000, // 2 min revalidation
  });
}

/** Public single property by id or slug (for /properties/[id] page). */
export function usePublicPropertyByIdOrSlug(identifier: string | null) {
  return useQuery({
    queryKey: ["properties", "public", identifier],
    queryFn: async (): Promise<PropertyWithRelations | null> => {
      if (!identifier) return null;
      const res = await fetch(`/api/properties/${encodeURIComponent(identifier)}`, {
        credentials: "include",
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch property");
      const json = await res.json();
      return json.data ?? null;
    },
    enabled: !!identifier,
    staleTime: 2 * 60 * 1000, // 2 min revalidation
  });
}

/** Active public listings for saved IDs (wishlist). Order is not preserved — sort client-side. */
export function usePublicPropertiesByIds(ids: string[]) {
  const sortedKey = [...ids].sort().join(",");
  return useQuery({
    queryKey: ["properties", "public", "by-ids", sortedKey],
    queryFn: async (): Promise<PropertyWithRelations[]> => {
      if (ids.length === 0) return [];
      const qs = buildQueryString({ ids: sortedKey });
      const res = await fetch(`/api/properties?${qs}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? "Failed to load saved listings");
      }
      const json = await res.json();
      return json.data ?? [];
    },
    enabled: ids.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePropertyByIdOrSlug(identifier: string | null) {
  return useQuery({
    queryKey: ["property", identifier],
    queryFn: async (): Promise<PropertyWithRelations | null> => {
      if (!identifier) return null;
      const res = await fetch(`/api/admin/properties/${identifier}`, {
        credentials: "include",
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch property");
      const json = await res.json();
      return json.data ?? null;
    },
    enabled: !!identifier,
  });
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery<{
    data: PropertyWithRelations[];
    total: number;
    page?: number;
    limit?: number;
  }>({
    queryKey: ["properties", filters],
    queryFn: async () => {
      const qs = buildQueryString(
        filters as Record<string, string | number | boolean | undefined>
      );
      const res = await fetch(`/api/admin/properties?${qs}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: PropertyFormValues) => {
      const res = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create property");
      return json.data as PropertyWithRelations;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: Partial<PropertyFormValues>;
    }) => {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update property");
      return json.data as PropertyWithRelations;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property", variables.id] });
      qc.invalidateQueries({ queryKey: ["property"] });
      qc.invalidateQueries({
        queryKey: ["adminPropertyRelated", variables.id],
      });
      qc.invalidateQueries({ queryKey: ["properties", "related", "tags"] });
      toast.success("Property updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete property");
      }
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property", id] });
      qc.invalidateQueries({ queryKey: ["property"] });
      toast.success("Property deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
