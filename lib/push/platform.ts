import { isStandalonePwa } from "@/lib/pwa-install";

/** iOS Safari / iPadOS (excludes desktop Safari unless touch iPad). */
export function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iOS;
}

/** PWA running in standalone / installed (home screen) mode. */
export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return isStandalonePwa();
}

export function isAndroidChrome(): boolean {
  if (typeof window === "undefined") return false;
  return /Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent);
}
