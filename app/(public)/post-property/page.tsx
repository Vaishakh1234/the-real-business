import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { CONTACT, SITE_NAME } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const ILLUSTRATION_SRC = "/images/home-modal/home-modal-5.png";

export const metadata: Metadata = {
  title: `Post property — ${SITE_NAME}`,
  description:
    "List your property for sale or rent in Palakkad. Reach us on WhatsApp — we’ll guide you through the next steps.",
};

export default function PostPropertyPage() {
  return (
    <section
      className={cn(
        publicContentFrameClass,
        "flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center py-14 sm:min-h-[calc(100svh-7rem)] sm:py-20 lg:py-24",
      )}
    >
      <div className="flex w-full max-w-screen-2xl flex-col items-stretch gap-12 xl:flex-row xl:items-center xl:gap-20 2xl:gap-28">
        <div className="relative aspect-[4/3] w-full min-w-0 overflow-hidden xl:min-h-0 xl:flex-[1.42]">
          <Image
            src={ILLUSTRATION_SRC}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(min-width: 1536px) 900px, (min-width: 1280px) 58vw, 100vw"
            priority
          />
        </div>
        <div className="flex min-w-0 w-full flex-col items-center gap-6 text-center sm:gap-8 xl:flex-1 xl:items-start xl:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold sm:text-base">
            Get listed
          </p>
          <h1 className="font-heading text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl xl:text-5xl 2xl:text-6xl">
            We&apos;ll help you list the right way
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Share your property basics over WhatsApp — location, type, and what
            you&apos;re hoping to achieve. Our team will respond with next steps
            and any documents we need.
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 xl:mt-0 xl:items-start">
            {CONTACT.whatsappUrl && (
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-brand-charcoal px-8 text-base font-semibold tracking-tight text-white shadow-[0_2px_12px_rgba(0,0,0,0.1)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-brand-charcoal/92 hover:shadow-[0_4px_20px_rgba(0,0,0,0.14)] focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-[0.98] sm:h-16 sm:px-10 sm:text-lg [&_svg]:size-5 sm:[&_svg]:size-6"
              >
                <Link
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="shrink-0" />
                  Contact through WhatsApp
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-2 border-brand-charcoal px-8 text-base font-semibold tracking-tight text-brand-charcoal shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-brand-charcoal hover:text-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.14)] focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-[0.98] sm:h-16 sm:px-10 sm:text-lg"
            >
              <Link href="/contact">{CONTACT.contactUsLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
