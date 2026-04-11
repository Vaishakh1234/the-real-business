import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PublicMain } from "@/components/landing/PublicMain";
import { PwaInstallProvider } from "@/components/landing/PwaInstallProvider";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { PublicSiteJsonLd } from "@/components/seo/PublicSiteJsonLd";
import { publicShellBackgroundColor } from "@/lib/constants/publicLayout";
import { CHATBOT } from "@/lib/constants/site";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PwaInstallProvider>
      <div
        className="flex min-h-dvh flex-col"
        style={{ backgroundColor: publicShellBackgroundColor }}
      >
        <PublicSiteJsonLd />
        <Navbar />
        <PublicMain>{children}</PublicMain>
        <Footer />
        {CHATBOT.enabled ? <ChatWidget /> : null}
      </div>
    </PwaInstallProvider>
  );
}
