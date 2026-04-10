"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Inbox, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Logo } from "@/components/ui/Logo";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { cn, formatDate, isUnreadAdminNotification } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAdminAttentionCounts } from "@/hooks/useLeads";
import {
  useAdminNotificationsPreview,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/hooks/useAdminNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getNotificationTypePresentation } from "@/lib/admin-notification-display";
import { NotificationLeadTitle } from "@/components/admin/notifications/NotificationLeadTitle";

function getGreeting(displayName: string): string {
  const hour = new Date().getHours();
  const name = displayName.split(" ")[0] || "there";
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

export function Header() {
  const router = useRouter();
  const { email, clearAuth } = useAuthStore();
  const { sidebarCollapsed } = useAppStore();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const displayName = email
    ? email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Admin";

  const { data: attention } = useAdminAttentionCounts({
    enabled: !!email,
  });
  const unreadNotifCount = attention?.unreadNotifications ?? 0;
  const { data: previewData, isLoading: previewLoading } =
    useAdminNotificationsPreview(6);
  const markNotifRead = useMarkNotificationRead();
  const markAllNotifRead = useMarkAllNotificationsRead();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearAuth();
      router.push("/admin/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  }

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 right-0 z-20 flex h-16 min-h-[4rem] items-center justify-between border-b border-admin-header-border bg-admin-header-bg backdrop-blur-sm transition-all duration-300 px-3 pt-[env(safe-area-inset-top)] lg:h-[4.5rem] lg:min-h-[4.5rem] lg:px-6",
        "left-0 lg:left-64",
        sidebarCollapsed && "lg:left-16",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Mobile: icon + "The Real Business" branding */}
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
          <Logo
            href="/admin/dashboard"
            height={36}
            iconOnly
            className="shrink-0"
            title="The Real Business"
          />
          <p className="mt-2 truncate text-xl font-semibold leading-tight text-black sm:text-2xl">
            The Real Business
          </p>
        </div>
        {/* Desktop: greeting + date */}
        <div className="hidden lg:block">
          <p className="text-xl font-semibold text-foreground">
            {getGreeting(displayName)}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "Asia/Kolkata",
            })}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/*
          Mobile / tablet: go straight to the notifications page (no overlay).
          Desktop (lg+): keep the quick-preview popover.
        */}
        <Link
          href="/admin/notifications"
          className={cn(
            "relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors",
            "hover:border-admin-header-border hover:bg-muted/80 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "lg:hidden",
          )}
          aria-label={
            unreadNotifCount > 0
              ? `Notifications, ${unreadNotifCount} unread notification${unreadNotifCount === 1 ? "" : "s"}`
              : "Notifications"
          }
          title={
            unreadNotifCount > 0
              ? `${unreadNotifCount} unread notification${unreadNotifCount === 1 ? "" : "s"}`
              : "Notifications"
          }
        >
          <Bell
            className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
            strokeWidth={2}
          />
          {unreadNotifCount > 0 && (
            <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground ring-2 ring-admin-header-bg">
              {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
            </span>
          )}
        </Link>

        <div className="hidden lg:block">
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors",
                  "hover:border-admin-header-border hover:bg-muted/80 hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                )}
                aria-label={
                  unreadNotifCount > 0
                    ? `Notifications, ${unreadNotifCount} unread notification${unreadNotifCount === 1 ? "" : "s"}`
                    : "Notifications"
                }
                title={
                  unreadNotifCount > 0
                    ? `${unreadNotifCount} unread notification${unreadNotifCount === 1 ? "" : "s"}`
                    : "Notifications"
                }
              >
                <Bell
                  className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
                  strokeWidth={2}
                />
                {unreadNotifCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground ring-2 ring-admin-header-bg">
                    {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-[min(100vw-1.5rem,22rem)] overflow-hidden rounded-2xl border-0 bg-[#FFFFFF] p-0 shadow-lg sm:w-96"
            >
              <div className="bg-[#FFFFFF] px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm tracking-tight">
                      Notifications
                    </p>
                    <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">
                      {unreadNotifCount > 0
                        ? `${unreadNotifCount} unread notification${unreadNotifCount === 1 ? "" : "s"}`
                        : "No unread notifications"}
                    </p>
                  </div>
                  {unreadNotifCount > 0 ? (
                    <button
                      type="button"
                      className="shrink-0 rounded-lg bg-brand-blue px-2.5 py-1.5 text-brand-blue-foreground text-xs font-semibold shadow-sm transition-colors hover:bg-brand-blue-hover disabled:opacity-60"
                      disabled={markAllNotifRead.isPending}
                      onClick={() => void markAllNotifRead.mutate()}
                    >
                      {markAllNotifRead.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Mark all read"
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="max-h-[min(60vh,320px)] overflow-y-auto overscroll-contain">
                {previewLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-7 w-7 animate-spin text-brand-gold" />
                  </div>
                ) : !previewData?.data?.length ? (
                  <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/80 ring-1 ring-border">
                      <Inbox className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      No notifications yet.
                    </p>
                  </div>
                ) : (
                  <ul className="bg-[#FFFFFF]">
                    {previewData.data.map((n) => {
                      const unread = isUnreadAdminNotification(n.read_at);
                      const { Icon, tileClassName } =
                        getNotificationTypePresentation(n.body);
                      return (
                        <li key={n.id}>
                          <Link
                            href={`/admin/leads?open=${n.lead_id}`}
                            className={cn(
                              "flex gap-3 px-3 py-3 text-left transition-colors sm:gap-3.5 sm:px-4",
                              "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-inset",
                              unread &&
                                "bg-gradient-to-r from-brand-blue-muted/50 to-transparent",
                            )}
                            onClick={async () => {
                              setNotifOpen(false);
                              if (unread) {
                                try {
                                  await markNotifRead.mutateAsync(n.id);
                                } catch {
                                  /* ignore */
                                }
                              }
                            }}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                tileClassName,
                              )}
                              aria-hidden
                            >
                              <Icon
                                className="h-[1.15rem] w-[1.15rem]"
                                strokeWidth={2.25}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <NotificationLeadTitle
                                  title={n.title}
                                  className="text-sm"
                                />
                                {unread ? (
                                  <Badge
                                    className="h-5 shrink-0 border-0 bg-brand-blue px-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
                                    aria-label="Unread"
                                  >
                                    New
                                  </Badge>
                                ) : null}
                              </div>
                              {n.body ? (
                                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                                  {n.body}
                                </p>
                              ) : null}
                              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground tabular-nums">
                                <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-brand-gold/80" />
                                {formatDate(n.created_at)}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className="bg-[#FFFFFF] px-3 py-3">
                <Link
                  href="/admin/notifications"
                  className="flex min-h-[44px] items-center justify-center rounded-lg text-center font-semibold text-brand-blue text-sm transition-colors hover:bg-muted/50 sm:min-h-0 sm:py-2"
                  onClick={() => setNotifOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2 py-1.5 hover:bg-muted transition-colors lg:min-h-0 lg:min-w-0 lg:gap-2.5">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                  {displayName[0]?.toUpperCase() ??
                    email?.[0]?.toUpperCase() ??
                    "A"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-admin-header-bg" />
              </div>
              <div className="text-left hidden lg:flex flex-col min-w-0">
                <span className="text-base font-medium text-foreground leading-none truncate">
                  {displayName}
                </span>
                <span className="text-sm text-muted-foreground mt-0.5 leading-none truncate max-w-[140px]">
                  {email ?? "Super Admin"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 min-w-[14rem] rounded-xl border border-border bg-popover p-3 pt-3 shadow-lg"
          >
            <DropdownMenuLabel className="font-normal mt-0 px-3 pb-3 pt-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                  {displayName[0]?.toUpperCase() ??
                    email?.[0]?.toUpperCase() ??
                    "A"}
                </div>
                <div className="flex flex-col space-y-0.5 min-w-0">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {email ?? "admin@yourdomain.com"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => setShowLogoutDialog(true)}
              className="flex cursor-pointer items-center gap-3 rounded-lg py-3 text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-xl border border-border bg-card text-card-foreground shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account? You will need
              to log back in to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="destructive"
              className="min-w-[110px]"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Out…
                </>
              ) : (
                "Sign Out"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
