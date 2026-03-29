"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronLeft, Heart, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DirectoryPropertyListingCard,
  PropertyListingCardSkeleton,
} from "@/components/properties/PropertyListingCard";
import { usePublicPropertiesByIds } from "@/hooks/useProperties";
import { useWishlist } from "@/hooks/useWishlist";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { cn } from "@/lib/utils";
import type { PropertyWithRelations } from "@/types";

export function WishlistPageClient() {
  const router = useRouter();
  const { ids, count, removeMany, clear } = useWishlist();
  const idList = useMemo(() => [...ids], [ids]);
  const { data, isLoading, isError, error, refetch } =
    usePublicPropertiesByIds(idList);

  const fetchedById = useMemo(() => {
    const m = new Map<string, PropertyWithRelations>();
    for (const p of data ?? []) m.set(p.id, p);
    return m;
  }, [data]);

  const ordered = useMemo(
    () =>
      idList
        .map((id) => fetchedById.get(id))
        .filter((p): p is PropertyWithRelations => p != null),
    [idList, fetchedById],
  );

  const unavailableIds = useMemo(
    () => idList.filter((id) => !fetchedById.has(id)),
    [idList, fetchedById],
  );

  const [clearAllOpen, setClearAllOpen] = useState(false);

  return (
    <div className="min-h-[50vh] bg-muted/40 pb-[max(4rem,calc(4rem+env(safe-area-inset-bottom)))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-16 md:bg-muted/50 md:pb-20 md:pt-8">
      <div className={cn(publicContentFrameClass, "flex flex-col gap-6 sm:gap-8")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  window.history.length > 1
                ) {
                  router.back();
                } else {
                  router.push("/properties");
                }
              }}
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-[#1a2b4b] shadow-sm active:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold md:mt-1"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
                Saved listings
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-[15px]">
                Properties you saved on this device. Sign in is not required.
              </p>
            </div>
          </div>
          {count > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="shrink-0 self-start border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={() => setClearAllOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden />
              Clear all
            </Button>
          ) : null}
        </div>

        {count === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-6 py-14 text-center shadow-sm sm:py-20">
            <Heart
              className="mb-4 h-14 w-14 text-neutral-300"
              strokeWidth={1.25}
              aria-hidden
            />
            <p className="max-w-md text-base font-medium text-brand-charcoal sm:text-lg">
              No saved listings yet
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Tap the heart on any listing to save it here. Your list stays on
              this browser only.
            </p>
            <Button
              asChild
              className="mt-8 rounded-full bg-brand-charcoal px-8 text-white hover:bg-brand-charcoal/90"
            >
              <Link href="/properties">Browse properties</Link>
            </Button>
          </div>
        ) : null}

        {count > 0 && isLoading ? (
          <div className="flex min-w-0 flex-col gap-5">
            {idList.map((id) => (
              <PropertyListingCardSkeleton key={id} variant="directory" />
            ))}
          </div>
        ) : null}

        {count > 0 && isError ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-4 text-sm text-red-900"
            role="alert"
          >
            <p className="font-medium">Could not load saved listings</p>
            <p className="mt-1 opacity-90">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 border-red-300"
              onClick={() => void refetch()}
            >
              Try again
            </Button>
          </div>
        ) : null}

        {count > 0 && !isLoading && !isError && ordered.length > 0 ? (
          <div className="flex min-w-0 flex-col gap-5">
            {ordered.map((property, index) => (
              <DirectoryPropertyListingCard
                key={property.id}
                property={property}
                index={index}
              />
            ))}
          </div>
        ) : null}

        {count > 0 && !isLoading && !isError && unavailableIds.length > 0 ? (
          <div className="rounded-xl border border-amber-200/90 bg-amber-50/60 px-4 py-4 sm:px-5">
            <p className="text-sm font-semibold text-amber-950">
              No longer available ({unavailableIds.length})
            </p>
            <p className="mt-1 text-sm text-amber-900/85">
              These saved references are not active listings anymore. Remove
              them to tidy your list.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => removeMany(unavailableIds)}
            >
              Remove from saved
            </Button>
          </div>
        ) : null}
      </div>

      <AlertDialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all saved listings?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes every property from your saved list on this device.
              You cannot undo this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-600/90"
              onClick={() => {
                clear();
                setClearAllOpen(false);
              }}
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
