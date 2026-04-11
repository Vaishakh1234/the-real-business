import { test, expect, type Page } from "@playwright/test";
import { PWA_ADMIN_START_URL } from "@/lib/pwa-manifest";

const LOGIN_URL = "/admin/login";
const MANIFEST = "/manifest.webmanifest";
const PUBLIC_PWA_START = "/?source=pwa";

function emailInput(page: Page) {
  return page.getByRole("textbox", { name: /email/i });
}
function passwordInput(page: Page) {
  return page.getByPlaceholder("••••••••");
}

test.describe("PWA manifest (dynamic admin shortcuts)", () => {
  test("anonymous request has no shortcuts and cache headers discourage shared caching", async ({
    request,
  }) => {
    const res = await request.get(MANIFEST);
    expect(res.ok(), await res.text()).toBeTruthy();
    expect(res.headers()["cache-control"]).toMatch(/private/);
    expect(res.headers()["cache-control"]).toMatch(/no-store/);
    expect(res.headers().vary?.toLowerCase()).toContain("cookie");

    const body = (await res.json()) as {
      shortcuts?: unknown;
      start_url?: string;
    };
    expect(body.shortcuts).toBeUndefined();
    expect(body.start_url).toBe(PUBLIC_PWA_START);
  });

  test("after admin login, manifest includes admin shortcuts", async ({ page }) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    test.skip(!adminEmail || !adminPassword, "ADMIN_EMAIL and ADMIN_PASSWORD must be set for this test");
    if (!adminEmail || !adminPassword) return;

    await page.goto(LOGIN_URL);
    await emailInput(page).waitFor({ state: "visible", timeout: 10_000 });
    await emailInput(page).fill(adminEmail);
    await passwordInput(page).fill(adminPassword);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });

    const res = await page.request.get(MANIFEST);
    expect(res.ok(), await res.text()).toBeTruthy();
    const body = (await res.json()) as {
      shortcuts?: { url: string; name: string }[];
      start_url?: string;
    };
    expect(body.start_url).toBe(PWA_ADMIN_START_URL);
    expect(body.shortcuts).toBeDefined();
    expect(body.shortcuts!.length).toBeGreaterThanOrEqual(3);
    const urls = body.shortcuts!.map((s) => s.url).join(" ");
    expect(urls).toContain("/admin/dashboard");
    expect(urls).toContain("/admin/leads");
  });
});
