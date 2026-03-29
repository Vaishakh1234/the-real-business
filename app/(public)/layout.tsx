import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PublicMain } from "@/components/landing/PublicMain";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <PublicMain>{children}</PublicMain>
      <Footer />
    </>
  );
}
