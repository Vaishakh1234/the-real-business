import { describe, expect, it } from "vitest";
import { sanitizePropertyDescription } from "./sanitize-html";

describe("sanitizePropertyDescription", () => {
  it("allows alignment styles from CKEditor", () => {
    const raw =
      '<p style="text-align:center;">Centered</p><p style="text-align:right;">Right</p>';
    const out = sanitizePropertyDescription(raw);
    expect(out).toContain("Centered");
    expect(out).toContain("Right");
    expect(out).toMatch(/text-align:\s*center/i);
    expect(out).toMatch(/text-align:\s*right/i);
  });

  it("allows horizontal rules", () => {
    const out = sanitizePropertyDescription("<p>a</p><hr /><p>b</p>");
    expect(out).toMatch(/<hr\s*\/?>/i);
    expect(out).toContain("a");
    expect(out).toContain("b");
  });

  it("strips scripts and event handlers", () => {
    const out = sanitizePropertyDescription(
      '<p onclick="alert(1)">x</p><script>alert(1)</script>',
    );
    expect(out).not.toContain("script");
    expect(out).not.toContain("onclick");
    expect(out).toContain("x");
  });

  it("returns empty string for null or blank", () => {
    expect(sanitizePropertyDescription(null)).toBe("");
    expect(sanitizePropertyDescription("   ")).toBe("");
  });

  it("allows div wrappers and strips class attributes (CKEditor noise)", () => {
    const raw =
      '<div class="ck-content"><p class="ck-paragraph">Hello</p></div>';
    const out = sanitizePropertyDescription(raw);
    expect(out.toLowerCase()).toContain("<div");
    expect(out).toContain("Hello");
    expect(out).not.toContain("ck-");
    expect(out).not.toContain("class=");
  });

  it("preserves margin-left indent styles on list items", () => {
    const raw = '<ul><li style="margin-left:2em;">Indented</li></ul>';
    const out = sanitizePropertyDescription(raw);
    expect(out).toContain("Indented");
    expect(out).toMatch(/margin-left/i);
  });
});
