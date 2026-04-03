"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question:
      "How does The Real Business help with buying property in Palakkad?",
    answerMobile:
      "We shortlist listings, arrange visits, and guide you through to handover.",
    answer:
      "We start by understanding your budget, preferred locality, and timeline — then shortlist plots, land, and homes that genuinely fit. We arrange site visits with owners, help you compare options on the ground, and stay beside you through offers, negotiation, and handover. You get clear updates at every step so nothing feels rushed or unclear.",
  },
  {
    question: "What areas in Palakkad do you cover?",
    answerMobile:
      "Across Palakkad district — town, Ottapalam, Chittur, Mannarkkad, and nearby.",
    answer:
      "We work across Palakkad district, from the town centre to surrounding taluks such as Ottapalam, Chittur, and Mannarkkad, and nearby villages where serious listings come up. Tell us where you want to focus — urban, semi-urban, or agricultural land — and we will align our search and site visits to those areas.",
  },
  {
    question: "How long does it take to find the right property?",
    answerMobile:
      "Often a few weeks; it depends on your brief and what is on the market.",
    answer:
      "Timelines vary with how specific your brief is and what is available at the time. Many clients narrow down to serious options within a few weeks; some move faster when a strong match appears. We do not push you to decide — we keep you informed as new listings fit your criteria and adjust if your priorities change.",
  },
  {
    question: "Do you help with documentation and registration?",
    answerMobile:
      "We coordinate with your advocate; legal advice stays with your lawyer.",
    answer:
      "We coordinate timelines and paperwork with your advocate — title checks, encumbrance certificates, sale deed drafts, and registration appointments. We are your broker for the transaction, not a substitute for legal counsel: your lawyer gives formal advice, and we help the process stay organised and on track so the deal you agreed is what reaches registration.",
  },
  {
    question: "Is there a fee for your brokerage services?",
    answerMobile:
      "Fees depend on the service; we explain everything before you commit.",
    answer:
      "Our fees depend on whether you are buying, selling, or renting, and the scope of work involved. We explain structure and timing upfront — before you commit — so there are no hidden charges. For a clear breakdown for your situation, contact us and we will walk through it in plain language.",
  },
  {
    question: "Can I schedule a property visit before deciding?",
    answerMobile:
      "Yes — call, email, contact form, or enquire from a listing page.",
    answer:
      "Absolutely. Reach us by phone, email, the contact form on our site, or the enquiry flow on any property listing. We schedule viewings with owners at practical times, and you can request second visits or extra questions until you are comfortable. There is no obligation to proceed after a visit.",
  },
];

function FAQItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      layout
      className={cn(
        "overflow-hidden rounded-2xl border bg-white shadow-[0_1px_12px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200",
        open
          ? "border-brand-gold/35 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-brand-gold/10"
          : "border-neutral-100 hover:border-neutral-200 hover:shadow-[0_2px_16px_rgba(0,0,0,0.05)]",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5"
        aria-expanded={open}
      >
        <span
          className="mt-0.5 shrink-0 font-heading text-xs font-bold tabular-nums text-brand-gold/80 sm:text-sm"
          aria-hidden
        >
          {num}
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-brand-charcoal sm:text-base">
          {faq.question}
        </span>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
            open
              ? "border-brand-gold/40 bg-brand-gold-muted"
              : "border-neutral-200 bg-neutral-50",
          )}
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
          >
            <ChevronDown className="h-4 w-4 text-brand-gold" aria-hidden />
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-neutral-100 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
              <p className="pl-0 text-[13px] leading-snug text-muted-foreground sm:hidden">
                {faq.answerMobile}
              </p>
              <p className="hidden pl-0 text-sm leading-relaxed text-muted-foreground sm:block sm:pl-9 sm:text-[15px] sm:leading-[1.65]">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function HomeFAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      className="py-10 sm:py-14 lg:py-16"
      aria-labelledby="home-faq-heading"
    >
      <div ref={ref} className={publicContentFrameClass}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 w-full text-left sm:mb-12"
        >
          <h2
            id="home-faq-heading"
            className="font-heading text-2xl font-bold leading-tight text-brand-charcoal sm:text-3xl lg:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Straight answers about buying, selling, and renting in Palakkad —
            from first enquiry to keys in hand.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.06,
          }}
          className="w-full space-y-3"
        >
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} faq={faq} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** @deprecated Prefer `HomeFAQ` for the home page; kept for any legacy imports. */
export const FAQ = HomeFAQ;
