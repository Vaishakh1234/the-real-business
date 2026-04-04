import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants/site";
import { absoluteUrl } from "@/lib/seo/site";

/** Default generated OG image route (see `app/opengraph-image.tsx`). */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
} as const;

/** Shared Open Graph + Twitter metadata for static public pages. */
export function defaultPageOgTwitter(
  path: string,
  title: string,
  description: string,
  options?: { type?: "website" | "article"; imageAlt?: string },
): Pick<Metadata, "openGraph" | "twitter"> {
  const imageAlt = options?.imageAlt ?? title;
  return {
    openGraph: {
      title,
      description,
      type: options?.type ?? "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      url: absoluteUrl(path),
      images: [{ ...DEFAULT_OG_IMAGE, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}
