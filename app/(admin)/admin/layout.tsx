import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { Sidebar } from "@/components/admin/layout/Sidebar";
import { Header } from "@/components/admin/layout/Header";
import { BottomNav } from "@/components/admin/layout/BottomNav";
import { MobileNavDrawer } from "@/components/admin/layout/MobileNavDrawer";
import { AdminClientWrapper } from "@/components/admin/layout/AdminClientWrapper";
import { PwaInstallProvider } from "@/components/landing/PwaInstallProvider";

function isAdminLoginPath(pathname: string): boolean {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const onLoginPage = isAdminLoginPath(pathname);

  if (!onLoginPage) {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      redirect("/admin/login");
    }
  }

  if (onLoginPage) {
    return <>{children}</>;
  }

  return (
    <PwaInstallProvider>
      <AdminClientWrapper>
        <Sidebar />
        <Header />
        {/* Fixed header: use explicit pt-* only — py-* overrides padding-top and causes overlap. */}
        <main className="min-h-full bg-admin-main-bg px-4 pt-16 pb-[max(5rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pt-[4.5rem] lg:pb-6">
          {children}
        </main>
        <BottomNav />
        <MobileNavDrawer />
      </AdminClientWrapper>
    </PwaInstallProvider>
  );
}
