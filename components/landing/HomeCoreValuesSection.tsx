"use client";

import { Heart, Lightbulb, Shield, Star, type LucideIcon } from "lucide-react";
import { ABOUT } from "@/lib/constants/site";

const VALUE_META: {
  icon: LucideIcon;
  accent: string;
  accentRing: string;
  num: string;
}[] = [
  {
    icon: Shield,
    accent: "from-amber-100 to-amber-50",
    accentRing: "ring-amber-200/60",
    num: "01",
  },
  {
    icon: Star,
    accent: "from-sky-100 to-sky-50",
    accentRing: "ring-sky-200/60",
    num: "02",
  },
  {
    icon: Lightbulb,
    accent: "from-emerald-100 to-emerald-50",
    accentRing: "ring-emerald-200/60",
    num: "03",
  },
  {
    icon: Heart,
    accent: "from-rose-100 to-rose-50",
    accentRing: "ring-rose-200/60",
    num: "04",
  },
];

export function HomeCoreValuesSection() {
  const { eyebrow, title, subtitle } = ABOUT.coreValuesIntro;

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-stone-50/80 via-white to-white py-20 sm:py-24 lg:py-28"
      aria-labelledby="home-core-values-heading"
    >
      {/* Decorative bg dots */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(38 39% 52%) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* ── Header ── */}
        <header className="mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/20 bg-brand-gold-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold">
            <span
              className="h-1.5 w-1.5 rounded-full bg-brand-gold"
              aria-hidden="true"
            />
            {eyebrow}
          </span>

          <h2
            id="home-core-values-heading"
            className="mt-5 font-heading text-3xl font-bold leading-tight tracking-tight text-brand-charcoal sm:text-4xl lg:text-[2.75rem]"
          >
            {title}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>

          <div
            className="mx-auto mt-6 flex items-center justify-center gap-1.5"
            aria-hidden="true"
          >
            <span className="h-px w-8 bg-brand-gold/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold/50" />
            <span className="h-px w-8 bg-brand-gold/30" />
          </div>
        </header>

        {/* ── Value cards ── */}
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {ABOUT.values.map((value, i) => {
            const meta = VALUE_META[i] ?? VALUE_META[0];
            const Icon = meta.icon;

            return (
              <li
                key={value.title}
                className="group relative flex flex-col rounded-2xl border border-transparent bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/15 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:p-7"
              >
                {/* Background number watermark */}
                <span
                  className="pointer-events-none absolute right-4 top-3 select-none font-heading text-6xl font-bold leading-none text-stone-100 transition-colors duration-300 group-hover:text-brand-gold/10 sm:text-7xl"
                  aria-hidden="true"
                >
                  {meta.num}
                </span>

                {/* Icon */}
                <div
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${meta.accent} ring-1 ${meta.accentRing} transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon
                    className="h-6 w-6 text-brand-charcoal/80"
                    strokeWidth={1.6}
                  />
                </div>

                {/* Gold accent bar */}
                <div
                  className="mt-5 h-0.5 w-8 rounded-full bg-brand-gold/40 transition-all duration-300 group-hover:w-12 group-hover:bg-brand-gold"
                  aria-hidden="true"
                />

                {/* Title */}
                <h3 className="mt-4 font-heading text-lg font-bold tracking-tight text-brand-charcoal sm:text-xl">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                  {value.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
