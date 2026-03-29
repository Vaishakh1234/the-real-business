import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/properties/WishlistPageClient";

export const metadata: Metadata = {
  title: "Saved listings — The Real Business",
  description:
    "View properties you have saved on this device. Browse and manage your wishlist.",
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}
