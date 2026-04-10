"use client";

import { useEffect, useState } from "react";
import { Share2, X } from "lucide-react";
import { usePwaInstall } from "@/components/landing/PwaInstallProvider";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "pwa-ios-install-hint-dismissed";

/**
 * iOS Safari does not fire `beforeinstallprompt`. Shows a slim fixed strip with
 * Share → Add to Home Screen instructions below the main header.
 */
export function IosInstallHintBanner() {
  const { showIosInstallHint } = usePwaInstall();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (!showIosInstallHint || dismissed) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed right-0 left-0 z-[48] border-b border-amber-200/80 bg-amber-50/95 px-3 py-2.5 text-center text-[13px] leading-snug text-amber-950 shadow-sm backdrop-blur-sm sm:px-4 sm:text-sm",
        "top-[calc(env(safe-area-inset-top,0px)+4rem)] md:top-[calc(env(safe-area-inset-top,0px)+5rem)]",
      )}
    >
      <div className="relative mx-auto flex max-w-3xl items-start justify-center gap-2 pr-8 sm:items-center sm:gap-3 sm:pr-9">
        <Share2
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 sm:mt-0"
          aria-hidden
        />
        <p className="min-w-0 text-pretty">
          Tap the <strong className="font-semibold">Share</strong> icon, then
          select <strong className="font-semibold">Add to Home Screen</strong>{" "}
          to install this app.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-0 top-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-amber-800/70 transition-colors hover:bg-amber-200/60 hover:text-amber-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}
