import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ABOUT_DREAMS_BANNER } from "@/lib/constants/site";
import { cn } from "@/lib/utils";

export function AboutDreamsImageSection() {
  const { image, headline, subtitle, ctaLabel, ctaHref, steps } =
    ABOUT_DREAMS_BANNER;

  return (
    <section
      className="overflow-hidden rounded-2xl bg-neutral-900"
      aria-labelledby="about-dreams-heading"
    >
      {/* Mobile/tablet: stacked layout — image on top, card below */}
      <div className="lg:hidden">
        <div className="relative aspect-[16/9] w-full sm:aspect-[2/1]">
          <Image
            src={image}
            alt="Team reviewing property plans and architectural models in a bright office"
            fill
            className="object-cover object-[50%_45%]"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        </div>
        <div className="bg-[#FCFAF2] px-5 py-8 xs:px-6 sm:px-8 sm:py-10">
          <h2
            id="about-dreams-heading"
            className="text-xl font-bold leading-tight tracking-tight text-black sm:text-2xl"
          >
            {headline}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
            {subtitle}
          </p>
          <Link
            href={ctaHref}
            className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-black bg-transparent px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
          >
            {ctaLabel}
            <ArrowRight
              className="h-4 w-4 shrink-0"
              strokeWidth={2}
              aria-hidden
            />
          </Link>
          <ul className="mt-8 space-y-0">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className={cn(
                  i > 0 && "mt-5 border-t border-neutral-200/90 pt-5",
                )}
              >
                <div className="flex gap-4">
                  <span
                    className="w-8 shrink-0 text-left text-xl font-light tabular-nums leading-none text-neutral-400 sm:w-10 sm:text-2xl"
                    aria-hidden
                  >
                    {step.n}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-[15px] font-bold text-black sm:text-base">
                      {step.title}
                    </h3>
                    {step.body ? (
                      <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                        {step.body}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop: side-by-side — image fills left, card on right */}
      <div className="relative hidden min-h-[560px] lg:flex xl:min-h-[600px]">
        <Image
          src={image}
          alt="Team reviewing property plans and architectural models in a bright office"
          fill
          className="object-cover object-[50%_45%]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div className="relative z-10 ml-auto flex w-full max-w-[32rem] items-center px-8 py-14 xl:max-w-[36rem] xl:px-12 2xl:max-w-[40rem]">
          <div className="w-full rounded-[2.5rem] bg-[#FCFAF2] p-10 shadow-sm xl:p-12 2xl:p-14">
            <h2
              className="text-[1.75rem] font-bold leading-[1.15] tracking-tight text-black"
              aria-hidden
            >
              {headline}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">
              {subtitle}
            </p>
            <Link
              href={ctaHref}
              className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-black bg-transparent px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFAF2]"
            >
              {ctaLabel}
              <ArrowRight
                className="h-4 w-4 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
            </Link>
            <ul className="mt-10 space-y-0">
              {steps.map((step, i) => (
                <li
                  key={step.n}
                  className={cn(
                    i > 0 && "mt-7 border-t border-neutral-200/90 pt-7",
                  )}
                >
                  <div className="flex gap-5">
                    <span
                      className="w-11 shrink-0 text-left text-3xl font-light tabular-nums leading-none text-neutral-400"
                      aria-hidden
                    >
                      {step.n}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-[17px] font-bold text-black">
                        {step.title}
                      </h3>
                      {step.body ? (
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                          {step.body}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
