"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminSettings, AdminSettingsUpdate } from "@/types";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function useAdminLeadPush() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [vapidConfigured, setVapidConfigured] = useState<boolean | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [pushActive, setPushActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [patching, setPatching] = useState(false);
  /** Prevents overlapping enable runs (e.g. double-tap) before React state updates. */
  const enableInFlightRef = useRef(false);

  const supported = usePushSupported();

  const refresh = useCallback(async () => {
    setLoading(true);
    setSettingsError(null);
    try {
      const [settingsRes, vapidRes] = await Promise.all([
        fetch("/api/admin/settings", { credentials: "include" }),
        fetch("/api/admin/push/vapid-key", { credentials: "include" }),
      ]);

      // Bug 3 fix: keep a reference to the parsed settings so we can gate
      // pushActive on the account-level browser_notifications DB flag below.
      let loadedSettings: AdminSettings | null = null;

      if (!settingsRes.ok) {
        const j = await settingsRes.json().catch(() => ({}));
        setSettings(null);
        setSettingsError(
          typeof j.error === "string"
            ? j.error
            : "Could not load admin settings.",
        );
      } else {
        const j = (await settingsRes.json()) as { data: AdminSettings };
        loadedSettings = j.data;
        setSettings(j.data);
      }

      const vj = (await vapidRes.json()) as {
        configured: boolean;
        publicKey: string | null;
      };
      setVapidConfigured(vj.configured);
      setPublicKey(vj.publicKey);

      let endpoint: string | undefined;
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        const sub = await reg?.pushManager.getSubscription();
        endpoint = sub?.endpoint;
      }

      // Bug 3 fix: if the DB account-level flag is explicitly off, treat this
      // device as inactive regardless of what the subscription table says.
      if (loadedSettings && !loadedSettings.browser_notifications) {
        setPushActive(false);
      } else if (endpoint && vj.configured) {
        const st = await fetch(
          `/api/admin/push/status?endpoint=${encodeURIComponent(endpoint)}`,
          { credentials: "include" },
        );
        const sj = (await st.json()) as { isRegistered?: boolean };
        setPushActive(Boolean(sj.isRegistered));
      } else {
        setPushActive(false);
      }
    } catch (e) {
      console.error(e);
      setSettingsError("Failed to load notification settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const enablePush = useCallback(async () => {
    if (!publicKey || !vapidConfigured) {
      throw new Error("Push is not configured on the server.");
    }
    if (!supported) {
      throw new Error("Notifications are not supported in this browser.");
    }

    if (Notification.permission === "denied") {
      throw new Error("NOTIFICATION_DENIED");
    }

    if (enableInFlightRef.current) {
      return;
    }
    enableInFlightRef.current = true;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const appKey = urlBase64ToUint8Array(publicKey);
      let sub: PushSubscription;
      try {
        // Do not call Notification.requestPermission() here: on many mobile
        // browsers (Chrome Android) combining it with pushManager.subscribe()
        // triggers two permission UIs. subscribe() requests notification
        // permission when needed (single prompt).
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          // @ts-expect-error TS 5.7 ArrayBufferLike vs ArrayBuffer in PushSubscriptionOptions
          applicationServerKey: appKey,
        });
      } catch (e) {
        const name = e instanceof DOMException ? e.name : "";
        if (name === "NotAllowedError" || name === "AbortError") {
          throw new Error("NOTIFICATION_DENIED");
        }
        throw e;
      }

      // Patch DB only after we have a subscription (permission + push path OK).
      const patchRes = await fetch("/api/admin/settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifications_enabled: true,
          lead_alerts: true,
          browser_notifications: true,
        }),
      });
      if (!patchRes.ok) {
        const j = await patchRes.json().catch(() => ({}));
        await sub.unsubscribe().catch(() => {});
        throw new Error(
          typeof j.error === "string" ? j.error : "Could not update settings.",
        );
      }
      const pj = (await patchRes.json()) as { data: AdminSettings };
      setSettings(pj.data);

      const json = sub.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        throw new Error("Invalid push subscription.");
      }

      const save = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
        }),
      });
      if (!save.ok) {
        const j = await save.json().catch(() => ({}));
        await sub.unsubscribe().catch(() => {});
        throw new Error(
          typeof j.error === "string"
            ? j.error
            : "Could not save subscription.",
        );
      }

      setPushActive(true);
    } finally {
      enableInFlightRef.current = false;
      setBusy(false);
    }
  }, [publicKey, supported, vapidConfigured]);

  const disablePush = useCallback(async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      const endpoint = sub?.endpoint;
      await sub?.unsubscribe();

      if (endpoint) {
        const delRes = await fetch("/api/admin/push/subscribe", {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
        if (!delRes.ok) {
          const j = await delRes.json().catch(() => ({}));
          throw new Error(
            typeof j.error === "string"
              ? j.error
              : "Could not remove this device from lead alerts.",
          );
        }
      }

      setPushActive(false);
    } finally {
      setBusy(false);
    }
  }, []);

  const patchSettings = useCallback(async (patch: AdminSettingsUpdate) => {
    setPatching(true);
    try {
      const patchRes = await fetch("/api/admin/settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!patchRes.ok) {
        const j = await patchRes.json().catch(() => ({}));
        throw new Error(
          typeof j.error === "string" ? j.error : "Could not update settings.",
        );
      }
      const pj = (await patchRes.json()) as { data: AdminSettings };
      setSettings(pj.data);
      if (patch.browser_notifications === false) {
        setPushActive(false);
      }
      return pj.data;
    } finally {
      setPatching(false);
    }
  }, []);

  return {
    settings,
    settingsError,
    vapidConfigured,
    publicKey,
    pushActive,
    loading,
    busy,
    patching,
    supported,
    refresh,
    patchSettings,
    enablePush,
    disablePush,
  };
}
