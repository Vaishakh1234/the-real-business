import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Install admin app",
  description:
    "Install The Real Business as an app for quick access to the admin dashboard, leads, and notifications.",
};

export default function AdminInstallAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
