import { CONTACT, SITE_NAME, SOCIAL_LINKS } from "@/lib/constants/site";
import { getSiteOrigin } from "@/lib/seo/site";

/**
 * Site-wide Organization + RealEstateAgent + WebSite (SearchAction) for all public pages.
 */
export function PublicSiteJsonLd() {
  const origin = getSiteOrigin();
  const sameAs = SOCIAL_LINKS.map((l) => l.href).filter(Boolean);

  const agent: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    "@id": `${origin}/#organization`,
    name: SITE_NAME,
    url: origin,
    logo: `${origin}/logo-icon-bg.png`,
    description:
      "Real estate marketing, property consultancy, and buying & selling support in Palakkad, Kerala.",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Palakkad",
      containedInPlace: { "@type": "Country", name: "India" },
    },
  };

  if (CONTACT.email) agent.email = CONTACT.email;
  if (CONTACT.phone) agent.telephone = CONTACT.phone;
  if (CONTACT.address.line1) {
    agent.address = {
      "@type": "PostalAddress",
      addressLocality: CONTACT.address.line1,
      addressRegion: CONTACT.address.city,
      addressCountry: "IN",
    };
  }
  if (sameAs.length) agent.sameAs = sameAs;

  agent.openingHoursSpecification = [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ];

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    name: SITE_NAME,
    url: origin,
    publisher: { "@id": `${origin}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${origin}/properties?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agent) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
