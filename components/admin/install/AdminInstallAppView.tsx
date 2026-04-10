"use client";

import type { ReactNode } from "react";
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
import { usePwaInstall } from "@/components/landing/PwaInstallProvider";
import {
  PageHeader,
  type BreadcrumbItem,
} from "@/components/admin/layout/PageHeader";
import { SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

function InstructionCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-admin-card-border bg-white/90 p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-muted/50 ring-1 ring-brand-blue/15">
          <Icon className="h-5 w-5 text-brand-blue" strokeWidth={2} />
        </div>
        <div className="min-w-0 space-y-2">
          <h2 className="font-semibold text-[#1a1a1a] text-base sm:text-lg">
            {title}
          </h2>
          <div className="text-muted-foreground text-sm leading-relaxed sm:text-[15px]">
            {children}
          </div>
        </div>
      </div>
    </div>
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
    showIosInstallHint,
  } = usePwaInstall();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Install app" },
  ];

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
                className="shrink-0 rounded-xl bg-emerald-700 hover:bg-emerald-800"
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
                  . The detailed steps for desktop and mobile are below.
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
                      Chrome, Edge, or Opera can add this site as an app. After
                      installing, sign in and bookmark{" "}
                      <strong className="font-medium text-foreground/90">
                        Admin
                      </strong>{" "}
                      or open the{" "}
                      <strong className="font-medium text-foreground/90">
                        Admin
                      </strong>{" "}
                      shortcut if your browser shows it.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    className="h-12 shrink-0 rounded-xl bg-brand-blue px-6 text-brand-blue-foreground shadow-md hover:bg-brand-blue-hover"
                    disabled={installing}
                    onClick={() => void runInstall()}
                  >
                    {installing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Installing…
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Install app
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}

            {showIosInstallHint ? (
              <InstructionCard icon={Share2} title="iPhone & iPad (Safari)">
                <p className="m-0">
                  Tap the{" "}
                  <strong className="font-medium text-foreground">Share</strong>{" "}
                  button, then{" "}
                  <strong className="font-medium text-foreground">
                    Add to Home Screen
                  </strong>
                  . Open the icon and go to{" "}
                  <Link
                    href="/admin/login"
                    className="font-medium text-brand-blue underline-offset-2 hover:underline"
                  >
                    Admin login
                  </Link>{" "}
                  to use the panel.
                </p>
              </InstructionCard>
            ) : null}

            <InstructionCard icon={Monitor} title="Desktop (Chrome or Edge)">
              <ol className="m-0 list-decimal space-y-2 pl-5">
                <li>
                  Open this site in Chrome or Edge while signed in to admin (or
                  sign in after install).
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
                  Launch the installed window and go to{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    /admin/dashboard
                  </code>{" "}
                  if it opens on the marketing home page first.
                </li>
              </ol>
            </InstructionCard>

            <InstructionCard icon={Smartphone} title="Android (Chrome)">
              <ol className="m-0 list-decimal space-y-2 pl-5">
                <li>
                  Open this website in Chrome and go to{" "}
                  <strong className="font-medium text-foreground">Admin</strong>{" "}
                  (or add{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    /admin
                  </code>{" "}
                  to the address bar).
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
                  Open the home-screen icon; you&apos;ll stay signed in if your
                  session is still valid.
                </li>
              </ol>
            </InstructionCard>

            {!showIosInstallHint && !isIos ? (
              <InstructionCard icon={Share2} title="iPhone & iPad (Safari)">
                <p className="m-0">
                  In Safari, tap{" "}
                  <strong className="font-medium text-foreground">Share</strong>{" "}
                  →{" "}
                  <strong className="font-medium text-foreground">
                    Add to Home Screen
                  </strong>
                  . iOS does not use the same one-tap install prompt as Chrome on
                  desktop.
                </p>
              </InstructionCard>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
