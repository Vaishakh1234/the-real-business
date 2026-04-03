"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import {
  Home,
  HousePlus,
  MessageCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CONTACT, POST_PROPERTY_HREF } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

/** Home portal cards — match `HomeCoreValuesSection` surface + hover. */
const audienceCardShell = cn(
  "rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
  "transition-[border-color,box-shadow] duration-300 ease-out",
  "hover:border-brand-gold/25 hover:shadow-md",
);

const audienceIcon = cva(
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-[1.75]",
  {
    variants: {
      tone: {
        buyer: "bg-brand-gold-muted text-brand-gold",
        seller: "bg-muted text-brand-charcoal",
      },
    },
    defaultVariants: { tone: "buyer" },
  },
);

/** Pill CTAs — align focus ring with `components/ui/button` (ring / offset-background). */
const audienceCta = cva(
  cn(
    "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ),
  {
    variants: {
      intent: {
        charcoal: "bg-brand-charcoal text-white hover:bg-brand-charcoal/90",
        whatsapp:
          "border border-brand-gold bg-brand-gold-muted text-brand-gold hover:bg-brand-gold-muted-hover",
        gold: "bg-brand-gold text-white hover:bg-brand-gold-hover",
      },
    },
    defaultVariants: { intent: "charcoal" },
  },
);

function AudienceCard({
  icon: Icon,
  iconTone,
  eyebrow,
  title,
  description,
  actionsGroupLabel,
  children,
}: {
  icon: LucideIcon;
  iconTone: "buyer" | "seller";
  eyebrow: string;
  title: string;
  description: string;
  actionsGroupLabel: string;
  children: ReactNode;
}) {
  return (
    <article className={cn(audienceCardShell, "p-5 sm:p-6")}>
      <div className="flex gap-3 sm:gap-4">
        <span className={audienceIcon({ tone: iconTone })} aria-hidden>
          <Icon />
        </span>
        <div className="min-w-0 flex-1">
          <header>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              {eyebrow}
            </p>
            <h2 className="mt-1 font-heading text-lg font-bold tracking-tight text-brand-charcoal sm:text-xl">
              {title}
            </h2>
          </header>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div
        className="mt-6 border-t border-border/80 pt-5"
        role="group"
        aria-label={actionsGroupLabel}
      >
        {children}
      </div>
    </article>
  );
}

export function HomeSidebar() {
  return (
    <aside
      className={cn(
        "flex flex-col gap-5 xl:gap-6",
        "xl:sticky xl:top-24 xl:z-10 xl:self-start",
      )}
      aria-label="Quick links for buyers and sellers"
    >
      <AudienceCard
        icon={UserRound}
        iconTone="buyer"
        eyebrow="For buyers"
        title="Looking in Palakkad?"
        description="Tell us what you need — we'll shortlist listings and help you plan site visits."
        actionsGroupLabel="Ways to reach us about buying"
      >
        <div className="flex flex-col gap-3">
          <Link href="/contact" className={audienceCta({ intent: "charcoal" })}>
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            {CONTACT.contactUsLabel}
          </Link>
          {CONTACT.whatsappUrl && (
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={audienceCta({ intent: "whatsapp" })}
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              {CONTACT.whatsappLabel}
            </a>
          )}
        </div>
      </AudienceCard>

      <AudienceCard
        icon={Home}
        iconTone="seller"
        eyebrow="For sellers"
        title="List your property"
        description="We meet owners in person to collect documents and agree marketing terms before your listing goes live."
        actionsGroupLabel="List your property"
      >
        <Link
          href={POST_PROPERTY_HREF}
          className={audienceCta({ intent: "gold" })}
        >
          <HousePlus className="h-5 w-5 shrink-0" aria-hidden />
          Start a listing conversation
        </Link>
      </AudienceCard>
    </aside>
  );
}
