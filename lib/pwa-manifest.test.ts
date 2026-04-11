import { describe, expect, it } from "vitest";
import { buildWebAppManifest } from "./pwa-manifest";

describe("buildWebAppManifest", () => {
  it("omits shortcuts for anonymous / public manifest", () => {
    const m = buildWebAppManifest(false);
    expect(m.shortcuts).toBeUndefined();
    expect(m.start_url).toBe("/?source=pwa");
  });

  it("includes admin shortcuts when flag is true", () => {
    const m = buildWebAppManifest(true);
    expect(m.start_url).toBe("/admin/dashboard?source=pwa");
    expect(m.shortcuts).toBeDefined();
    expect(m.shortcuts).toHaveLength(3);
    const urls = m.shortcuts!.map((s) => s.url);
    expect(urls.some((u) => u.includes("/admin/dashboard"))).toBe(true);
    expect(urls.some((u) => u.includes("/admin/leads"))).toBe(true);
  });
});
