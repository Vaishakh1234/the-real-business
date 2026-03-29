import type { ReactNode } from "react";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { cn } from "@/lib/utils";

export function HomePortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={cn(publicContentFrameClass, "py-10 sm:py-12 lg:py-14")}>
      {children}
    </div>
  );
}
