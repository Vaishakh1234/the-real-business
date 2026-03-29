import Image from "next/image";
import { Heart, Lightbulb, Shield, Star, type LucideIcon } from "lucide-react";
import { ABOUT } from "@/lib/constants/site";

const VALUE_ICONS: Record<string, LucideIcon> = {
  Integrity: Shield,
  Excellence: Star,
  Innovation: Lightbulb,
  "Client First": Heart,
};

export function HomeCoreValuesSection() {
  const { eyebrow, title, subtitle } = ABOUT.coreValuesIntro;

  return (
    <section
      className="relative w-full overflow-x-hidden bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="home-core-values-heading"
    >
      <div className="w-full">
        <header className="mb-12 w-full text-left sm:mb-14">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              {eyebrow}
            </p>
            <span
              className="hidden h-px w-12 shrink-0 bg-brand-gold/40 sm:block"
              aria-hidden
            />
          </div>
          <h2
            id="home-core-values-heading"
            className="font-heading text-3xl font-bold tracking-tight text-balance text-brand-charcoal sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 w-full max-w-none text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {ABOUT.values.map((value) => {
            const Icon = VALUE_ICONS[value.title] ?? Star;
            return (
              <li
                key={value.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:border-brand-gold/25 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-[16/11]">
                  <Image
                    src={value.image}
                    alt={value.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-white/95 text-brand-gold shadow-sm backdrop-blur-sm"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-heading text-lg font-bold text-brand-charcoal">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
