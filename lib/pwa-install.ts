/** Chromium `beforeinstallprompt` (not in lib.dom by default everywhere). */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * CSS display modes used when the app is not running as a normal browser tab
 * (installed PWA, home-screen shortcut, some desktop windowed installs).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode
 */
const INSTALLED_DISPLAY_MODES = [
  "standalone",
  "fullscreen",
  "minimal-ui",
  "window-controls-overlay",
] as const;

/**
 * True when the app is running as an installed / home-screen web app.
 * SSR: returns `true` so install affordances stay hidden until the client hydrates.
 */
export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return true;
  for (const mode of INSTALLED_DISPLAY_MODES) {
    try {
      if (window.matchMedia(`(display-mode: ${mode})`).matches) return true;
    } catch {
      /* unknown mode in very old engines */
    }
  }
  return Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone,
  );
}

/**
 * Listen for display-mode changes (e.g. rare transitions). Unsubscribe on cleanup.
 */
export function subscribeStandalonePwaChange(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mqs = INSTALLED_DISPLAY_MODES.map((mode) =>
    window.matchMedia(`(display-mode: ${mode})`),
  );
  const handler = () => onChange();
  mqs.forEach((mq) => mq.addEventListener("change", handler));
  return () => mqs.forEach((mq) => mq.removeEventListener("change", handler));
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
