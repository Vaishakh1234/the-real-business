import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PublicMain } from "@/components/landing/PublicMain";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { CHATBOT } from "@/lib/constants/site";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <PublicMain>{children}</PublicMain>
      <Footer />
      {CHATBOT.enabled ? <ChatWidget /> : null}
    </div>
  );
}
