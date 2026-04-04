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
      className="relative min-h-[min(88vh,680px)] w-full overflow-hidden rounded-2xl bg-neutral-900 lg:min-h-[560px] xl:min-h-[600px]"
      aria-labelledby="about-dreams-heading"
    >
      <Image
        src={image}
        alt="Team reviewing property plans and architectural models in a bright office"
        fill
        className="object-cover object-[50%_45%]"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-black/25" aria-hidden />

      <div
        className={cn(
          "relative z-10 flex min-h-[min(88vh,680px)] w-full flex-col justify-end px-6 py-10 sm:px-8 sm:py-12 lg:min-h-[560px] lg:flex-row lg:items-center lg:justify-end lg:px-12 lg:py-14 xl:min-h-[600px]",
        )}
      >
        <div className="w-full max-w-[28rem] rounded-[2rem] bg-[#FCFAF2] p-8 shadow-sm sm:p-10 sm:rounded-[2.25rem] lg:max-w-[26rem] lg:rounded-[2.5rem] lg:p-12 xl:max-w-[28rem]">
          <h2
            id="about-dreams-heading"
            className="text-2xl font-bold leading-[1.15] tracking-tight text-black sm:text-[1.75rem]"
          >
            {headline}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
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
                  i > 0 &&
                    "mt-6 border-t border-neutral-200/90 pt-6 sm:mt-8 sm:pt-8",
                )}
              >
                <div className="flex gap-4 sm:gap-5">
                  <span
                    className="w-9 shrink-0 text-left text-2xl font-light tabular-nums leading-none text-neutral-400 sm:w-11 sm:text-3xl"
                    aria-hidden
                  >
                    {step.n}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-base font-bold text-black sm:text-[17px]">
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
    </section>
  );
}
