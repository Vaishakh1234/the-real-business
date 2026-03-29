/**
 * Hosts for which `next/image` may run the built-in optimizer (server-side fetch + resize).
 * Keep this list small: the optimizer refuses URLs whose DNS resolves to “private” IPs.
 * Supabase storage often resolves via NAT64 / IPv6 forms (`64:ff9b::…`) and fails with
 * “resolved to private ip” even when the public HTTPS URL is valid — so use
 * `<Image unoptimized />` for `*.supabase.co` (browser loads the URL directly; `remotePatterns`
 * in next.config still allows those src values on `<Image>`).
 *
 * Omit `search` on remote patterns so URLs with query strings (e.g. `?w=800`) match.
 * For any other HTTPS URL, use `unoptimized` so it behaves like a normal `<img>`.
 */
export const IMAGE_OPTIMIZE_EXACT_HOSTS = [
  "images.unsplash.com",
  "placehold.co",
] as const;

export function isRemoteImageOptimizedUrl(url: string | null | undefined): boolean {
  if (!url?.trim()) return false;
  try {
    const u = new URL(url.trim());
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    const h = u.hostname.toLowerCase();
    return IMAGE_OPTIMIZE_EXACT_HOSTS.some((allowed) => h === allowed);
  } catch {
    return false;
  }
}
