import DOMPurify from "isomorphic-dompurify";

/**
 * If markup was stored entity-encoded (e.g. &lt;h1&gt;...), DOMPurify keeps it as text and
 * dangerouslySetInnerHTML shows raw tags on screen. Decode first, then sanitize.
 */
function looksLikeEscapedHtmlMarkup(s: string): boolean {
  const t = s.trim();
  if (!t.includes("&")) return false;
  return (
    t.startsWith("&lt;") ||
    t.includes("&lt;h") ||
    t.includes("&lt;p") ||
    t.includes("&lt;ul") ||
    t.includes("&lt;ol") ||
    t.includes("&lt;blockquote") ||
    t.includes("&lt;strong") ||
    t.includes("&lt;em") ||
    t.includes("&amp;lt;")
  );
}

/** Decode named/numeric entities; repeat so &amp;lt; becomes < (bounded). */
function decodeHtmlEntities(input: string): string {
  let s = input;
  for (let i = 0; i < 8; i++) {
    const before = s;
    s = s
      .replace(/&#x([0-9a-fA-F]+);/gi, (_, h) =>
        String.fromCodePoint(parseInt(h, 16)),
      )
      .replace(/&#(\d+);/g, (_, n) =>
        String.fromCodePoint(parseInt(n, 10)),
      )
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, "\u00a0")
      .replace(/&amp;/g, "&");
    if (s === before) break;
  }
  return s;
}

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.hasAttribute("href")) {
    node.setAttribute("rel", "noopener noreferrer");
    const href = node.getAttribute("href") ?? "";
    if (/^https?:\/\//i.test(href)) {
      node.setAttribute("target", "_blank");
    }
  }
});

const ALLOWED_TAGS = [
  "p",
  "br",
  "span",
  "div",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "hr",
] as const;

/**
 * Rich text from CKEditor: alignment and indent use `style`; we do not allow `class`
 * so editor-only classes (ck-heading_*, etc.) are dropped and the site styles by tag.
 */
const DESCRIPTION_ALLOWED_ATTR = ["href", "target", "rel", "style"] as const;

/** Re-export: class string lives in components/** so Tailwind JIT picks it up in Next.js CSS builds. */
export { PROPERTY_DESCRIPTION_HTML_CLASS } from "@/components/properties/propertyDescriptionHtmlClass";

/** Safe HTML for property descriptions edited in CKEditor (display only). */
export function sanitizePropertyDescription(html: string | null | undefined): string {
  let raw = html == null ? "" : String(html).trim();
  if (!raw) return "";

  if (looksLikeEscapedHtmlMarkup(raw)) {
    raw = decodeHtmlEntities(raw).trim();
  }

  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [...DESCRIPTION_ALLOWED_ATTR],
    ALLOW_DATA_ATTR: false,
  });
}
