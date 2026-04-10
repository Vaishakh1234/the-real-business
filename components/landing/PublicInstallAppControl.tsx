"use client";

import { usePathname } from "next/navigation";
import { Download, Loader2, Share2, Smartphone } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { usePwaInstall } from "@/components/landing/PwaInstallProvider";

type Props = {
  /** When true, header is transparent over the hero (light icon treatment). */
  overlayNav: boolean;
};

/**
 * `#install-btn` is always in the DOM when the app can be installed or explained
 * (not standalone). Native install runs only when `beforeinstallprompt` was
 * captured; otherwise a popover explains iOS Share / browser menu install.
 */
export function PublicInstallAppControl({ overlayNav }: Props) {
  const pathname = usePathname();
  const {
    ready,
    isStandalone,
    showInstallButton,
    installing,
    runInstall,
    isIos,
  } = usePwaInstall();

  if (!ready || isStandalone) return null;

  /** Home already has a large banner — keep the header control compact (icon-first). */
  const compactNav = pathname === "/";

  const shellClass = cn(
    "relative inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border transition-[background-color,box-shadow,transform] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-[0.98]",
    compactNav
      ? "min-w-[44px] gap-2.5 px-2 sm:px-3.5"
      : "gap-2.5 px-3.5 sm:px-4",
    overlayNav
      ? "border-white/35 bg-white/15 text-white shadow-sm hover:bg-white/22 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent"
      : "border-neutral-200 bg-neutral-100 text-brand-charcoal shadow-sm hover:bg-neutral-200/90 focus-visible:ring-offset-2",
  );

  const label = installing ? "Installing app" : "Install app";

  if (showInstallButton) {
    return (
      <button
        id="install-btn"
        type="button"
        className={cn(shellClass, "text-sm font-semibold tracking-tight")}
        disabled={installing}
        onClick={() => {
          void runInstall();
        }}
        aria-label={label}
      >
        {installing ? (
          <Loader2
            className="h-4 w-4 shrink-0 animate-spin"
            strokeWidth={2}
            aria-hidden
          />
        ) : (
          <Download
            className="h-4 w-4 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem]"
            strokeWidth={2}
            aria-hidden
          />
        )}
        <span
          className={cn(
            "font-semibold",
            compactNav ? "hidden xs:inline" : "hidden min-[380px]:inline",
          )}
        >
          {installing ? "Installing…" : "Install app"}
        </span>
      </button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          id="install-btn"
          type="button"
          className={shellClass}
          aria-label={`${label} — how to add ${SITE_NAME}`}
        >
          <Smartphone
            className="h-5 w-5 shrink-0"
            strokeWidth={2}
            aria-hidden
          />
          <span
            className={cn(
              "text-sm font-semibold tracking-tight",
              compactNav ? "hidden sm:inline" : "hidden min-[380px]:inline",
            )}
          >
            Install
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(calc(100vw-2rem),20rem)] rounded-xl border-border/80 p-4 shadow-lg"
      >
        <div className="flex gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              "bg-brand-gold/15 text-brand-gold",
            )}
          >
            <Download className="h-5 w-5" strokeWidth={2} aria-hidden />
          </div>
          <div className="min-w-0 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <div className="flex items-center gap-2">
              <p className="min-w-0 font-heading font-semibold text-brand-charcoal">
                Add {SITE_NAME}
              </p>
              {isIos ? (
                <Share2
                  className="h-4 w-4 shrink-0 text-brand-gold sm:h-5 sm:w-5"
                  strokeWidth={2}
                  aria-hidden
                />
              ) : null}
            </div>
            {isIos ? (
              <p>
                Tap{" "}
                <strong className="font-semibold text-foreground">Share</strong>
                , then{" "}
                <strong className="font-semibold text-foreground">
                  Add to Home Screen
                </strong>
                .
              </p>
            ) : (
              <p>
                Use your browser menu:{" "}
                <strong className="text-foreground/90">Install app</strong> or{" "}
                <strong className="text-foreground/90">
                  Add to Home screen
                </strong>
                . On Chrome (desktop or Android), the install icon may appear
                after you use the site — keep browsing, then check the address
                bar or this button again.
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
