import Link from "next/link";
import { FAQ_PAGE_ITEMS } from "@/lib/constants/site";

/** Rich FAQ answers with internal links (JSON-LD on `/faq` still uses plain `FAQ_PAGE_ITEMS` text). */
export function FaqAnswerBody({ globalIndex }: { globalIndex: number }) {
  const base = FAQ_PAGE_ITEMS[globalIndex];
  if (!base) return null;

  switch (globalIndex) {
    case 0:
      return (
        <>
          {base.answer}{" "}
          <Link
            href="/services"
            className="font-medium text-brand-gold hover:underline"
          >
            Explore our services
          </Link>
          .
        </>
      );
    case 1:
      return (
        <>
          Use the search bar on our{" "}
          <Link href="/" className="font-medium text-brand-gold hover:underline">
            home
          </Link>{" "}
          and{" "}
          <Link
            href="/properties"
            className="font-medium text-brand-gold hover:underline"
          >
            properties
          </Link>{" "}
          pages to filter by area, type, and budget. Save favourites to your
          wishlist and{" "}
          <Link
            href="/contact"
            className="font-medium text-brand-gold hover:underline"
          >
            contact us
          </Link>{" "}
          for a curated shortlist or site visit. We add local context on value,
          access, and documentation so listings translate into confident
          decisions.
        </>
      );
    case 2:
      return (
        <>
          Fees depend on the scope — marketing campaigns, consultancy-only
          engagements, or a full buy or sell mandate. We explain costs clearly
          before you commit.{" "}
          <Link
            href="/contact"
            className="font-medium text-brand-gold hover:underline"
          >
            Contact us
          </Link>{" "}
          for a breakdown tailored to your property and goals.
        </>
      );
    case 3:
      return (
        <>
          Yes. Reach out via our{" "}
          <Link
            href="/post-property"
            className="font-medium text-brand-gold hover:underline"
          >
            post-property flow
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="font-medium text-brand-gold hover:underline"
          >
            contact page
          </Link>
          . We discuss positioning, presentation, channels, and pricing, then
          promote your property to serious buyers with transparent updates
          throughout.
        </>
      );
    case 4:
      return (
        <>
          We coordinate with your advocate on title checks, encumbrance
          certificates, sale deeds, and registration. We are brokers and
          consultants, not lawyers — we keep paperwork aligned with the deal you
          agreed. See our{" "}
          <Link
            href="/guides/property-document-checklist-kerala"
            className="font-medium text-brand-gold hover:underline"
          >
            Kerala property document checklist
          </Link>{" "}
          for what to verify early.
        </>
      );
    case 5:
      return (
        <>
          Tell us which listing interests you via the{" "}
          <Link
            href="/contact"
            className="font-medium text-brand-gold hover:underline"
          >
            contact form
          </Link>
          , email, or phone. We confirm with the owner, propose visit times, and
          join you so boundaries, access, and condition are clear before you
          offer.
        </>
      );
    case 6:
      return (
        <>
          Share your budget, preferred localities in Palakkad district, and
          property type. We shortlist matches, explain trade-offs with
          consultancy-style clarity, and support you through offer and closing
          if you choose. Start on our{" "}
          <Link
            href="/properties"
            className="font-medium text-brand-gold hover:underline"
          >
            properties directory
          </Link>{" "}
          or{" "}
          <Link href="/areas" className="font-medium text-brand-gold hover:underline">
            browse by area
          </Link>
          .
        </>
      );
    default:
      return <>{base.answer}</>;
  }
}
