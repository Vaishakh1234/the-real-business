"use client";

import Link from "next/link";
import { ArrowRight, Bell, BellOff, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAdminLeadPush } from "@/hooks/useAdminLeadPush";
import { safeClientErrorToastMessage } from "@/lib/safe-client-error-message";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Compact summary on the dashboard; full setup lives at `/admin/settings`. */
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
      toast.success("Lead alerts enabled. Open Settings anytime to manage.");
    } catch (e) {
      if (e instanceof Error && e.message === "NOTIFICATION_DENIED") {
        toast.error("Notifications blocked. Allow them in browser settings.");
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

  const iconBoxClass = (compact: boolean) =>
    cn(
      "flex shrink-0 items-center justify-center",
      compact
        ? "h-8 w-8 rounded-md"
        : "h-10 w-10 rounded-lg sm:h-12 sm:w-12 sm:rounded-xl",
      pushActive
        ? "bg-[#00c07c] text-white"
        : "bg-muted text-muted-foreground",
    );

  const iconInnerClass = (compact: boolean) =>
    compact ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6";

  const description = (
    <>
      <span className="lg:hidden">
        Push to your phone when a lead or enquiry comes in. Use{" "}
        <strong className="text-foreground">Settings</strong> or the bell in
        the header for the full setup.
      </span>
      <span className="hidden lg:inline">
        Prefer the dedicated page for step-by-step mobile setup.
      </span>
    </>
  );

  const errorBlocks = (
    <>
      {settingsError ? (
        <p className="mt-2 text-destructive text-sm">{settingsError}</p>
      ) : null}
      {vapidConfigured === false ? (
        <p className="mt-2 text-amber-800 text-sm dark:text-amber-200">
          Add VAPID keys in the server environment to enable push.
        </p>
      ) : null}
    </>
  );

  const actionsRow = (compact: boolean) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        className={cn("w-full sm:w-auto", compact && "h-9 text-xs")}
        asChild
      >
        <Link href="/admin/settings" className="gap-2">
          Open settings
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </Button>
      <div className="flex gap-2">
        {loading ? (
          <span
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed px-3 text-muted-foreground",
              compact ? "py-1.5 text-xs" : "py-2 text-sm",
            )}
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
            Loading…
          </span>
        ) : !supported ? (
          <span
            className={cn(
              "text-muted-foreground",
              compact ? "text-xs" : "text-sm",
            )}
          >
            Not supported here.
          </span>
        ) : vapidConfigured === false ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled
            className={cn("flex-1", compact && "h-9 text-xs")}
          >
            Unavailable
          </Button>
        ) : pushActive ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 gap-1.5 border-rose-200 bg-rose-50/90 font-medium text-rose-800 shadow-sm hover:bg-rose-100 hover:text-rose-900 dark:border-rose-900/55 dark:bg-rose-950/45 dark:text-rose-100 dark:hover:bg-rose-950/65",
              compact && "h-9 text-xs",
            )}
            disabled={busy || !settings}
            onClick={() => void onDisable()}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin sm:h-4 sm:w-4" />
            ) : (
              <BellOff className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2} />
            )}
            Turn off
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className={cn(
              "flex-1 gap-1.5 bg-[#00c07c] font-medium text-white shadow-sm hover:bg-[#00a86a] dark:bg-[#00c07c] dark:hover:bg-[#00b870]",
              compact && "h-9 text-xs",
            )}
            disabled={busy || !settings}
            onClick={() => void onEnable()}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin sm:h-4 sm:w-4" />
            ) : (
              <Bell className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2} />
            )}
            Quick enable
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile & tablet: compact accordion */}
      <Collapsible
        defaultOpen={false}
        className="group rounded-xl border border-admin-card-border bg-admin-card-bg p-3 shadow-sm lg:hidden"
      >
        <CollapsibleTrigger
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg text-left outline-none transition-colors hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className={iconBoxClass(true)} aria-hidden>
            {pushActive ? (
              <Bell className={iconInnerClass(true)} strokeWidth={2} />
            ) : (
              <BellOff className={iconInnerClass(true)} />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-semibold text-foreground text-sm">
              Lead alerts
            </span>
            <span className="sr-only">. Tap to expand or collapse details.</span>
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden">
          <div className="mt-3 space-y-3 border-t border-admin-card-border/80 pt-3">
            <p className="text-muted-foreground text-xs leading-relaxed">
              {description}
            </p>
            {errorBlocks}
            {actionsRow(true)}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Desktop: full inline card */}
      <div
        className={cn(
          "hidden rounded-xl border border-admin-card-border bg-admin-card-bg p-4 shadow-sm sm:p-6 lg:flex",
          "flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
        )}
      >
        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
          <div className={iconBoxClass(false)} aria-hidden>
            {pushActive ? (
              <Bell className={iconInnerClass(false)} strokeWidth={2} />
            ) : (
              <BellOff className={iconInnerClass(false)} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-base text-foreground sm:text-lg">
              Lead alerts
            </h2>
            <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
              Push to your phone when a lead or enquiry comes in.{" "}
              {description}
            </p>
            {errorBlocks}
          </div>
        </div>
        {actionsRow(false)}
      </div>
    </>
  );
}
