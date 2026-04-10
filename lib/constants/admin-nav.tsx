import {
  LayoutDashboard,
  Home,
  Tags,
  UserPlus,
  FileBarChart,
  Settings,
  Bell,
  Download,
  type LucideIcon,
} from "lucide-react";

export const adminNavItems: {
  label: string;
  href: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-500",
  },
  {
    label: "Properties",
    href: "/admin/properties",
    icon: Home,
    color: "text-emerald-600",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
    color: "text-amber-600",
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: UserPlus,
    color: "text-violet-600",
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    color: "text-rose-600",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: FileBarChart,
    color: "text-orange-600",
  },
  {
    label: "Install app",
    href: "/admin/install-app",
    icon: Download,
    color: "text-sky-600",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    color: "text-slate-600",
  },
];

/** Mobile bottom bar items; Settings, Notifications, Install omitted (sidebar / header). */
export const adminBottomNavItems = adminNavItems.filter(
  (item) =>
    item.href !== "/admin/settings" &&
    item.href !== "/admin/notifications" &&
    item.href !== "/admin/install-app",
);

export const adminPageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/properties": "Properties",
  "/admin/categories": "Categories",
  "/admin/leads": "Leads",
  "/admin/notifications": "Notifications",
  "/admin/settings": "Settings",
  "/admin/reports": "Reports",
  "/admin/install-app": "Install app",
};

export function getAdminPageTitle(pathname: string): string {
  if (adminPageTitles[pathname]) return adminPageTitles[pathname];
  if (pathname.startsWith("/admin/properties/")) return "Property";
  return "Admin";
}
