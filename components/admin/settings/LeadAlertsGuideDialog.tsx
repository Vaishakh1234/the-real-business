"use client";

import type { ReactNode } from "react";
import {
  Bell,
  Chrome,
  Home,
  Monitor,
  Share2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Monitor,
    title: "Use a supported browser",
    body: "Chrome and Edge offer the most reliable web push on desktop and Android. Safari on Mac works in recent versions once you allow notifications.",
    accent: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  {
    icon: Chrome,
    title: "Open this admin while signed in",
    body: "Stay logged in on the device where you want alerts. Each phone, tablet, or laptop must enable push separately.",
    accent: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  {
    icon: Share2,
    title: "On iPhone: Add to Home Screen first",
    body: "In Safari, use the Share menu → Add to Home Screen. Then launch the admin from that icon — iOS only delivers web push to installed web apps.",
    accent: "bg-amber-500/15 text-amber-900 dark:text-amber-200",
  },
  {
    icon: Home,
    title: "Launch from the home screen icon",
    body: "After installing, open The Real Business admin from your home screen. Return to Settings & alerts and tap Enable lead alerts.",
    accent: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300",
  },
  {
    icon: Smartphone,
    title: "On Android",
    body: "Chrome is enough — enable alerts in the browser. Optional: install the site for a home screen shortcut.",
    accent: "bg-cyan-500/15 text-cyan-800 dark:text-cyan-300",
  },
  {
    icon: Bell,
    title: "Allow the permission prompt",
    body: "When your browser asks for notification access, choose Allow. You can change this later in browser or system settings.",
    accent: "bg-rose-500/15 text-rose-800 dark:text-rose-300",
  },
  {
    icon: ShieldCheck,
    title: "Privacy",
    body: "Alerts are sent only for new leads and enquiries tied to your site. Turning off on this device removes the subscription for this browser only.",
    accent: "bg-slate-500/15 text-slate-800 dark:text-slate-300",
  },
];

type LeadAlertsGuideDialogProps = {
  triggerClassName?: string;
  customTrigger?: ReactNode;
};

export function LeadAlertsGuideDialog({
  triggerClassName,
  customTrigger,
}: LeadAlertsGuideDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {customTrigger ?? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn("shrink-0 gap-2", triggerClassName)}
          >
            <ShieldCheck className="h-4 w-4" />
            How push alerts work
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto rounded-xl border border-border bg-card p-0 sm:max-w-lg">
        <DialogHeader className="space-y-2 border-b border-border bg-muted/30 px-6 py-5 text-left">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Lead alerts — step by step
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-relaxed">
            Follow these steps on each device where you want instant
            notifications for new leads and property enquiries.
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-4 px-6 py-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-xl border border-border/80 bg-background p-4 shadow-sm"
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  step.accent,
                )}
                aria-hidden
              >
                <step.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="font-medium text-foreground text-sm">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted font-semibold text-foreground text-xs">
                    {i + 1}
                  </span>
                  {step.title}
                </p>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
