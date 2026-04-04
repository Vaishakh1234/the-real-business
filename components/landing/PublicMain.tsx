"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PUBLIC_ROUTES_WITH_TOP_HERO } from "@/lib/constants/publicLayout";

export function PublicMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  /** Full-bleed hero under fixed nav — no top padding or main’s white bg shows through the transparent header */
  const heroFlushTop = isHome || PUBLIC_ROUTES_WITH_TOP_HERO.has(pathname);
  const isPropertyDetailPage = /^\/properties\/[^/]+/.test(pathname);

  return (
    <main
      className={cn(
        // `overflow-x-clip` avoids horizontal bleed without breaking `position: sticky`
        // (unlike `overflow-x-hidden`, which can trap sticky descendants in main).
        "flex-1 min-w-0 overflow-x-clip md:pb-0",
        isPropertyDetailPage
          ? "pb-[max(1rem,env(safe-area-inset-bottom))]"
          : "pb-[max(5rem,env(safe-area-inset-bottom))]",
        heroFlushTop ? "pt-0" : "pt-16 md:pt-20",
      )}
    >
      {children}
    </main>
  );
}
