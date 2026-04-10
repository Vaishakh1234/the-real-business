"use client";

import Link from "next/link";
import { ArrowRight, Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminLeadPush } from "@/hooks/useAdminLeadPush";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Compact summary on the dashboard; full setup lives at `/admin/notifications`. */
export function LeadPushNotificationsCard() {
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

  async function onEnable() {
    try {
      await enablePush();
      toast.success("Lead alerts enabled. Open Alerts anytime to manage.");
    } catch (e) {
      if (e instanceof Error && e.message === "NOTIFICATION_DENIED") {
        toast.error("Notifications blocked. Allow them in browser settings.");
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
    <div
      className={cn(
        "rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:p-5",
        "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
      )}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            pushActive
              ? "bg-[#00c07c] text-white"
              : "bg-muted text-muted-foreground",
          )}
          aria-hidden
        >
          {pushActive ? (
            <Bell className="h-5 w-5" strokeWidth={2} />
          ) : (
            <BellOff className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-base text-foreground sm:text-lg">
            Lead alerts
          </h2>
          <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
            Push to your phone when a lead or enquiry comes in.{" "}
            <span className="lg:hidden">
              Use the <strong className="text-foreground">Alerts</strong> tab or
              the bell in the header for the full setup.
            </span>
            <span className="hidden lg:inline">
              Prefer the dedicated page for step-by-step mobile setup.
            </span>
          </p>
          {settingsError ? (
            <p className="mt-2 text-destructive text-sm">{settingsError}</p>
          ) : null}
          {vapidConfigured === false ? (
            <p className="mt-2 text-amber-800 text-sm dark:text-amber-200">
              Add VAPID keys in the server environment to enable push.
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
        <Button
          variant="outline"
          size="default"
          className="w-full sm:w-auto"
          asChild
        >
          <Link href="/admin/notifications" className="gap-2">
            Open alerts setup
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex gap-2">
          {loading ? (
            <span className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </span>
          ) : !supported ? (
            <span className="text-muted-foreground text-sm">
              Not supported here.
            </span>
          ) : vapidConfigured === false ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled
              className="flex-1"
            >
              Unavailable
            </Button>
          ) : pushActive ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="flex-1"
              disabled={busy || !settings}
              onClick={() => void onDisable()}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Turn off
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              className="flex-1"
              disabled={busy || !settings}
              onClick={() => void onEnable()}
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Quick enable
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
