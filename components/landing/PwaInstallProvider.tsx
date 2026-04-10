"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  isIosDevice,
  isStandalonePwa,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa-install";

type PwaInstallContextValue = {
  ready: boolean;
  /** True when running in standalone / home-screen mode or after a successful install. */
  isStandalone: boolean;
  /** Chromium only: saved from `beforeinstallprompt` after `preventDefault`. */
  deferredPrompt: BeforeInstallPromptEvent | null;
  installing: boolean;
  runInstall: () => Promise<void>;
  isIos: boolean;
  /** Show the `#install-btn` affordance (Chromium/Edge/Android Chrome when installable). */
  showInstallButton: boolean;
  /** Show iOS “Share → Add to Home Screen” hint (no `beforeinstallprompt` on Safari). */
  showIosInstallHint: boolean;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installedViaAppInstalled, setInstalledViaAppInstalled] =
    useState(false);

  useEffect(() => {
    setIsIos(isIosDevice());
    if (isStandalonePwa()) {
      setIsStandalone(true);
      setReady(true);
      return;
    }
    setIsStandalone(false);
    setReady(true);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setInstalledViaAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* non-fatal */
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const runInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    const promptEvent = deferredPrompt;
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch {
      /* user dismissed or prompt failed */
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const hideInstallChrome =
    !ready || isStandalone || installedViaAppInstalled || isIos;
  const showInstallButton = Boolean(deferredPrompt) && !hideInstallChrome;
  const showIosInstallHint =
    ready && isIos && !isStandalone && !installedViaAppInstalled;

  const value = useMemo(
    () => ({
      ready,
      isStandalone: isStandalone || installedViaAppInstalled,
      deferredPrompt,
      installing,
      runInstall,
      isIos,
      showInstallButton,
      showIosInstallHint,
    }),
    [
      ready,
      isStandalone,
      installedViaAppInstalled,
      deferredPrompt,
      installing,
      runInstall,
      isIos,
      showInstallButton,
      showIosInstallHint,
    ],
  );

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall(): PwaInstallContextValue {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) {
    throw new Error("usePwaInstall must be used within PwaInstallProvider");
  }
  return ctx;
}
