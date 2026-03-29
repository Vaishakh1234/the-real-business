"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PublicMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isPropertyDetailPage = /^\/properties\/[^/]+/.test(pathname);

  return (
    <main
      className={cn(
        // `overflow-x-clip` avoids horizontal bleed without breaking `position: sticky`
        // (unlike `overflow-x-hidden`, which can trap sticky descendants in main).
        "min-h-screen min-w-0 overflow-x-clip bg-white md:pb-0",
        isPropertyDetailPage
          ? "pb-[max(1rem,env(safe-area-inset-bottom))]"
          : "pb-[max(5rem,env(safe-area-inset-bottom))]",
        isHome ? "pt-0" : "pt-16 md:pt-20",
      )}
    >
      {children}
    </main>
  );
}
