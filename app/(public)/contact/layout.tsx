import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants/site";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";

const contactTitle = `Contact — ${SITE_NAME}`;
const contactDescription =
  "Contact The Real Business — real estate marketing, property consultancy, and buying & selling support in Palakkad, Kerala.";

export const metadata: Metadata = {
  title: contactTitle,
  alternates: { canonical: "/contact" },
  description: contactDescription,
  ...defaultPageOgTwitter("/contact", contactTitle, contactDescription),
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
