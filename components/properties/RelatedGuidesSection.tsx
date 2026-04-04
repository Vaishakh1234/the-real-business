import Link from "next/link";
import { GUIDES } from "@/lib/constants/guides";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export function RelatedGuidesSection() {
  return (
    <section
      className={`${publicContentFrameClass} mt-12 border-t border-neutral-200 pt-10 sm:mt-14 sm:pt-12`}
      aria-labelledby="related-guides-heading"
    >
      <h2
        id="related-guides-heading"
        className="font-heading text-lg font-bold text-[#1a2b4b] sm:text-xl"
      >
        Related guides
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Practical reading for buyers and sellers in Kerala — documentation,
        registration, and NRI context.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="block rounded-xl border border-neutral-200 bg-white p-4 text-sm font-semibold text-[#1a2b4b] shadow-sm transition-colors hover:border-brand-gold/40 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
