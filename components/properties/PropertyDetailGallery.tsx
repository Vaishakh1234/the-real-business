"use client";

import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isRemoteImageOptimizedUrl } from "@/lib/public-image-hosts";
import { PropertyImage } from "@/components/ui/PropertyImage";

const AUTO_ADVANCE_MS = 5000;

export function PropertyDetailGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  const [galleryHovered, setGalleryHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  /** Bumps when the user picks a slide so the autoplay interval restarts from now. */
  const [autoplayEpoch, setAutoplayEpoch] = useState(0);
  const reduceMotion = useReducedMotion();

  const imagesKey = images.length ? images.join("\0") : "";

  useEffect(() => {
    setSelected(0);
  }, [imagesKey]);

  useEffect(() => {
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const safeIndex = Math.min(selected, Math.max(0, images.length - 1));
  const current = images[safeIndex] ?? "";

  const touchUser = useCallback(() => {
    setAutoplayEpoch((e) => e + 1);
  }, []);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    setSelected((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    setSelected((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const autoplayActive =
    images.length > 1 && !reduceMotion && !galleryHovered && pageVisible;

  useEffect(() => {
    if (!autoplayActive) return;
    const id = window.setInterval(() => {
      setSelected((i) => (i + 1) % images.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [autoplayActive, images.length, imagesKey, autoplayEpoch]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (images.length <= 1) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        touchUser();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        touchUser();
        goPrev();
      }
    },
    [images.length, goNext, goPrev, touchUser],
  );

  if (images.length === 0) {
    return (
      <div
        className="flex aspect-[16/10] min-h-[220px] max-h-[min(52vh,520px)] w-full items-center justify-center rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:min-h-[240px] sm:rounded-2xl sm:p-4 md:p-5 sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]"
        role="img"
        aria-label={`No photos for ${title}`}
      >
        <Building2 className="h-16 w-16 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div
      className="space-y-2 sm:space-y-3"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setGalleryHovered(true)}
      onMouseLeave={() => setGalleryHovered(false)}
    >
      <div
        className="relative aspect-[16/10] min-h-[220px] max-h-[min(52vh,520px)] w-full overflow-hidden rounded-xl border border-neutral-200/90 bg-white p-2 shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:min-h-[240px] sm:rounded-2xl sm:p-3 md:p-4 sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Property photos"
        tabIndex={0}
      >
        <div className="relative h-full min-h-[168px] w-full overflow-hidden rounded-lg sm:min-h-[180px] sm:rounded-xl">
          {current ? (
            <PropertyImage
              src={current}
              alt={`${title} — photo ${safeIndex + 1} of ${images.length}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
              unoptimized={!isRemoteImageOptimizedUrl(current)}
            />
          ) : null}
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => {
                  touchUser();
                  goPrev();
                }}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-md backdrop-blur-[2px] transition-colors hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:left-3 sm:size-11"
              >
                <ChevronLeft
                  className="size-6 sm:size-7"
                  aria-hidden
                  strokeWidth={2.25}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  touchUser();
                  goNext();
                }}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-md backdrop-blur-[2px] transition-colors hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:right-3 sm:size-11"
              >
                <ChevronRight
                  className="size-6 sm:size-7"
                  aria-hidden
                  strokeWidth={2.25}
                />
              </button>
              <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white sm:bottom-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-xs">
                {safeIndex + 1} / {images.length}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {images.length > 1 ? (
        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 sm:pb-1 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Photo thumbnails"
        >
          {images.map((url, i) => {
            const isActive = i === safeIndex;
            return (
              <button
                key={`${url}-${i}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "true" : undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  touchUser();
                  setSelected(i);
                }}
                className={cn(
                  "relative h-14 w-[4.25rem] shrink-0 overflow-hidden rounded-md border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2b4b] focus-visible:ring-offset-2 sm:h-[4.5rem] sm:w-[7rem] sm:rounded-lg",
                  isActive
                    ? "border-[#1a2b4b] opacity-100 shadow-sm"
                    : "border-neutral-200/80 opacity-85 hover:opacity-100",
                )}
              >
                <PropertyImage
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="112px"
                  unoptimized={!isRemoteImageOptimizedUrl(url)}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
