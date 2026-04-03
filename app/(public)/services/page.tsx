import {
  Award,
  CheckCircle2,
  Handshake,
  Home,
  Key,
  LandPlot,
  LineChart,
  MapPin,
  MessageCircle,
  Phone,
  Scale,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import {
  ABOUT,
  ABOUT_WHY_CHOOSE_US,
  CONTACT,
  PAGE_HERO_IMAGES,
  SERVICES,
  SERVICES_HERO_TAGLINE,
  SERVICES_PROCESS,
  SITE_NAME,
  type AboutWhyChooseUsIconKey,
  type ServiceIconKey,
} from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export const metadata: Metadata = {
  title: `Our Services — ${SITE_NAME}`,
  description: `${SITE_NAME} — Palakkad real estate: plots & land, residential sales, rentals, valuation guidance, documentation support, and post-sale care.`,
};

const SERVICE_ICONS: Record<ServiceIconKey, LucideIcon> = {
  LandPlot,
  Home,
  Key,
  LineChart,
  Scale,
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
    <>
      <PageHero
        title="Our Services"
        imageSrc={PAGE_HERO_IMAGES.services}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        description={SERVICES_HERO_TAGLINE}
      />

      <section className="bg-muted/50 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className={publicContentFrameClass}>
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              What we offer
            </span>
            <h2 className="mt-2 text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
              End-to-end support in Palakkad
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From plots and land to homes and rentals — practical help at every
              stage.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = SERVICE_ICONS[service.iconKey];
              return (
                <div
                  key={service.title}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:border-brand-gold/30 hover:shadow-xl"
                >
                  <div className="p-6 sm:p-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/15 text-brand-gold transition-colors group-hover:bg-brand-gold/25">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-brand-charcoal">
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
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className={publicContentFrameClass}>
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Our process
            </span>
            <h2 className="mt-2 text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
              How we work with you
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A clear path from first conversation to closing — and after.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {SERVICES_PROCESS.map((item) => (
              <div key={item.step} className="relative">
                <div className="relative rounded-2xl border border-border/50 bg-muted/50 p-6 sm:p-8">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20 lg:py-24">
        <div className={publicContentFrameClass}>
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
              Why {SITE_NAME}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
              The Palakkad difference
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Real relationships, real local knowledge — not a call centre.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4">
            {ABOUT_WHY_CHOOSE_US.map((item) => {
              const Icon = WHY_US_ICONS[item.iconKey];
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-brand-gold/30 sm:p-8"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-brand-charcoal py-12 text-white sm:py-16">
        <div className={publicContentFrameClass}>
          <div className="grid grid-cols-2 gap-8 sm:gap-12 xl:grid-cols-4">
            {ABOUT.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-brand-gold sm:text-4xl md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/80 sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white py-16 sm:py-20 lg:py-24">
        <div className={publicContentFrameClass}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-brand-charcoal sm:text-3xl md:text-4xl">
              Let&apos;s discuss your property goals
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tell us what you need — a plot, a home, a tenant, or a valuation —
              and we will respond with a clear next step.
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
        </div>
      </section>
    </>
  );
}
