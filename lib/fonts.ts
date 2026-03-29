import { Tinos } from "next/font/google";

/**
 * Logo / wordmark typography: prefer system Times New Roman, then Times, then a
 * loaded serif. Times New Roman is not redistributable as a webfont; Tinos (OFL)
 * is served by Next and is designed as a Times-compatible substitute on Linux etc.
 */
export const siteWordmarkFont = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-site-wordmark",
  adjustFontFallback: true,
});
