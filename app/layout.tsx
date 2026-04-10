import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { siteWordmarkFont } from "@/lib/fonts";
import { getMetadataBase } from "@/lib/seo/site";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { NetworkStatusListener } from "@/components/NetworkStatusListener";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a1a",
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default:
      "The Real Business — Real Estate Marketing, Property Consultancy & Palakkad Deals",
    template: "%s | The Real Business",
  },
  description:
    "Real estate marketing, property consultancy, and buying & selling support in Palakkad, Kerala. Listings, advice, and end-to-end help with The Real Business.",
  keywords: [
    "real estate marketing Palakkad",
    "property consultancy Kerala",
    "property buying selling support Palakkad",
    "Palakkad real estate",
    "property consultant Kerala",
    "buy property Palakkad",
    "sell property Palakkad",
    "The Real Business",
  ],
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "The Real Business",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "The Real Business",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${inter.className} ${lora.variable} ${siteWordmarkFont.variable}`}
      >
        <QueryProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <NetworkStatusListener />
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
