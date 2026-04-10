"use client";

import { DashboardView } from "@/components/admin/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      {/* Title block: clean sans-serif title + thin separator (ref design) */}
      <header className="bg-[#f5f5f5] pt-4 pb-4 sm:pt-5 sm:pb-4 lg:pt-6 lg:pb-5">
        <h1 className="font-semibold tracking-tight text-[#1a1a1a] text-2xl sm:text-3xl lg:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1 text-base text-muted-foreground sm:text-[17px]">
          Overview of your properties, leads, and activity.
        </p>
      </header>
      <div className="space-y-6 sm:space-y-8">
        <DashboardView />
      </div>
    </div>
  );
}
