"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronRight,
  Inbox,
  Loader2,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/admin/data-table/DataTablePagination";
import {
  useAdminNotificationUnreadCount,
  useAdminNotificationsList,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/hooks/useAdminNotifications";
import { getNotificationTypePresentation } from "@/lib/admin-notification-display";
import { cn, formatDate, isUnreadAdminNotification } from "@/lib/utils";
import type { AdminNotificationRow } from "@/types";
import {
  PageHeader,
  type BreadcrumbItem,
} from "@/components/admin/layout/PageHeader";
import { NotificationLeadTitle } from "@/components/admin/notifications/NotificationLeadTitle";

function NotificationRow({ row }: { row: AdminNotificationRow }) {
  const markRead = useMarkNotificationRead();
  const router = useRouter();
  const unread = isUnreadAdminNotification(row.read_at);
  const { Icon, tileClassName } = getNotificationTypePresentation(row.body);

  async function handleClick() {
    if (unread) {
      try {
        await markRead.mutateAsync(row.id);
      } catch {
        /* still navigate */
      }
    }
    router.push(`/admin/leads?open=${row.lead_id}`);
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => void handleClick()}
        className={cn(
          "group flex min-h-[52px] w-full touch-manipulation items-center gap-2.5 border-l-[3px] px-3 py-3 text-left transition-all duration-200 sm:min-h-14 sm:gap-3.5 sm:px-5 sm:py-3.5 lg:px-6 lg:py-4",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
          "active:bg-muted/50",
          "hover:bg-gradient-to-r hover:from-slate-50/90 hover:to-brand-blue-muted/25",
          unread
            ? "border-l-admin-sidebar-active-indicator bg-gradient-to-r from-brand-blue-muted/45 via-brand-blue-muted/15 to-transparent"
            : "border-l-transparent",
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 sm:h-12 sm:w-12 sm:rounded-2xl",
            tileClassName,
            unread && "shadow-md ring-2 ring-brand-blue/25",
            !unread && "opacity-95",
          )}
          aria-hidden
        >
          <Icon
            className="h-[1.1rem] w-[1.1rem] sm:h-5 sm:w-5"
            strokeWidth={2.25}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
          <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <NotificationLeadTitle
                title={row.title}
                className="block truncate text-sm sm:text-[15px]"
              />
            </div>
            {unread ? (
              <Badge
                className="h-5 shrink-0 self-center border-0 bg-brand-blue px-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm sm:px-2"
                aria-label="Unread"
              >
                New
              </Badge>
            ) : null}
          </div>
          {row.body ? (
            <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px] sm:leading-relaxed">
              {row.body}
            </p>
          ) : null}
          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground tabular-nums sm:text-xs">
            <span
              className={cn(
                "inline-block h-1 w-1 shrink-0 rounded-full",
                unread ? "bg-brand-gold/80" : "bg-muted-foreground/35",
              )}
              aria-hidden
            />
            {formatDate(row.created_at)}
          </p>
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-blue sm:h-5 sm:w-5"
          aria-hidden
        />
      </button>
    </li>
  );
}

export function AdminNotificationsView() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const { data, isLoading, isFetching } = useAdminNotificationsList(
    page,
    limit,
  );
  const { data: unreadCount = 0 } = useAdminNotificationUnreadCount();
  const markAll = useMarkAllNotificationsRead();

  const total = data?.total ?? 0;
  const rows = data?.data ?? [];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Admin", href: "/admin/dashboard" },
    { label: "Notifications" },
  ];

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-admin-main-bg via-white to-brand-gold-muted/35 pb-[env(safe-area-inset-bottom)]">
      <PageHeader
        title="Notifications"
        titleClassName="text-xl sm:text-2xl lg:text-3xl"
        subtitleClassName="text-sm leading-snug sm:text-[15px] sm:leading-snug"
        subtitle="New leads appear here when in-app lead notifications are enabled in Settings."
        breadcrumbs={breadcrumbs}
        actions={
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-11 w-11 shrink-0 gap-0 rounded-lg border-brand-gold/35 bg-white/90 p-0 shadow-sm backdrop-blur-sm hover:border-brand-gold/55 hover:bg-brand-gold-muted lg:h-9 lg:w-auto lg:gap-2 lg:px-3"
              asChild
            >
              <Link
                href="/admin/settings"
                className="inline-flex items-center justify-center lg:gap-2"
                aria-label="Notification settings"
                title="Notification settings"
              >
                <Settings className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden lg:inline">Settings</span>
              </Link>
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-11 w-11 shrink-0 gap-0 rounded-lg bg-brand-blue p-0 text-brand-blue-foreground shadow-md shadow-brand-blue/25 hover:bg-brand-blue-hover lg:h-9 lg:w-auto lg:gap-2 lg:px-3.5"
              disabled={markAll.isPending || total === 0}
              title="Mark all notifications as read"
              aria-label={
                markAll.isPending
                  ? "Marking all notifications as read"
                  : "Mark all notifications as read"
              }
              onClick={() => void markAll.mutate()}
            >
              {markAll.isPending ? (
                <Loader2
                  className="h-4 w-4 shrink-0 animate-spin"
                  aria-hidden
                />
              ) : (
                <Check
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2.25}
                  aria-hidden
                />
              )}
              <span className="hidden lg:inline">
                {markAll.isPending ? "Marking…" : "Mark all read"}
              </span>
            </Button>
          </div>
        }
      />

      <div className="mx-auto w-full max-w-5xl flex-1 space-y-4 sm:space-y-6">
        <p className="text-muted-foreground text-xs leading-snug md:hidden">
          New leads appear here when in-app lead notifications are enabled in
          Settings.
        </p>

        {isLoading ? (
          <div className="flex min-h-[36vh] flex-col items-center justify-center gap-4 rounded-xl border border-admin-card-border bg-white/80 shadow-inner sm:min-h-[40vh] sm:rounded-2xl">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-brand-gold/20 blur-xl" />
              <Loader2 className="relative h-10 w-10 animate-spin text-brand-gold" />
            </div>
            <p className="text-muted-foreground text-sm">Loading inbox…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="relative overflow-hidden rounded-xl border border-dashed border-brand-gold/35 bg-gradient-to-br from-white via-brand-gold-muted/40 to-brand-blue-muted/35 px-4 py-12 text-center shadow-sm sm:rounded-2xl sm:px-6 sm:py-16">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-gold/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-brand-blue/5 blur-3xl" />
            <div className="relative mx-auto flex max-w-md flex-col items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-gold-muted to-white shadow-lg ring-2 ring-brand-gold/20 sm:h-16 sm:w-16">
                <Bell
                  className="h-7 w-7 text-brand-gold sm:h-8 sm:w-8"
                  strokeWidth={2}
                />
              </div>
              <div className="space-y-2">
                <p className="flex items-center justify-center gap-2 font-semibold text-[#1a1a1a] text-base sm:text-lg">
                  <Sparkles className="h-5 w-5 text-brand-gold" />
                  You&apos;re all caught up
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  No notifications yet. When someone submits a lead and in-app
                  notifications are on, entries will show up here.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-11 w-11 shrink-0 gap-0 rounded-lg border-brand-gold/40 bg-white/90 p-0 hover:bg-brand-gold-muted lg:h-9 lg:w-auto lg:gap-2 lg:px-4"
                asChild
              >
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center justify-center lg:gap-2"
                  aria-label="Notification settings"
                  title="Notification settings"
                >
                  <Settings className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="hidden lg:inline">Settings</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <section className="overflow-hidden rounded-xl border border-admin-card-border bg-admin-card-bg shadow-lg shadow-brand-gold/10 ring-1 ring-brand-gold/15 sm:rounded-2xl">
            <div className="relative overflow-hidden border-b border-admin-card-border bg-gradient-to-r from-brand-gold-muted/95 via-white to-brand-blue-muted/60">
              <div
                className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-gold via-brand-gold-hover to-brand-gold"
                aria-hidden
              />
              <div className="relative flex flex-col gap-2 px-3 py-3 pl-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-4 lg:px-7 lg:py-5">
                <div className="flex min-w-0 items-center gap-2.5 sm:items-start sm:gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-md ring-2 ring-brand-gold/15 sm:h-11 sm:w-11 sm:rounded-xl">
                    <Inbox
                      className="h-4 w-4 text-brand-gold sm:h-5 sm:w-5"
                      strokeWidth={2.25}
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[#1a1a1a] text-sm tracking-tight sm:text-base lg:text-lg">
                      Inbox
                    </h2>
                    <p className="mt-0.5 text-muted-foreground text-xs sm:text-sm">
                      {unreadCount > 0 ? (
                        <>
                          <span className="font-semibold text-brand-blue">
                            {unreadCount} unread
                          </span>
                          {total > 0 ? (
                            <>
                              {" "}
                              <span className="text-muted-foreground/80">
                                ·
                              </span>{" "}
                              {total} total
                            </>
                          ) : null}
                        </>
                      ) : (
                        <span>
                          {total} notification{total === 1 ? "" : "s"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {unreadCount > 0 ? (
                  <div className="hidden items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 text-brand-blue text-xs font-medium sm:flex sm:text-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-blue" />
                    </span>
                    Action needed on new leads
                  </div>
                ) : null}
              </div>
            </div>
            <ul className="divide-y divide-admin-card-border">
              {rows.map((row) => (
                <NotificationRow key={row.id} row={row} />
              ))}
            </ul>
            {total > 0 ? (
              <div className="border-t border-admin-card-border bg-gradient-to-r from-slate-50/90 via-white to-brand-blue-muted/20">
                <DataTablePagination
                  page={page}
                  limit={limit}
                  total={total}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                  isLoading={isFetching}
                />
              </div>
            ) : null}
          </section>
        )}
      </div>
    </div>
  );
}
