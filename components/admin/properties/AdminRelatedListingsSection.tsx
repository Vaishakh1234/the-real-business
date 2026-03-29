"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Link2, Loader2 } from "lucide-react";
import { ProfileSectionLabel } from "@/components/admin/ProfileDetailModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPrice } from "@/lib/utils";
import type { PropertyWithRelations } from "@/types";

const CARD_CLASS =
  "rounded-xl border border-admin-card-border bg-admin-card-bg p-3 shadow-sm sm:p-4 lg:p-6 min-w-0";
const SECTION_LABEL_CLASS =
  "text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground";
const VALUE_MUTED_CLASS =
  "text-sm sm:text-base text-muted-foreground leading-relaxed";

export function AdminRelatedListingsSection({
  propertyId,
  tags,
}: {
  propertyId: string;
  tags: string[] | null | undefined;
}) {
  const tagSignature = tags?.length
    ? [...tags].sort((a, b) => a.localeCompare(b)).join("|")
    : "";

  const {
    data: relatedByTags = [],
    isPending,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["adminPropertyRelated", propertyId, tagSignature],
    queryFn: async (): Promise<PropertyWithRelations[]> => {
      const res = await fetch(
        `/api/admin/properties/${encodeURIComponent(propertyId)}/related`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to load related properties");
      const json = await res.json();
      return json.data ?? [];
    },
    enabled: Boolean(propertyId && tagSignature),
    staleTime: 60 * 1000,
  });

  return (
    <section className={CARD_CLASS}>
      <ProfileSectionLabel
        className={cn(
          "flex items-center gap-1.5 sm:gap-2",
          SECTION_LABEL_CLASS,
        )}
      >
        <Link2 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        Related listings (shared tags)
      </ProfileSectionLabel>

      {!tagSignature ? (
        <p className={cn("mt-2 text-sm leading-relaxed", VALUE_MUTED_CLASS)}>
          Add tags to this listing (edit → Specifications) and use the same tags
          on other properties to see them linked here.
        </p>
      ) : isError ? (
        <div className="mt-3 space-y-2">
          <p className={cn("text-sm", VALUE_MUTED_CLASS)}>
            Couldn&apos;t load related listings. Check your connection and try
            again.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div
          className="mt-3 space-y-3"
          aria-busy="true"
          aria-label="Loading related listings"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
            <span>Loading related listings…</span>
          </div>
          <div className="flex gap-3 overflow-hidden pb-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex min-w-[220px] max-w-[260px] shrink-0 flex-col gap-2 rounded-xl border border-admin-card-border bg-muted/20 p-3"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-3 w-[60%]" />
                <Skeleton className="h-4 w-[40%]" />
              </div>
            ))}
          </div>
        </div>
      ) : relatedByTags.length === 0 ? (
        <p className={cn("mt-2 text-sm leading-relaxed", VALUE_MUTED_CLASS)}>
          No other listings share these tags yet. Add matching tags on other
          properties to connect them.
        </p>
      ) : (
        <div className="relative mt-3">
          {isFetching ? (
            <div className="pointer-events-none absolute right-0 top-0 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              <span className="sr-only">Updating</span>
            </div>
          ) : null}
          <div className="flex gap-3 overflow-x-auto pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:thin]">
            {relatedByTags.map((p) => (
              <Link
                key={p.id}
                href={`/admin/properties/${p.id}`}
                className="flex min-w-[220px] max-w-[260px] shrink-0 flex-col rounded-xl border border-admin-card-border bg-muted/20 p-3 transition-colors hover:border-amber-300/80 hover:bg-muted/40"
              >
                {p.cover_image_url ? (
                  <div className="mb-2 aspect-[16/10] w-full overflow-hidden rounded-lg border border-admin-card-border">
                    <img
                      src={p.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <p className="line-clamp-2 text-sm font-semibold text-foreground">
                  {p.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.listing_ref}
                  {p.city ? ` · ${p.city}` : ""}
                </p>
                <p className="mt-2 text-sm font-medium text-amber-900">
                  {formatPrice(Number(p.price))}
                </p>
                <Badge
                  variant="outline"
                  className="mt-2 w-fit text-[10px] capitalize"
                >
                  {p.status}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
