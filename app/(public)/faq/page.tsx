import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqMarketingSection } from "@/components/faq/FaqMarketingSection";
import { NewsletterStayUpdated } from "@/components/faq/NewsletterStayUpdated";
import { FAQ_PAGE_ITEMS, SITE_NAME } from "@/lib/constants/site";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";

const faqTitle = `FAQ — ${SITE_NAME}`;
const description = `Answers about ${SITE_NAME} — services, search, fees, listings, visits, and legal support in Palakkad real estate. Subscribe for updates.`;

export const metadata: Metadata = {
  title: faqTitle,
  alternates: { canonical: "/faq" },
  description,
  ...defaultPageOgTwitter("/faq", faqTitle, description),
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
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        currentPath="/faq"
      />
      <FaqMarketingSection />
      <NewsletterStayUpdated />
    </>
  );
}
