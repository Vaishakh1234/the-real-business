import { AdminLeadPushPanel } from "@/components/admin/notifications/AdminLeadPushPanel";
import { PageHeader } from "@/components/admin/layout/PageHeader";

export default function AdminNotificationsPage() {
  return (
    <div className="min-h-full bg-[#f5f5f5]">
      <PageHeader
        title="Lead alerts"
        subtitle={
          <p>
            Browser push for new leads and enquiries. Enable once on each phone,
            tablet, or computer you use.
          </p>
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Lead alerts" },
        ]}
        backHref="/admin/dashboard"
        backLabel="Back"
      />
      <div className="px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <AdminLeadPushPanel />
      </div>
    </div>
  );
}
