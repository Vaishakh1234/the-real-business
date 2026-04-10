"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LeadsView } from "@/components/admin/leads/LeadsView";

function LeadsViewFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#f5f5f5]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <Suspense fallback={<LeadsViewFallback />}>
        <LeadsView
          header={{
            title: "Leads",
            subtitle: "Track and manage property inquiry leads",
            breadcrumbs: [
              { label: "Admin", href: "/admin/dashboard" },
              { label: "Leads" },
            ],
          }}
        />
      </Suspense>
    </div>
  );
}
