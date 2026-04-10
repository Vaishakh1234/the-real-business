"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellOff,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  Loader2,
  Monitor,
  Smartphone,
  Share2,
  PlusSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdminLeadPush } from "@/hooks/useAdminLeadPush";
import {
  isAndroidChrome,
  isIOSDevice,
  isStandaloneDisplay,
} from "@/lib/push/platform";
import { cn } from "@/lib/utils";

export function AdminLeadPushPanel() {
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
  } = useAdminLeadPush();

  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(isStandaloneDisplay());
    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setStandalone(isStandaloneDisplay());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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
      toast.error(
        e instanceof Error ? e.message : "Could not enable notifications.",
      );
    }
  }

  async function onDisable() {
    try {
      await disablePush();
      toast.success("Lead alerts turned off on this device.");
    } catch (e) {
      console.error(e);
      toast.error(
        e instanceof Error ? e.message : "Could not disable notifications.",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div
        className={cn(
          "flex flex-col gap-8 pb-28 lg:pb-8 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] xl:items-start xl:pb-0",
        )}
      >
        <div className="space-y-6 xl:col-start-1 xl:row-start-1">
          <section
            className={cn(
              "relative overflow-hidden rounded-2xl border border-admin-card-border bg-admin-card-bg p-5 shadow-sm sm:p-6",
              "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-rose-400/90 before:to-amber-400/80",
            )}
          >
            <div className="flex items-start gap-4 pt-1">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                  pushActive
                    ? "bg-[#00c07c] text-white"
                    : "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                {pushActive ? (
                  <Bell className="h-7 w-7" strokeWidth={2} />
                ) : (
                  <BellOff className="h-7 w-7" strokeWidth={2} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-foreground text-lg leading-tight sm:text-xl">
                  Lead alerts on this device
                </h2>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed sm:text-[15px]">
                  Get a system-style notification when someone submits a lead,
                  contact form, or property enquiry on your site.
                </p>
                {pushActive ? (
                  <p className="mt-4 flex items-start gap-2 text-emerald-700 text-sm font-medium dark:text-emerald-500">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0"
                      strokeWidth={2}
                    />
                    <span>
                      Enabled — alerts can arrive while this device is locked or
                      in the background.
                    </span>
                  </p>
                ) : (
                  <p className="mt-4 text-amber-900/90 text-sm dark:text-amber-200/90">
                    Not enabled yet — use the button below to turn on.
                  </p>
                )}
              </div>
            </div>
          </section>

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
        </div>

        <aside
          className={cn(
            "flex flex-col gap-4",
            "xl:col-start-2 xl:row-span-3 xl:row-start-1 xl:self-start",
          )}
        >
          <section className="rounded-2xl border border-admin-card-border bg-admin-card-bg p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </span>
              Devices & browsers
            </div>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              Best experience is Chrome or Edge. iPhone needs the admin opened
              from the home screen after <strong>Add to Home Screen</strong>.
            </p>
            <ul className="mt-4 space-y-4 text-muted-foreground text-sm leading-relaxed">
              {ios ? (
                <>
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground text-xs">
                      1
                    </span>
                    <span>
                      In <strong className="text-foreground">Safari</strong>,
                      open the Share menu{" "}
                      <Share2 className="inline h-4 w-4 align-text-bottom opacity-80" />{" "}
                      →{" "}
                      <strong className="text-foreground">
                        Add to Home Screen
                      </strong>{" "}
                      so this admin runs like an app (required for web push on
                      iPhone).
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-foreground text-xs">
                      2
                    </span>
                    <span>
                      Open admin from the{" "}
                      <strong className="text-foreground">home screen icon</strong>
                      , then enable alerts.
                    </span>
                  </li>
                  {!standalone && (
                    <li className="rounded-xl bg-amber-50 p-3 text-amber-950 text-xs dark:bg-amber-950/50 dark:text-amber-100">
                      <PlusSquare className="mr-1 inline h-3.5 w-3.5" />{" "}
                      You’re in a browser tab. Add to Home Screen first for
                      reliable push on iOS.
                    </li>
                  )}
                </>
              ) : android ? (
                <li>
                  <strong className="text-foreground">Chrome on Android:</strong>{" "}
                  enable alerts here in the browser. Installing the site
                  (Install app) is optional but keeps an icon on your home
                  screen.
                </li>
              ) : (
                <li className="flex gap-3">
                  <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    <strong className="text-foreground">Desktop:</strong> Chrome
                    and Edge support push.{" "}
                    <strong className="text-foreground">Safari on Mac</strong>{" "}
                    supports it in recent versions when permission is granted.
                    For mobile, use Chrome or Edge on Android, or follow the
                    iPhone steps above on iOS.
                  </span>
                </li>
              )}
            </ul>
          </section>
        </aside>

        {/* Primary action — sticky on small screens */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t border-admin-card-border bg-admin-main-bg/95 p-4 backdrop-blur-md lg:static lg:z-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none",
            "pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 xl:col-start-1 xl:row-start-2 xl:pt-0",
          )}
        >
            <div className="w-full">
              {loading ? (
                <div className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-dashed border-admin-card-border bg-admin-card-bg/50 py-4 text-muted-foreground text-sm">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading…
                </div>
              ) : !supported ? (
                <p className="rounded-xl border border-admin-card-border bg-admin-card-bg px-4 py-3 text-center text-muted-foreground text-sm">
                  This browser does not support web push. Try Chrome or Edge on
                  desktop or Android.
                </p>
              ) : vapidConfigured === false ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12 w-full"
                  disabled
                >
                  Unavailable
                </Button>
              ) : pushActive ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full text-base"
                  disabled={busy || !settings}
                  onClick={() => void onDisable()}
                >
                  {busy ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  Turn off lead alerts on this device
                </Button>
              ) : (
                <Button
                  type="button"
                  className="h-12 w-full text-base shadow-md"
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
              <p className="mt-3 text-center text-muted-foreground text-xs leading-relaxed">
                {pushActive ? (
                  <>
                    Turning off removes push for{" "}
                    <strong className="font-medium text-foreground">
                      this browser only
                    </strong>
                    . Other devices stay unchanged.
                  </>
                ) : supported && vapidConfigured !== false ? (
                  <>
                    Enabling will ask for notification permission, like any app.
                    On phones you may need to add this site to the home screen
                    first (see tips).
                  </>
                ) : null}
              </p>
            </div>
        </div>

        <nav
          aria-label="Admin shortcuts"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-admin-card-border border-t pt-6 text-muted-foreground text-sm xl:col-start-1 xl:row-start-3 xl:justify-start"
        >
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-rose-600"
          >
            <ListTodo className="h-4 w-4 opacity-70" />
            View leads
          </Link>
          <span className="text-border" aria-hidden>
            ·
          </span>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4 opacity-70" />
            Dashboard
          </Link>
        </nav>
      </div>
    </div>
  );
}
