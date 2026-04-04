import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WishlistPageClient } from "@/components/properties/WishlistPageClient";
import { SITE_NAME } from "@/lib/constants/site";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";

const wishTitle = `Saved listings — ${SITE_NAME}`;
const wishDescription =
  "View properties you have saved on this device. Browse and manage your wishlist.";

export const metadata: Metadata = {
  title: wishTitle,
  alternates: { canonical: "/wishlist" },
  description: wishDescription,
  ...defaultPageOgTwitter("/wishlist", wishTitle, wishDescription),
};

export default function WishlistPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Saved listings" }]}
        currentPath="/wishlist"
      />
      <WishlistPageClient />
    </>
  );
}
