"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Download,
  Loader2,
  Monitor,
  Share2,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePwaInstall } from "@/components/landing/PwaInstallProvider";
import {
  PageHeader,
  type BreadcrumbItem,
} from "@/components/admin/layout/PageHeader";
import { ADMIN_PWA_DOWNLOAD, SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

function InstallPlatformAccordionTrigger({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <AccordionTrigger
      className={cn(
        "gap-3 py-4 text-left hover:no-underline sm:py-5 [&>svg]:shrink-0",
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-muted/50 ring-1 ring-brand-blue/15">
          <Icon className="h-5 w-5 text-brand-blue" strokeWidth={2} />
        </span>
        <span className="font-semibold text-[#1a1a1a] text-base sm:text-lg">
          {label}
        </span>
      </span>
    </AccordionTrigger>
  );
}

export function AdminInstallAppView() {
  const {
    ready,
    isStandalone,
    installing,
    runInstall,
    isIos,
    showInstallButton,
  } = usePwaInstall();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Install app" },
  ];

  if (!ADMIN_PWA_DOWNLOAD) {
    return (
      <div className="flex min-h-full flex-col bg-gradient-to-b from-admin-main-bg via-white to-brand-gold-muted/25 pb-[env(safe-area-inset-bottom)]">
        <PageHeader
          title="Install admin app"
          titleClassName="text-xl sm:text-2xl lg:text-3xl"
          subtitleClassName="text-sm leading-snug sm:text-[15px] sm:leading-snug"
          subtitle="PWA install for admin is turned off in site settings."
          breadcrumbs={breadcrumbs}
        />
        <div className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 sm:px-0">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Set <span className="font-medium text-foreground">ADMIN_PWA_DOWNLOAD</span> to{" "}
            <span className="font-medium text-foreground">true</span> in site constants to show install
            steps and the sidebar link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-admin-main-bg via-white to-brand-gold-muted/25 pb-[env(safe-area-inset-bottom)]">
      <PageHeader
        title="Install admin app"
        titleClassName="text-xl sm:text-2xl lg:text-3xl"
        subtitleClassName="text-sm leading-snug sm:text-[15px] sm:leading-snug"
        subtitle={`Install ${SITE_NAME} once, then open Admin, Leads, and Notifications from your home screen or app list — works in the browser and as an installed app.`}
        breadcrumbs={breadcrumbs}
      />

      <div className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-0 pt-2 sm:space-y-5 sm:pt-4">
        {!ready ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-brand-gold" />
            Checking install options…
          </div>
        ) : isStandalone ? (
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-5 shadow-sm sm:px-6 sm:py-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-semibold text-[#14532d] text-base">
                    You&apos;re using the installed app
                  </p>
                  <p className="mt-1 text-emerald-900/80 text-sm leading-relaxed">
                    Admin runs in standalone mode. Use the dashboard and bottom
                    nav as usual.
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="h-8 shrink-0 rounded-lg bg-emerald-700 px-3 text-xs hover:bg-emerald-800"
              >
                <Link href="/admin/dashboard">Open dashboard</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!showInstallButton && !isIos ? (
              <div className="rounded-2xl border border-amber-200/90 bg-amber-50/95 px-4 py-4 shadow-sm sm:px-5 sm:py-5">
                <p className="m-0 text-[#713f12] text-sm leading-relaxed sm:text-[15px]">
                  <span className="font-semibold">On the web, </span>
                  the browser doesn&apos;t always show an{" "}
                  <strong className="font-medium">Install</strong> button right
                  away. In{" "}
                  <strong className="font-medium">Chrome</strong> or{" "}
                  <strong className="font-medium">Edge</strong>, check the
                  address bar for an install icon, or open the menu (⋮) →{" "}
                  <strong className="font-medium">Install app</strong> /{" "}
                  <strong className="font-medium">
                    Apps → Install this site as an app
                  </strong>
                  . Expand a section below for your device.
                </p>
              </div>
            ) : null}

            {showInstallButton ? (
              <div className="rounded-2xl border border-brand-blue/25 bg-gradient-to-br from-brand-blue-muted/50 to-white px-4 py-5 shadow-md sm:px-6 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1a1a1a] text-base sm:text-lg">
                      Install from your browser
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
                      Chrome, Edge, or Opera can add this site as an app. Install
                      from this page while you&apos;re signed in to Admin — the
                      installed app opens the Admin dashboard directly.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 shrink-0 rounded-lg bg-brand-blue px-4 text-sm text-brand-blue-foreground shadow-md hover:bg-brand-blue-hover"
                    disabled={installing}
                    onClick={() => void runInstall()}
                  >
                    {installing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Installing…
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Install app
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}

            <Accordion
              type="single"
              collapsible
              defaultValue="desktop"
              className="rounded-2xl border border-admin-card-border bg-white/90 px-3 shadow-sm sm:px-4"
            >
              <AccordionItem
                value="desktop"
                className="border-admin-card-border last:border-b-0"
              >
                <InstallPlatformAccordionTrigger
                  icon={Monitor}
                  label="Desktop (Chrome or Edge)"
                />
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed sm:text-[15px]">
                  <ol className="m-0 list-decimal space-y-2 pl-5">
                    <li>
                      Open this site in Chrome or Edge while signed in to Admin
                      (this install page is ideal).
                    </li>
                    <li>
                      Use the install icon in the address bar, or the menu:{" "}
                      <strong className="font-medium text-foreground">
                        ⋮ → Install {SITE_NAME}…
                      </strong>{" "}
                      /{" "}
                      <strong className="font-medium text-foreground">
                        Apps → Install this site as an app
                      </strong>
                      .
                    </li>
                    <li>
                      Launch the installed window — it opens the Admin dashboard
                      directly because you installed while signed in.
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="android"
                className="border-admin-card-border last:border-b-0"
              >
                <InstallPlatformAccordionTrigger
                  icon={Smartphone}
                  label="Android (Chrome)"
                />
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed sm:text-[15px]">
                  <ol className="m-0 list-decimal space-y-2 pl-5">
                    <li>
                      In Chrome, open this install page while signed in to Admin
                      (or navigate to{" "}
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        /admin/install-app
                      </code>
                      ).
                    </li>
                    <li>
                      Tap the menu (⋮) →{" "}
                      <strong className="font-medium text-foreground">
                        Add to Home screen
                      </strong>{" "}
                      or{" "}
                      <strong className="font-medium text-foreground">
                        Install app
                      </strong>
                      .
                    </li>
                    <li>
                      Open the home-screen icon — it launches the Admin dashboard
                      when you installed while signed in. You&apos;ll stay signed
                      in if your session is still valid.
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="ios"
                className="border-admin-card-border border-b-0"
              >
                <InstallPlatformAccordionTrigger
                  icon={Share2}
                  label="iPhone & iPad (Safari)"
                />
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed sm:text-[15px]">
                  <p className="m-0">
                    Stay on this page while signed in to Admin. In Safari, tap{" "}
                    <strong className="font-medium text-foreground">Share</strong>{" "}
                    →{" "}
                    <strong className="font-medium text-foreground">
                      Add to Home Screen
                    </strong>
                    . The home-screen icon opens Admin; if your session expired,
                    use{" "}
                    <Link
                      href="/admin/login"
                      className="font-medium text-brand-blue underline-offset-2 hover:underline"
                    >
                      Admin login
                    </Link>
                    . iOS does not use the same one-tap install prompt as Chrome
                    on desktop.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </div>
    </div>
  );
}
