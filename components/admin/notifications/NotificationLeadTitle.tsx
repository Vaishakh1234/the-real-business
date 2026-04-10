"use client";

import { parseNewLeadTitle } from "@/lib/admin-notification-display";
import { cn } from "@/lib/utils";

type NotificationLeadTitleProps = {
  title: string;
  className?: string;
};

/**
 * Renders "New lead: **Name**" with the lead name bold; falls back to plain title.
 */
export function NotificationLeadTitle({
  title,
  className,
}: NotificationLeadTitleProps) {
  const parsed = parseNewLeadTitle(title);
  if (!parsed) {
    return (
      <span
        className={cn(
          "min-w-0 font-bold text-foreground leading-snug",
          className,
        )}
      >
        {title}
      </span>
    );
  }
  return (
    <span className={cn("min-w-0 leading-snug", className)}>
      <span className="font-medium text-muted-foreground">{parsed.prefix}</span>
      <span className="font-extrabold text-foreground">{parsed.name}</span>
    </span>
  );
}
