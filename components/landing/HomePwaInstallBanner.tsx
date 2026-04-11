"use client";

import Image from "next/image";
import { Download, Info, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  publicContentFrameClass,
  publicShellBackgroundColor,
} from "@/lib/constants/publicLayout";
import { CLIENT_PWA_DOWNLOAD, SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { usePwaInstall } from "@/components/landing/PwaInstallProvider";

function InstallDetailBlocks({
  isIos,
  showInstallButton,
}: {
  isIos: boolean;
  showInstallButton: boolean;
}) {
  return (
    <div className="space-y-1.5 text-sm leading-snug text-white/80">
      <p className="m-0">
        Add {SITE_NAME} to your home screen for a full-screen experience,
        quicker return visits, and an icon on your device — ideal on phones and
        tablets.
      </p>
      {isIos ? (
        <p className="m-0">
          Use the banner at the top of the screen, or open the{" "}
          <strong className="font-medium text-white">Share</strong> menu and
          choose{" "}
          <strong className="font-medium text-white">Add to Home Screen</strong>
          .
        </p>
      ) : null}
      {!isIos && !showInstallButton ? (
        <p className="m-0">
          <span className="text-white/95">Tip:</span> Look for{" "}
          <strong className="font-medium text-white/90">Install app</strong> or{" "}
          <strong className="font-medium text-white/90">
            Add to Home screen
          </strong>{" "}
          in your browser menu. Chrome or Edge on Android usually offers the
          prompt after you’ve used the site a bit.
        </p>
      ) : null}
    </div>
  );
}

const installSheetContentProps = {
  side: "bottom" as const,
  closeButton: "info" as const,
  closeButtonClassName:
    "text-white/80 hover:bg-white/12 hover:text-white [&_svg]:text-current",
  className: cn(
    "max-h-[min(85vh,520px)] overflow-y-auto rounded-t-2xl border-x-0 border-t border-white/15",
    "bg-[#1f1f1f] p-5 pb-8 text-white shadow-[0_-8px_40px_rgba(0,0,0,0.35)]",
  ),
};

export function HomePwaInstallBanner() {
  const {
    ready,
    isStandalone,
    installing,
    runInstall,
    isIos,
    showInstallButton,
  } = usePwaInstall();

  const onInstallClick = async () => {
    await runInstall();
  };

  if (!CLIENT_PWA_DOWNLOAD) return null;
  if (!ready || isStandalone) return null;

  const mobileHelperWhenNoPrompt = !showInstallButton
    ? isIos
      ? "Share → Add to Home Screen"
      : "Browser menu → Install or Add to Home screen"
    : null;

  return (
    <section
      style={{ backgroundColor: publicShellBackgroundColor }}
      className="mt-0 mb-4 pb-2 sm:mb-10 sm:pb-[max(1rem,env(safe-area-inset-bottom))] lg:mb-12"
      aria-label="Install our app"
    >
      <div className={publicContentFrameClass}>
        <Sheet>
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] sm:rounded-3xl",
              "bg-gradient-to-br from-[#1c1c1c] via-[#222] to-[#141414]",
            )}
          >
            <SheetTrigger asChild>
              <button
                type="button"
                className="absolute right-2.5 top-2.5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                aria-label="More about installing the app"
              >
                <Info
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  strokeWidth={2}
                  aria-hidden
                />
              </button>
            </SheetTrigger>

            <div
              className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-brand-gold/[0.07] blur-3xl sm:-right-8 sm:top-0 sm:h-72 sm:w-72"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-brand-gold/[0.04] blur-2xl"
              aria-hidden
            />

            {/* Mobile: single-row app mark + icon-only “Install” CTA (details in sheet) */}
            <div className="relative px-4 pb-4 pt-[3.25rem] lg:hidden">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white p-2",
                    "shadow-[0_2px_16px_rgba(0,0,0,0.35)] ring-1 ring-black/20",
                  )}
                >
                  <Image
                    src="/icons/icon-192.png"
                    alt=""
                    width={192}
                    height={192}
                    className="h-full w-full object-contain"
                    priority={false}
                  />
                </div>

                <div className="min-w-0 flex-1 pr-10">
                  {showInstallButton ? (
                    <Button
                      type="button"
                      disabled={installing}
                      onClick={onInstallClick}
                      className={cn(
                        "h-11 w-full min-w-0 rounded-full border-0 bg-brand-gold px-5 text-[15px] font-semibold tracking-tight text-brand-charcoal",
                        "shadow-[0_2px_0_0_rgba(0,0,0,0.12),0_8px_24px_-4px_rgba(0,0,0,0.45)]",
                        "hover:bg-brand-gold-hover focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]",
                        "disabled:opacity-70",
                      )}
                    >
                      <Download
                        className="h-[1.125rem] w-[1.125rem] shrink-0"
                        aria-hidden
                      />
                      {installing ? "Opening…" : "Install"}
                    </Button>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-heading text-[0.9375rem] font-semibold leading-tight text-white">
                        {SITE_NAME}
                      </p>
                      <p className="text-[12px] leading-snug text-white/65">
                        {mobileHelperWhenNoPrompt}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ——— Desktop ——— */}
            <div className="relative hidden p-5 pt-14 pb-6 sm:p-8 sm:pt-16 sm:pb-7 lg:block lg:px-10 lg:pt-11 lg:pb-7">
              <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-8 xl:gap-10">
                <div className="flex min-w-0 w-full flex-1 gap-4 sm:gap-5 lg:min-h-0">
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

                  <div className="flex min-w-0 w-full flex-1 flex-col gap-2 sm:gap-2.5 lg:justify-center">
                    <div className="flex items-center gap-2.5">
                      <Smartphone
                        className="h-5 w-5 shrink-0 text-brand-gold sm:h-6 sm:w-6"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <h2 className="font-heading text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
                        Install {SITE_NAME}
                      </h2>
                    </div>

                    <InstallDetailBlocks
                      isIos={isIos}
                      showInstallButton={showInstallButton}
                    />
                  </div>
                </div>

                {showInstallButton ? (
                  <div className="flex w-full shrink-0 flex-col justify-center border-t border-white/10 pt-5 sm:w-auto lg:w-auto lg:min-w-[12rem] lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0 xl:min-w-[14rem]">
                    <Button
                      type="button"
                      size="lg"
                      disabled={installing}
                      onClick={onInstallClick}
                      className={cn(
                        "h-12 w-full min-h-[48px] rounded-xl border-0 bg-brand-gold px-8 text-[15px] font-semibold text-brand-charcoal shadow-md",
                        "hover:bg-brand-gold-hover focus-visible:ring-brand-gold lg:min-w-[220px]",
                      )}
                    >
                      <Download className="h-5 w-5" aria-hidden />
                      {installing ? "Opening…" : "Install"}
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <SheetContent {...installSheetContentProps}>
            <SheetHeader className="space-y-1 pb-2 text-left">
              <SheetTitle className="font-heading text-lg text-white">
                About installing
              </SheetTitle>
            </SheetHeader>
            <InstallDetailBlocks
              isIos={isIos}
              showInstallButton={showInstallButton}
            />
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
