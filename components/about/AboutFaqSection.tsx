import { ChevronDown } from "lucide-react";
import { ABOUT_FAQ } from "@/lib/constants/site";

const mid = Math.ceil(ABOUT_FAQ.length / 2);
const LEFT_COL = ABOUT_FAQ.slice(0, mid);
const RIGHT_COL = ABOUT_FAQ.slice(mid);

export function AboutFaqSection() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-faq-heading"
    >
      <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-14 lg:mb-16">
        <h2
          id="about-faq-heading"
          className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Find answers to common questions about our services, process, and how
          we can help with your property needs in Palakkad.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
        <div className="flex flex-col gap-4 sm:gap-5">
          {LEFT_COL.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-neutral-200/90 bg-white px-5 py-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[box-shadow] open:shadow-md sm:rounded-2xl sm:px-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 pr-0.5 text-left text-[15px] font-semibold leading-snug text-brand-charcoal [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">{item.question}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2}
                  aria-hidden
                />
              </summary>
              <div className="pb-4 pt-0 text-sm leading-relaxed text-neutral-600">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:gap-5">
          {RIGHT_COL.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-neutral-200/90 bg-white px-5 py-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[box-shadow] open:shadow-md sm:rounded-2xl sm:px-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 pr-0.5 text-left text-[15px] font-semibold leading-snug text-brand-charcoal [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">{item.question}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2}
                  aria-hidden
                />
              </summary>
              <div className="pb-4 pt-0 text-sm leading-relaxed text-neutral-600">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
