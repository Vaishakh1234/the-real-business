"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardView } from "@/components/admin/dashboard/DashboardView";
import { usePwaInstall } from "@/components/landing/PwaInstallProvider";

export default function DashboardPage() {
  const { ready, isStandalone } = usePwaInstall();
  const showInstallApp = ready && !isStandalone;

  return (
    <div className="min-h-full bg-[#f5f5f5]">
      {/* Title block: clean sans-serif title + thin separator (ref design) */}
      <header className="bg-[#f5f5f5] pt-4 pb-4 sm:pt-5 sm:pb-4 lg:pt-6 lg:pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="font-semibold tracking-tight text-[#1a1a1a] text-2xl sm:text-3xl lg:text-4xl">
              Dashboard
            </h1>
            <p className="mt-1 text-base text-muted-foreground sm:text-[17px]">
              Overview of your properties, leads, and activity.
            </p>
          </div>
          {showInstallApp ? (
            <Button
              variant="outline"
              size="sm"
              className="h-10 shrink-0 self-start rounded-xl border-brand-gold/35 bg-white/90 shadow-sm backdrop-blur-sm hover:border-brand-gold/55 hover:bg-brand-gold-muted sm:mt-1"
              asChild
            >
              <Link
                href="/admin/install-app"
                className="inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4 shrink-0" aria-hidden />
                Install app
              </Link>
            </Button>
          ) : null}
        </div>
      </header>
      <div className="space-y-6 sm:space-y-8">
        <DashboardView />
      </div>
    </div>
  );
}
