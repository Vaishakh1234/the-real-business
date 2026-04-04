import {
  Award,
  Briefcase,
  CheckCircle2,
  Handshake,
  MapPin,
  Megaphone,
  MessageCircle,
  Phone,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ABOUT_PAGE_BACKGROUND,
  ABOUT_WHY_CHOOSE_US,
  CONTACT,
  SERVICES,
  SERVICES_HERO_TAGLINE,
  SERVICES_PROCESS,
  SITE_NAME,
  type AboutWhyChooseUsIconKey,
  type ServiceIconKey,
} from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export const metadata: Metadata = {
  title:
    "Our Services — Real Estate Marketing, Property Consultancy & Buying/Selling Support",
  description: `${SERVICES_HERO_TAGLINE} Property buying and selling support across Palakkad district, Kerala.`,
  keywords: [
    "real estate marketing Palakkad",
    "property consultancy Kerala",
    "property buying selling support Palakkad",
    "property consultant Palakkad",
    "sell property Palakkad",
    "buy property Palakkad",
    SITE_NAME,
  ],
};

const SERVICE_ICONS: Record<ServiceIconKey, LucideIcon> = {
  Megaphone,
  Briefcase,
  Handshake,
};

const WHY_US_ICONS: Record<AboutWhyChooseUsIconKey, LucideIcon> = {
  Shield,
  MapPin,
  Users,
  Award,
};

export default function ServicesPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: ABOUT_PAGE_BACKGROUND }}
    >
      <div className={publicContentFrameClass}>
        {/* ── Services hero (matches About editorial spacing) ── */}
        <section className="pb-10 pt-6 sm:pb-12 sm:pt-8 md:pt-10 lg:pb-14 lg:pt-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            What we offer
          </span>
          <h1 className="font-heading mt-3 max-w-4xl text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl lg:text-4xl">
            Marketing, consultancy &amp; deals in{" "}
            <span className="font-normal text-muted-foreground">Palakkad</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:mt-6">
            Three focused pillars — real estate marketing, property consultancy,
            and buying &amp; selling support — so every engagement matches what
            you actually need.
          </p>

          <h2 className="sr-only">Our service pillars</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-3 lg:gap-10">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.iconKey];
              return (
                <div
                  key={service.title}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-gold/30 bg-white/60 shadow-sm transition-all duration-300 hover:border-brand-gold/50 hover:shadow-md"
                >
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold transition-colors group-hover:bg-brand-gold/25 sm:h-16 sm:w-16">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-brand-charcoal sm:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.details.map((d, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Process ── */}
        <section className="py-10 sm:py-14 lg:py-16">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            Our process
          </span>
          <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl lg:text-4xl">
            How we work with you
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-[15px]">
            A clear path from first conversation to closing — and after.
          </p>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
            {SERVICES_PROCESS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-brand-gold/30 bg-white/60 p-6 shadow-sm sm:p-8"
              >
                <span className="text-3xl font-black text-brand-gold/30">
                  {item.step}
                </span>
                <h3 className="mt-2 text-lg font-bold text-brand-charcoal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why us (card rhythm aligned with About “Why choose us”) ── */}
        <section className="py-14 sm:py-20 lg:py-24">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
              Why {SITE_NAME}
            </span>
            <h2 className="font-heading mt-3 text-2xl font-bold text-brand-charcoal sm:text-3xl lg:text-4xl">
              The Palakkad difference
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-[15px]">
              Marketing reach, consultancy depth, and transaction follow-through
              — grounded in Palakkad, not a distant call centre. Here is what
              guides every recommendation we make.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {ABOUT_WHY_CHOOSE_US.map((item, index) => {
              const Icon = WHY_US_ICONS[item.iconKey];
              const tinted = index % 2 === 1;
              return (
                <div
                  key={item.title}
                  className={`rounded-xl border border-border p-5 shadow-sm transition-colors hover:border-brand-gold/30 sm:rounded-2xl sm:p-7 ${
                    tinted ? "bg-brand-gold/10" : "bg-white"
                  }`}
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full sm:mb-4 sm:h-11 sm:w-11 ${
                      tinted
                        ? "bg-brand-charcoal text-white"
                        : "bg-muted text-brand-gold"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </div>
                  <h3 className="font-heading text-base font-bold text-brand-charcoal sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-neutral-200/90 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-gold/30 bg-white/60 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
            <h2 className="text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
              Ready to market, consult, or move on a deal?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you are promoting a listing, seeking property consultancy,
              or buying or selling in Palakkad — tell us your goal and we will
              reply with a clear next step.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {CONTACT.whatsappUrl ? (
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand-gold px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-gold/90 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 sm:w-auto"
                >
                  <MessageCircle className="h-5 w-5" />
                  {CONTACT.whatsappLabel}
                </a>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-brand-gold px-8 py-3 font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 sm:w-auto"
              >
                <Phone className="h-5 w-5" />
                {CONTACT.contactUsLabel}
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {CONTACT.workingHours.weekdays} · {CONTACT.workingHours.saturday}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
