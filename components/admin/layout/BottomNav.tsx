"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminBottomNavItems } from "@/lib/constants/admin-nav";
import { cn } from "@/lib/utils";

const BOTTOM_NAV_HEIGHT = "4rem"; // 64px, min touch 48px

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-admin-sidebar-border bg-admin-sidebar-bg pb-[env(safe-area-inset-bottom)] pt-2 lg:hidden"
      style={{ minHeight: BOTTOM_NAV_HEIGHT }}
    >
      {adminBottomNavItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1.5 text-[11px] font-medium leading-tight transition-colors",
              isActive
                ? "text-admin-sidebar-active-indicator"
                : "text-admin-sidebar-text-muted hover:bg-admin-sidebar-hover hover:text-admin-sidebar-text",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon
              className={cn(
                "h-[1.125rem] w-[1.125rem] shrink-0 sm:h-5 sm:w-5",
                isActive ? "text-admin-sidebar-active-indicator" : item.color,
              )}
              strokeWidth={2.25}
            />
            <span className="max-w-[3.75rem] truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
