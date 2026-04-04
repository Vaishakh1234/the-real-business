import { ChevronDown } from "lucide-react";
import { ABOUT_FAQ } from "@/lib/constants/site";

const mid = Math.ceil(ABOUT_FAQ.length / 2);
const LEFT_COL = ABOUT_FAQ.slice(0, mid);
const RIGHT_COL = ABOUT_FAQ.slice(mid);

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-neutral-200/90 bg-white px-4 py-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[box-shadow] open:shadow-md sm:rounded-2xl sm:px-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-left text-sm font-semibold leading-snug text-brand-charcoal sm:gap-4 sm:py-4 sm:text-[15px] [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1">{question}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180 sm:h-5 sm:w-5"
          strokeWidth={2}
          aria-hidden
        />
      </summary>
      <div className="pb-3.5 pt-0 text-sm leading-relaxed text-neutral-600 sm:pb-4">
        {answer}
      </div>
    </details>
  );
}

export function AboutFaqSection() {
  return (
    <section
      className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16"
      aria-labelledby="about-faq-heading"
    >
      <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 lg:mb-14">
        <h2
          id="about-faq-heading"
          className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-[15px]">
          Find answers to common questions about our services, process, and how
          we can help with your property needs in Palakkad.
        </p>
      </header>

      {/* Mobile: single column. Desktop: two columns */}
      <div className="mx-auto max-w-4xl lg:hidden">
        <div className="flex flex-col gap-3 sm:gap-4">
          {ABOUT_FAQ.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
      <div className="mx-auto hidden max-w-6xl gap-5 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
        <div className="flex flex-col gap-5">
          {LEFT_COL.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
        <div className="flex flex-col gap-5">
          {RIGHT_COL.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
