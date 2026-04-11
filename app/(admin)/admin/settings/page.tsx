import { AdminSettingsView } from "@/components/admin/settings/AdminSettingsView";
import { PageHeader } from "@/components/admin/layout/PageHeader";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-full bg-admin-main-bg">
      <PageHeader
        className="bg-transparent"
        title="Settings"
        subtitle={<p>Lead alerts and device tips for this browser.</p>}
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Settings" },
        ]}
        backHref="/admin/dashboard"
        backLabel="Go to dashboard"
      />
      {/* Horizontal padding comes from admin layout main; bottom padding clears fixed bottom nav on mobile. */}
      <div className="mx-auto w-full max-w-5xl pt-1 pb-[max(6.5rem,env(safe-area-inset-bottom))] sm:pb-10 lg:pb-10">
        <AdminSettingsView variant="page" />
      </div>
    </div>
  );
}
