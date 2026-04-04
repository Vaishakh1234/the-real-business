import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  GUIDE_SLUGS,
  type GuideSlug,
  getGuideBySlug,
} from "@/lib/constants/guides";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { SITE_NAME } from "@/lib/constants/site";
import { absoluteUrl } from "@/lib/seo/site";

type Props = { params: Promise<{ slug: string }> };

function isGuideSlug(s: string): s is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(s);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuideBySlug(slug);
  if (!g) return { title: "Guide not found" };
  const path = `/guides/${g.slug}`;
  return {
    title: g.title,
    alternates: { canonical: path },
    description: g.description,
    openGraph: {
      title: g.title,
      description: g.description,
      type: "article",
      locale: "en_IN",
      siteName: SITE_NAME,
      url: absoluteUrl(path),
    },
    twitter: {
      card: "summary_large_image",
      title: g.title,
      description: g.description,
    },
  };
}

function ArticleJsonLd({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}) {
  const url = absoluteUrl(`/guides/${slug}`);
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo-icon-bg.png") },
    },
    inLanguage: "en-IN",
    mainEntityOfPage: url,
    datePublished: "2026-04-01",
    dateModified: "2026-04-04",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
    />
  );
}

function GuideBody({ slug }: { slug: GuideSlug }) {
  const block =
    "max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-charcoal [&_h2]:pt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:font-medium [&_a]:text-brand-gold hover:[&_a]:underline";

  if (slug === "property-buying-guide-palakkad") {
    return (
      <div className={block}>
        <p>
          Buying property in <strong>Palakkad district</strong> works best when
          you separate three things: what you are willing to pay, what the
          documents actually say, and what on-ground access and neighbourhood
          context mean for daily life. {SITE_NAME} supports buyers with
          shortlisting, viewings, pricing context, and coordination with your
          advocate — we are brokers and consultants, not a substitute for legal
          title opinion.
        </p>
        <h2>Budget, location, and property type</h2>
        <p>
          Start with a realistic budget including registration, stamp duty, and
          any interior or boundary work. Decide whether you need{" "}
          <Link href="/properties?structure_type=plot">plots or land</Link>, a{" "}
          <Link href="/properties?structure_type=house">house or villa</Link>,
          or a rental yield asset. Use our <Link href="/areas">area pages</Link>{" "}
          to understand how Ottapalam, Chittur, Mannarkkad, and Palakkad town
          differ in commute patterns and typical stock.
        </p>
        <h2>Documentation you should understand (not skip)</h2>
        <p>
          Before you advance token money, your advocate should review title
          flow, encumbrance certificate (EC) continuity, tax receipts, and
          survey/sketch alignment with physical boundaries. Our{" "}
          <Link href="/guides/property-document-checklist-kerala">
            Kerala document checklist
          </Link>{" "}
          lists common papers buyers ask for in the state.
        </p>
        <h2>Offer, agreement, and registration</h2>
        <p>
          Once terms are clear, agreements capture milestones, payment schedule,
          and possession. Registration happens at the sub-registrar office with
          stamp duty and registration charges as applicable — see our{" "}
          <Link href="/guides/property-registration-process-kerala">
            registration process guide
          </Link>{" "}
          for a step-oriented overview (rates change; verify current tables with
          your advocate).
        </p>
        <h2>How we help</h2>
        <p>
          We combine <Link href="/services">marketing reach</Link>,{" "}
          <Link href="/services">consultancy</Link>, and transaction support so
          you are not negotiating alone. <Link href="/contact">Contact us</Link>{" "}
          with your preferred locality and budget to map a practical next step.
        </p>
      </div>
    );
  }

  if (slug === "nri-property-investment-kerala") {
    return (
      <div className={block}>
        <p>
          NRIs often buy in Palakkad for family use, land-bank style holdings,
          or long-term appreciation tied to infrastructure. Distance makes clear
          documentation and a reliable on-ground team essential — we align
          viewings, owner meetings, and updates with your advocate&apos;s
          timeline.
        </p>
        <h2>Power of attorney and representation</h2>
        <p>
          Many NRIs execute a power of attorney (PoA) for a trusted relative or
          representative to complete registration steps. PoA drafting and
          acceptance rules are legal matters — your advocate should structure
          this for the specific transaction and jurisdiction.
        </p>
        <h2>Repatriation and banking (high level)</h2>
        <p>
          Funding rules, FEMA considerations, and repatriation limits are
          outside the scope of brokerage advice. Use your bank and chartered
          accountant for compliance; we focus on property fit, pricing bands,
          and execution support in Palakkad.
        </p>
        <h2>Remote shortlisting</h2>
        <p>
          Browse <Link href="/properties">active listings</Link>, save to your{" "}
          <Link href="/wishlist">wishlist</Link>, and ask us for video
          walkthroughs or family-assisted site visits where owners agree.
        </p>
      </div>
    );
  }

  if (slug === "property-document-checklist-kerala") {
    const items = [
      "Title deed / parent documents tracing ownership flow",
      "Encumbrance certificate (EC) for an adequate period",
      "Property tax receipts and local body dues status",
      "Possession certificate and building tax where applicable",
      "Approved plan / permit trail for constructed portions (if claimed)",
      "Survey sketch / location sketch vs on-ground boundaries",
      "Identity and revenue documents sellers provide for registration",
      "Any partition deed, family settlement, or court orders affecting share",
    ];
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Kerala property document checklist",
      numberOfItems: items.length,
      itemListElement: items.map((name, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name,
      })),
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
        <div className={block}>
          <p>
            This checklist is educational — your advocate decides what applies
            to your specific parcel, building, or transaction. {SITE_NAME}{" "}
            coordinates with your lawyer; we do not issue legal opinions.
          </p>
          <h2>Core documents buyers often review</h2>
          <ul>
            {items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p>
            Ready to inspect a specific listing? Open the property on our site
            and use the enquiry sidebar, or start from{" "}
            <Link href="/contact">contact</Link>.
          </p>
        </div>
      </>
    );
  }

  if (slug === "property-registration-process-kerala") {
    const howToLd = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Property registration overview in Kerala",
      step: [
        {
          "@type": "HowToStep",
          name: "Due diligence",
          text: "Complete title and encumbrance review with your advocate.",
        },
        {
          "@type": "HowToStep",
          name: "Stamp duty and e-stamping",
          text: "Calculate applicable stamp duty and obtain stamp paper or e-stamp per current rules.",
        },
        {
          "@type": "HowToStep",
          name: "Sub-registrar appointment",
          text: "Book or queue at the relevant SRO with parties and witnesses as required.",
        },
        {
          "@type": "HowToStep",
          name: "Execution and registration",
          text: "Execute the sale deed; register and collect the registered document.",
        },
      ],
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
        <div className={block}>
          <p>
            Registration formalities in Kerala evolve with e-governance
            initiatives. Use this page as a conversation starter with your
            advocate and the sub-registrar office — not as tax or legal advice.
          </p>
          <h2>Typical flow</h2>
          <ol>
            <li>
              Agree commercial terms and sign a written agreement if needed.
            </li>
            <li>Prepare the sale deed draft with your advocate.</li>
            <li>Pay stamp duty and registration charges as applicable.</li>
            <li>
              Appear at the SRO for biometric/signature steps as required.
            </li>
            <li>Collect the registered deed and update utility/tax records.</li>
          </ol>
          <p>
            For buying strategy in Palakkad, read our{" "}
            <Link href="/guides/property-buying-guide-palakkad">
              Palakkad buying guide
            </Link>
            .
          </p>
        </div>
      </>
    );
  }

  return null;
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  if (!isGuideSlug(slug)) notFound();
  const g = getGuideBySlug(slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}`;

  return (
    <>
      <ArticleJsonLd
        title={g.title}
        description={g.description}
        slug={g.slug}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: g.title },
        ]}
        currentPath={path}
      />
      <article className={`${publicContentFrameClass} py-10 sm:py-14 lg:py-16`}>
        <header className="max-w-3xl border-b border-border pb-8">
          <time
            dateTime="2026-04-04"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Updated 4 April 2026
          </time>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl">
            {g.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{g.description}</p>
        </header>
        <div className="mt-10 max-w-3xl">
          <GuideBody slug={g.slug} />
        </div>
      </article>
    </>
  );
}
