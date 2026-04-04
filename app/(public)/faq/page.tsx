import type { Metadata } from "next";
import { FaqMarketingSection } from "@/components/faq/FaqMarketingSection";
import { NewsletterStayUpdated } from "@/components/faq/NewsletterStayUpdated";
import { FAQ_PAGE_ITEMS, SITE_NAME } from "@/lib/constants/site";

const description = `Answers about ${SITE_NAME} — services, search, fees, listings, visits, and legal support in Palakkad real estate. Subscribe for updates.`;

export const metadata: Metadata = {
  title: `FAQ — ${SITE_NAME}`,
  description,
  openGraph: {
    title: `FAQ — ${SITE_NAME}`,
    description,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `FAQ — ${SITE_NAME}`,
    description,
  },
};

function FaqJsonLd() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_PAGE_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
    />
  );
}

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />
      <FaqMarketingSection />
      <NewsletterStayUpdated />
    </>
  );
}
