import {
  LayoutDashboard,
  Home,
  Tags,
  UserPlus,
  FileBarChart,
  Bell,
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
    label: "Alerts",
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
];

/** Mobile bottom bar items; Alerts omitted (header has the bell to notifications). */
export const adminBottomNavItems = adminNavItems.filter(
  (item) => item.href !== "/admin/notifications",
);

export const adminPageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/properties": "Properties",
  "/admin/categories": "Categories",
  "/admin/leads": "Leads",
  "/admin/notifications": "Lead alerts",
  "/admin/reports": "Reports",
};

export function getAdminPageTitle(pathname: string): string {
  if (adminPageTitles[pathname]) return adminPageTitles[pathname];
  if (pathname.startsWith("/admin/properties/")) return "Property";
  return "Admin";
}
