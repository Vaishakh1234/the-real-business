"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Download, Share2, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

const DISMISS_STORAGE_KEY = "trb-pwa-install-banner-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (typeof window === "undefined") return true;
  const mq = window.matchMedia("(display-mode: standalone)");
  if (mq.matches) return true;
  return Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone,
  );
}

function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

export function HomePwaInstallBanner() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_STORAGE_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (dismissed || isStandalone()) {
      setReady(true);
      setVisible(false);
      return;
    }

    setVisible(true);
    setReady(true);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* non-fatal — banner still shows manual instructions */
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  const onInstallClick = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch {
      /* ignore */
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  };

  if (!ready || !visible) return null;

  const ios = isIosDevice();

  return (
    <section
      className="mb-6 border-t border-neutral-200/80 bg-gradient-to-b from-[#faf9f7] to-[#f3f1ed] pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 sm:mb-8 sm:pt-8"
      aria-labelledby="pwa-install-heading"
    >
      <div className={cn(publicContentFrameClass, "max-w-[1680px]")}>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:rounded-3xl",
            "bg-gradient-to-br from-brand-charcoal via-[#252525] to-[#1a1a1a]",
          )}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-brand-gold/10 blur-3xl sm:-right-8 sm:top-0 sm:h-72 sm:w-72"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-brand-gold/5 blur-2xl"
            aria-hidden
          />

          <div className="relative flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-8 lg:p-10">
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:right-4 sm:top-4"
              aria-label="Dismiss install app banner"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            <div className="flex shrink-0 items-start gap-4 sm:items-center sm:gap-5 pr-10 sm:pr-0">
              <div
                className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white p-2.5 shadow-lg ring-2 ring-brand-gold/25",
                  "sm:h-[4.5rem] sm:w-[4.5rem] sm:p-3",
                )}
              >
                <Image
                  src="/icons/icon-192.png"
                  alt=""
                  width={192}
                  height={192}
                  className="h-full w-full max-h-full max-w-full object-contain object-center"
                  priority={false}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Smartphone
                    className="h-5 w-5 shrink-0 text-brand-gold sm:h-6 sm:w-6"
                    aria-hidden
                  />
                  <h2
                    id="pwa-install-heading"
                    className="font-heading text-xl font-bold leading-tight text-white sm:text-2xl"
                  >
                    Install our app
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
                  Add {SITE_NAME} to your home screen for a full-screen
                  experience, quicker return visits, and an icon on your device
                  — ideal on phones and tablets.
                </p>
                {ios && (
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/55 sm:text-sm">
                    <Share2
                      className="inline h-4 w-4 shrink-0 text-brand-gold/90"
                      aria-hidden
                    />
                    <span>
                      Tap{" "}
                      <strong className="font-semibold text-white/80">
                        Share
                      </strong>
                      , then{" "}
                      <strong className="font-semibold text-white/80">
                        Add to Home Screen
                      </strong>
                      .
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:min-w-[200px] sm:items-end sm:self-center">
              {!ios && deferredPrompt && (
                <Button
                  type="button"
                  size="lg"
                  disabled={installing}
                  onClick={onInstallClick}
                  className={cn(
                    "h-12 w-full min-h-[48px] rounded-xl border-0 bg-brand-gold px-6 text-[15px] font-semibold text-brand-charcoal shadow-md",
                    "hover:bg-brand-gold-hover focus-visible:ring-brand-gold sm:w-auto sm:min-w-[200px]",
                  )}
                >
                  <Download className="h-5 w-5" aria-hidden />
                  {installing ? "Opening…" : "Install app"}
                </Button>
              )}
              {!ios && !deferredPrompt && (
                <p className="text-center text-xs leading-snug text-white/55 sm:text-right sm:text-sm">
                  Look for{" "}
                  <strong className="text-white/75">Install app</strong> or{" "}
                  <strong className="text-white/75">Add to Home screen</strong>{" "}
                  in your browser menu — or try Chrome or Edge on mobile.
                </p>
              )}
              {ios && (
                <p className="text-center text-xs text-white/50 sm:text-right sm:text-sm">
                  Safari · iPhone &amp; iPad
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
