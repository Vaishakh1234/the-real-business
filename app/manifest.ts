import type { MetadataRoute } from "next";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { buildWebAppManifest } from "@/lib/pwa-manifest";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const includeAdminShortcuts = await isAdminAuthenticated();
  return buildWebAppManifest(includeAdminShortcuts);
}
