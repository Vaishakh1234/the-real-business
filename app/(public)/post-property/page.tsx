import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ListPropertyLeadForm } from "@/components/properties/ListPropertyLeadForm";
import { Button } from "@/components/ui/button";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { LISTING_CARD } from "@/lib/constants/listing-card";
import { CONTACT, SITE_NAME, getContactWhatsAppUrl } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { defaultPageOgTwitter } from "@/lib/seo/social-metadata";

const ILLUSTRATION_SRC = "/images/home-modal/home-modal-5.png";

const postTitle = `Post property — ${SITE_NAME}`;
const postDescription =
  "List your property for sale or rent in Palakkad — submit details online, or reach us on WhatsApp. We’ll guide you through the next steps.";

export const metadata: Metadata = {
  title: postTitle,
  alternates: { canonical: "/post-property" },
  description: postDescription,
  ...defaultPageOgTwitter("/post-property", postTitle, postDescription),
};

/** Matches `DirectoryPropertyListingCard` CTAs: outline “View details” + filled “Contact” (WhatsApp). */
const listingStyleCtaRowClass =
  "inline-flex min-h-11 w-full flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 sm:w-auto";

export default function PostPropertyPage() {
  const whatsappHref = getContactWhatsAppUrl();

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Post property" }]}
        currentPath="/post-property"
      />
      <section
        className={cn(publicContentFrameClass, "py-14 sm:py-20 lg:py-24")}
      >
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-stretch gap-12 xl:flex-row xl:items-start xl:gap-16 2xl:gap-24">
          <div className="relative aspect-[4/3] w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-[0_8px_40px_-12px_rgba(26,26,26,0.12)] ring-1 ring-black/[0.04] xl:flex-[1.42]">
            <Image
              src={ILLUSTRATION_SRC}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(min-width: 1536px) 900px, (min-width: 1280px) 58vw, 100vw"
              priority
            />
          </div>
          <div className="flex min-w-0 w-full flex-col items-center gap-6 text-center sm:gap-8 xl:min-w-0 xl:flex-1 xl:items-stretch xl:text-left">
            <div className="flex w-full max-w-xl flex-col items-center gap-6 xl:max-w-none xl:items-start">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold sm:text-base">
                Get listed
              </p>
              <h1 className="font-heading text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl xl:text-5xl 2xl:text-6xl">
                We&apos;ll help you list the right way
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Share your property basics — location, type, and what you&apos;re
                hoping to achieve. See how we present listings, reach us on
                WhatsApp, or send the form and our team will follow up.
              </p>
              <div className="mt-1 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch xl:max-w-none">
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    listingStyleCtaRowClass,
                    "border-2 border-neutral-300 bg-white text-brand-charcoal hover:border-neutral-400 hover:bg-neutral-50",
                  )}
                >
                  <Link href="/properties">View details</Link>
                </Button>
                {whatsappHref ? (
                  <Button
                    asChild
                    className={cn(
                      listingStyleCtaRowClass,
                      "min-w-[148px] border-0 text-white hover:opacity-95",
                    )}
                    style={{ backgroundColor: LISTING_CARD.ctaRed }}
                  >
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon className="h-4 w-4 shrink-0" aria-hidden />
                      Contact
                    </a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className={cn(
                      listingStyleCtaRowClass,
                      "min-w-[148px] border-0 text-white hover:opacity-95",
                    )}
                    style={{ backgroundColor: LISTING_CARD.ctaRed }}
                  >
                    <Link href="/contact">Contact</Link>
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                <Link
                  href="/contact"
                  className="font-medium text-brand-charcoal underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-brand-gold"
                >
                  {CONTACT.contactUsLabel}
                </Link>
                <span className="text-neutral-400"> · </span>
                <span>Or use the form below.</span>
              </p>
            </div>

            <ListPropertyLeadForm className="mt-6 w-full max-w-2xl xl:mt-8 xl:max-w-none" />
          </div>
        </div>
      </section>
    </>
  );
}
