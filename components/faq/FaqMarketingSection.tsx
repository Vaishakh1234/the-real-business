import { ChevronDown } from "lucide-react";
import { FAQ_PAGE_ITEMS } from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

const LEFT_COL = FAQ_PAGE_ITEMS.slice(0, 3);
const RIGHT_COL = FAQ_PAGE_ITEMS.slice(3);

export function FaqMarketingSection() {
  return (
    <section className="bg-[#FEFBF3] pb-12 pt-28 sm:pb-16 sm:pt-32 md:pt-36 lg:pb-20 lg:pt-40">
      <div className={publicContentFrameClass}>
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <span className="inline-block rounded-full border border-neutral-200/90 bg-neutral-100/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
            FAQ
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-brand-charcoal sm:text-4xl md:text-[2.75rem] md:leading-tight">
            Frequently Asked Questions
          </h1>
        </header>

        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col gap-4">
            {LEFT_COL.map((item, i) => (
              <details
                key={item.question}
                open={i === 1}
                className="group rounded-2xl border border-neutral-200/90 bg-[#f3f1eb] px-5 py-0.5 shadow-sm transition-colors open:bg-[#ebe8e0] sm:px-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 pr-1 text-left text-[15px] font-semibold leading-snug text-brand-charcoal [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="border-t border-neutral-200/70 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {RIGHT_COL.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-neutral-200/90 bg-[#f3f1eb] px-5 py-0.5 shadow-sm transition-colors open:bg-[#ebe8e0] sm:px-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 pr-1 text-left text-[15px] font-semibold leading-snug text-brand-charcoal [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="border-t border-neutral-200/70 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
