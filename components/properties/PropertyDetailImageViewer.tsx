"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { isRemoteImageOptimizedUrl } from "@/lib/public-image-hosts";
import { PropertyImage } from "@/components/ui/PropertyImage";

export type PropertyDetailImageViewerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  title: string;
  index: number;
  onIndexChange: (index: number) => void;
};

const SWIPE_PX = 56;

export function PropertyDetailImageViewer({
  open,
  onOpenChange,
  images,
  title,
  index,
  onIndexChange,
}: PropertyDetailImageViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [announce, setAnnounce] = useState("");

  const len = images.length;
  const safeIndex =
    len === 0 ? 0 : Math.min(Math.max(0, index), Math.max(0, len - 1));

  const goNext = useCallback(() => {
    if (len <= 1) return;
    onIndexChange((safeIndex + 1) % len);
  }, [len, onIndexChange, safeIndex]);

  const goPrev = useCallback(() => {
    if (len <= 1) return;
    onIndexChange((safeIndex - 1 + len) % len);
  }, [len, onIndexChange, safeIndex]);

  useEffect(() => {
    if (!open || len === 0) return;
    if (index >= len) onIndexChange(len - 1);
  }, [open, len, index, onIndexChange]);

  useEffect(() => {
    if (!open || len === 0) return;
    setAnnounce(`Photo ${safeIndex + 1} of ${len}`);
  }, [open, len, safeIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goNext, goPrev]);

  const onContentKeyDown = (e: React.KeyboardEvent) => {
    if (len <= 1) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };

  if (len === 0) return null;

  const url = images[safeIndex];
  const alt = `${title} — photo ${safeIndex + 1} of ${len}`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            closeRef.current?.focus();
          }}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onKeyDown={onContentKeyDown}
          className={cn(
            "fixed inset-0 z-[100] flex max-h-[100dvh] flex-col border-0 bg-neutral-950/92 p-0 shadow-none outline-none backdrop-blur-[3px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {title} — full screen photos
          </DialogPrimitive.Title>
          <span className="sr-only" role="status" aria-live="polite">
            {announce}
          </span>

          <header
            className="flex shrink-0 cursor-default items-center justify-end gap-2 px-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-4 sm:pt-4"
            onClick={() => onOpenChange(false)}
          >
            <p
              className="mr-auto hidden truncate pl-1 text-left text-sm font-medium text-white/90 sm:block sm:max-w-[min(100%,28rem)]"
              aria-hidden
              onClick={(e) => e.stopPropagation()}
            >
              {title}
            </p>
            <p
              className="mr-auto tabular-nums text-sm font-semibold text-white/85 sm:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {safeIndex + 1} / {len}
            </p>
            <DialogPrimitive.Close asChild>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close gallery"
                onClick={(e) => e.stopPropagation()}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 sm:size-10"
              >
                <X className="size-5" strokeWidth={2.25} aria-hidden />
              </button>
            </DialogPrimitive.Close>
          </header>

          <div
            className="flex min-h-0 flex-1 cursor-default items-center justify-center gap-1 px-1 sm:gap-2 sm:px-4"
            onClick={() => onOpenChange(false)}
          >
            {len > 1 ? (
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-md transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 sm:size-12"
              >
                <ChevronLeft className="size-7 sm:size-8" aria-hidden />
              </button>
            ) : (
              <span className="w-2 shrink-0 sm:w-4" aria-hidden />
            )}

            <div
              className="relative flex h-[min(calc(100dvh-9rem),85dvh)] w-full max-w-[min(96vw,1400px)] items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                const start = touchStartX.current;
                touchStartX.current = null;
                if (start == null) return;
                const end = e.changedTouches[0]?.clientX;
                if (end == null) return;
                const dx = end - start;
                if (dx > SWIPE_PX) goPrev();
                else if (dx < -SWIPE_PX) goNext();
              }}
            >
              <PropertyImage
                src={url}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                unoptimized={!isRemoteImageOptimizedUrl(url)}
              />
            </div>

            {len > 1 ? (
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-md transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 sm:size-12"
              >
                <ChevronRight className="size-7 sm:size-8" aria-hidden />
              </button>
            ) : (
              <span className="w-2 shrink-0 sm:w-4" aria-hidden />
            )}
          </div>

          <footer
            className="shrink-0 cursor-default px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 sm:px-4 sm:pb-4 sm:pt-2"
            onClick={() => onOpenChange(false)}
          >
            <div
              className="flex flex-col items-center gap-2 sm:gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="hidden tabular-nums text-sm font-medium text-white/80 sm:block">
                {safeIndex + 1} / {len}
              </p>
              {len > 1 ? (
                <div
                  className="flex max-w-full gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
                  role="tablist"
                  aria-label="Gallery thumbnails"
                >
                  {images.map((thumbUrl, i) => {
                    const active = i === safeIndex;
                    return (
                      <button
                        key={`${thumbUrl}-${i}`}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`Show photo ${i + 1}`}
                        tabIndex={active ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onIndexChange(i);
                        }}
                        className={cn(
                          "relative h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-opacity sm:h-14 sm:w-[5.5rem]",
                          active
                            ? "border-brand-gold opacity-100 ring-2 ring-brand-gold/40"
                            : "border-white/20 opacity-70 hover:opacity-100",
                        )}
                      >
                        <PropertyImage
                          src={thumbUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="120px"
                          unoptimized={!isRemoteImageOptimizedUrl(thumbUrl)}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
