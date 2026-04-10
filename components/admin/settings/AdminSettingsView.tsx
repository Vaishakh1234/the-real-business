"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  ChevronDown,
  Loader2,
  Monitor,
  PlusSquare,
  Share2,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAdminLeadPush } from "@/hooks/useAdminLeadPush";
import {
  isStandalonePwa,
  subscribeStandalonePwaChange,
} from "@/lib/pwa-install";
import { isAndroidChrome, isIOSDevice } from "@/lib/push/platform";
import { safeClientErrorToastMessage } from "@/lib/safe-client-error-message";
import { cn } from "@/lib/utils";
import { LeadAlertsGuideDialog } from "@/components/admin/settings/LeadAlertsGuideDialog";

export type AdminSettingsVariant = "page" | "overlay";

type AdminSettingsViewProps = {
  variant?: AdminSettingsVariant;
};

export function AdminSettingsView({
  variant = "page",
}: AdminSettingsViewProps) {
  const isOverlay = variant === "overlay";
  const {
    settings,
    settingsError,
    vapidConfigured,
    pushActive,
    loading,
    busy,
    supported,
    enablePush,
    disablePush,
    patchSettings,
    patching,
  } = useAdminLeadPush();

  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(isStandalonePwa());
    return subscribeStandalonePwaChange(() => {
      setStandalone(isStandalonePwa());
    });
  }, []);

  const ios = typeof window !== "undefined" && isIOSDevice();
  const android = typeof window !== "undefined" && isAndroidChrome();

  async function onEnable() {
    try {
      await enablePush();
      toast.success("Lead alerts are on for this device.");
    } catch (e) {
      if (e instanceof Error && e.message === "NOTIFICATION_DENIED") {
        toast.error(
          "Notifications blocked. Enable them in system settings for this browser.",
        );
        return;
      }
      console.error(e);
      toast.error(safeClientErrorToastMessage(e));
    }
  }

  async function onDisable() {
    try {
      await disablePush();
      toast.success("Lead alerts turned off on this device.");
    } catch (e) {
      console.error(e);
      toast.error(safeClientErrorToastMessage(e));
    }
  }

  const cardShell =
    "overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70";

  const tipSection = (
    <section className={cn(cardShell)}>
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue shadow-sm ring-1 ring-brand-blue/20"
            aria-hidden
          >
            <Smartphone className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="font-semibold text-foreground tracking-tight">
              Devices & browsers
            </h3>
            <p className="text-muted-foreground text-sm leading-snug">
              {ios
                ? "On iPhone and iPad, web push only works when you open the admin from a home-screen shortcut."
                : android
                  ? "On Android, Chrome can show lead alerts from this browser."
                  : "Choose the setup that matches how you open the admin."}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {ios ? (
          <div className="space-y-4">
            <ol className="space-y-4">
              <li className="flex gap-3 sm:gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm"
                  aria-hidden
                >
                  1
                </span>
                <p className="min-w-0 pt-0.5 text-muted-foreground text-sm leading-relaxed">
                  In <strong className="text-foreground">Safari</strong>, tap
                  the{" "}
                  <Share2
                    className="inline h-4 w-4 align-text-bottom text-foreground/80"
                    aria-hidden
                  />{" "}
                  <strong className="text-foreground">Share</strong> button,
                  then{" "}
                  <strong className="text-foreground">
                    Add to Home Screen
                  </strong>
                  . That installs this admin like an app—required for push on
                  iOS.
                </p>
              </li>
              <li className="flex gap-3 sm:gap-4">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm"
                  aria-hidden
                >
                  2
                </span>
                <p className="min-w-0 pt-0.5 text-muted-foreground text-sm leading-relaxed">
                  Open the admin from the{" "}
                  <strong className="text-foreground">home screen icon</strong>,
                  then turn on lead alerts (e.g. from the bell in the header).
                </p>
              </li>
            </ol>
            {!standalone ? (
              <div className="flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50/90 p-3.5 text-amber-950 text-sm leading-snug dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-100">
                <PlusSquare
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300"
                  aria-hidden
                />
                <p>
                  You&apos;re in a normal browser tab. Use{" "}
                  <strong className="font-semibold">Add to Home Screen</strong>{" "}
                  first—push is unreliable until you launch from the home screen
                  icon.
                </p>
              </div>
            ) : null}
          </div>
        ) : android ? (
          <div className="flex gap-3 rounded-xl border border-border/80 bg-muted/20 p-4 sm:gap-4 sm:p-5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
              aria-hidden
            >
              <Smartphone className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 space-y-2">
              <p className="font-medium text-foreground text-sm">
                Chrome on Android
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Enable alerts from this browser. Optional: use{" "}
                <span className="font-medium text-foreground">Install app</span>{" "}
                or Add to Home screen for a shortcut—same push either way.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-2 sm:gap-3">
            <Collapsible
              defaultOpen={false}
              className="group rounded-xl border border-border/80 bg-muted/15 data-[state=open]:bg-muted/20"
            >
              <CollapsibleTrigger
                type="button"
                className="flex w-full items-start gap-3 rounded-xl p-4 text-left outline-none transition-colors hover:bg-muted/25 sm:gap-4 sm:p-5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1",
                    "bg-blue-500/10 text-blue-800 ring-blue-700/20",
                    "dark:bg-blue-950/45 dark:text-blue-200 dark:ring-blue-500/35",
                  )}
                  aria-hidden
                >
                  <Monitor className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="font-medium text-foreground text-sm">
                    Computer (Windows and Mac)
                  </p>
                </div>
                <ChevronDown
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-border/50 px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
                  <ul className="list-inside list-disc space-y-1.5 text-muted-foreground text-sm leading-relaxed marker:text-muted-foreground/70">
                    <li>
                      <strong className="text-foreground">Chrome</strong> and{" "}
                      <strong className="text-foreground">Edge</strong> — best
                      support; allow notifications when asked.
                    </li>
                    <li>
                      <strong className="text-foreground">Safari (Mac)</strong>{" "}
                      — supported in recent versions; if nothing appears, check{" "}
                      <span className="whitespace-nowrap">
                        System Settings → Notifications
                      </span>{" "}
                      for your browser.
                    </li>
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              defaultOpen={false}
              className="group rounded-xl border border-border/80 bg-muted/15 data-[state=open]:bg-muted/20"
            >
              <CollapsibleTrigger
                type="button"
                className="flex w-full items-start gap-3 rounded-xl p-4 text-left outline-none transition-colors hover:bg-muted/25 sm:gap-4 sm:p-5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1",
                    "bg-indigo-500/10 text-indigo-800 ring-indigo-700/20",
                    "dark:bg-indigo-950/45 dark:text-indigo-200 dark:ring-indigo-500/35",
                  )}
                  aria-hidden
                >
                  <Smartphone className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="font-medium text-foreground text-sm">
                    Phone or tablet
                  </p>
                </div>
                <ChevronDown
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-border/50 px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
                  <ul className="list-inside list-disc space-y-1.5 text-muted-foreground text-sm leading-relaxed marker:text-muted-foreground/70">
                    <li>
                      <strong className="text-foreground">iPhone / iPad</strong>{" "}
                      — in Safari: Share → Add to Home Screen, then open the
                      admin from that icon before enabling alerts.
                    </li>
                    <li>
                      <strong className="text-foreground">Android</strong> — use
                      Chrome; optional install shortcut from the browser menu.
                    </li>
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    </section>
  );

  const pushActionBtnClass =
    "h-12 w-full justify-center text-base sm:h-11 sm:w-auto sm:min-h-0 sm:shrink-0 sm:px-5";

  const pushActions = (
    <div className="w-full sm:w-auto sm:max-w-md">
      {loading ? (
        <div className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-dashed border-admin-card-border bg-admin-card-bg/50 py-4 text-muted-foreground text-sm sm:min-h-[44px] sm:px-6">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading…
        </div>
      ) : !supported ? (
        <p className="rounded-xl border border-admin-card-border bg-admin-card-bg px-4 py-3 text-center text-muted-foreground text-sm sm:text-left">
          This browser does not support web push. Try Chrome or Edge on desktop
          or Android.
        </p>
      ) : vapidConfigured === false ? (
        <Button
          type="button"
          variant="secondary"
          className={cn(pushActionBtnClass, "sm:px-8")}
          disabled
        >
          Unavailable
        </Button>
      ) : pushActive ? (
        <Button
          type="button"
          variant="outline"
          className={pushActionBtnClass}
          disabled={busy || !settings}
          onClick={() => void onDisable()}
        >
          {busy ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <BellOff className="mr-2 h-5 w-5" aria-hidden />
          )}
          Turn off lead alerts on this device
        </Button>
      ) : (
        <Button
          type="button"
          className={cn(pushActionBtnClass, "shadow-md")}
          disabled={busy || !settings}
          onClick={() => void onEnable()}
        >
          {busy ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Bell className="mr-2 h-5 w-5" />
          )}
          Enable lead alerts
        </Button>
      )}
    </div>
  );

  const inAppFeedEnabled = settings?.in_app_lead_notifications ?? true;

  const inAppSection = (
    <section className={cn(cardShell)}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 sm:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 shadow-sm ring-1 ring-amber-200/80"
            aria-hidden
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-semibold text-foreground tracking-tight">
              In-app lead notifications
            </h3>
            <p className="text-muted-foreground text-sm leading-snug">
              When on, each new lead is saved to your notification inbox (bell
              in the header) and on the Notifications page. This is separate
              from browser push alerts.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:pl-2">
          <Label
            htmlFor="in-app-lead-notifications"
            className="text-muted-foreground text-sm sm:sr-only"
          >
            In-app lead notifications
          </Label>
          <Switch
            id="in-app-lead-notifications"
            checked={inAppFeedEnabled}
            disabled={loading || !settings || patching}
            onCheckedChange={(v) => {
              void patchSettings({ in_app_lead_notifications: v }).catch(
                (e) => {
                  console.error(e);
                  toast.error(safeClientErrorToastMessage(e));
                },
              );
            }}
            aria-label="In-app lead notifications"
          />
        </div>
      </div>
    </section>
  );

  const leadPushSection = (
    <section className={cn(cardShell)}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5 sm:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-border/70",
              pushActive
                ? "bg-[#00c07c] text-white ring-[#00c07c]/30"
                : "bg-background text-muted-foreground",
            )}
            aria-hidden
          >
            {pushActive ? (
              <Bell className="h-5 w-5" strokeWidth={2} />
            ) : (
              <BellOff className="h-5 w-5" strokeWidth={2} />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-semibold text-foreground tracking-tight">
              Lead alerts (this browser)
            </h3>
            <p className="text-muted-foreground text-sm leading-snug">
              {loading
                ? "Checking notification status…"
                : !supported
                  ? "This browser cannot receive web push. Use Chrome or Edge on desktop or Android."
                  : vapidConfigured === false
                    ? "Push is not configured on the server yet."
                    : pushActive
                      ? "On — you’ll get system notifications for new leads and enquiries on this device."
                      : "Off — use the button to allow notifications for this browser only."}
            </p>
          </div>
        </div>
        {pushActions}
      </div>
    </section>
  );

  if (isOverlay) {
    return (
      <div className="mx-auto flex w-full max-w-none flex-col gap-4 pb-1">
        {settingsError ? (
          <p className="text-destructive text-sm">{settingsError}</p>
        ) : null}
        {vapidConfigured === false ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950 text-sm dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            Server is missing VAPID keys. Add{" "}
            <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
              NEXT_PUBLIC_VAPID_PUBLIC_KEY
            </code>
            ,{" "}
            <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
              VAPID_PRIVATE_KEY
            </code>
            , and{" "}
            <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
              VAPID_SUBJECT
            </code>{" "}
            to the deployment environment.
          </p>
        ) : null}
        <div className="w-full">{pushActions}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 pb-4 sm:gap-6 sm:pb-8">
        <div className="flex flex-col gap-3">
          <div className="flex w-full justify-stretch sm:justify-end">
            <LeadAlertsGuideDialog
              triggerClassName="h-11 w-full justify-center gap-2 rounded-xl sm:h-9 sm:w-auto sm:justify-center"
            />
          </div>

          {settingsError ? (
            <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-destructive text-sm leading-snug">
              {settingsError}
            </p>
          ) : null}

          {vapidConfigured === false ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-amber-950 text-sm leading-snug dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100 sm:p-4">
              Server is missing VAPID keys. Add{" "}
              <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
                NEXT_PUBLIC_VAPID_PUBLIC_KEY
              </code>
              ,{" "}
              <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
                VAPID_PRIVATE_KEY
              </code>
              , and{" "}
              <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">
                VAPID_SUBJECT
              </code>{" "}
              to the deployment environment.
            </p>
          ) : null}

          {inAppSection}

          {leadPushSection}

          {tipSection}
        </div>
      </div>
    </div>
  );
}
