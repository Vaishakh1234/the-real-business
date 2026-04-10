/* global self, clients */
const DEFAULT_ICON = "/icons/icon-192.png";
const DEFAULT_URL = "/admin/leads";

/** Required for installable PWA (pass-through; push handlers stay primary). */
self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});

self.addEventListener("push", function (event) {
  let payload = {
    title: "The Real Business",
    body: "You have a new notification.",
    url: DEFAULT_URL,
    icon: DEFAULT_ICON,
    tag: "lead-generic",
  };
  try {
    if (event.data) {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    }
  } catch {
    try {
      const text = event.data && event.data.text();
      if (text) payload = { ...payload, body: text };
    } catch {
      /* ignore */
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || DEFAULT_ICON,
      badge: DEFAULT_ICON,
      tag: payload.tag || "lead",
      renotify: true,
      vibrate: [180, 80, 180],
      data: { url: payload.url || DEFAULT_URL, leadId: payload.leadId },
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const targetPath = event.notification.data?.url || DEFAULT_URL;
  const url = new URL(targetPath, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
