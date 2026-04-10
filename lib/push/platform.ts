/** iOS Safari / iPadOS (excludes desktop Safari unless touch iPad). */
export function isIOSDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iOS;
}

/** PWA running in standalone (home screen) mode. */
export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const mm = window.matchMedia("(display-mode: standalone)");
  if (mm.matches) return true;
  return Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
}

export function isAndroidChrome(): boolean {
  if (typeof window === "undefined") return false;
  return /Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent);
}
