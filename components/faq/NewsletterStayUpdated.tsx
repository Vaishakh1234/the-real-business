"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { FAQ_NEWSLETTER, PAGE_HERO_IMAGES } from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export function NewsletterStayUpdated() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email.");
      return;
    }
    const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmail.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter signup",
          email: trimmed,
          message: "Newsletter subscription from /faq page",
          source: "website",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      toast.success("You are subscribed — we will keep you posted.");
      setEmail("");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="pb-16 pt-4 sm:pb-24 lg:pb-28">
      <div className={publicContentFrameClass}>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] sm:rounded-[2.25rem]">
          <div className="relative aspect-[16/9] min-h-[280px] w-full sm:aspect-[21/9] sm:min-h-[320px]">
            <Image
              src={PAGE_HERO_IMAGES.about}
              alt="Modern home at dusk — newsletter background"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1024px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/55 to-[#0f172a]/35"
              aria-hidden
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10">
            <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
              {FAQ_NEWSLETTER.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              {FAQ_NEWSLETTER.subtitle}
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:rounded-full sm:bg-white sm:p-1.5 sm:pl-5 sm:shadow-lg"
              noValidate
            >
              <label htmlFor="faq-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="faq-newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                disabled={pending}
                className="min-h-[48px] w-full rounded-full border border-white/25 bg-white/95 px-5 py-3 text-sm text-brand-charcoal shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/80 sm:border-0 sm:bg-transparent sm:shadow-none sm:focus-visible:ring-0"
              />
              <button
                type="submit"
                disabled={pending}
                className="min-h-[48px] shrink-0 rounded-full bg-brand-charcoal px-8 text-sm font-semibold text-white transition-colors hover:bg-brand-charcoal/90 disabled:opacity-60 sm:px-7"
              >
                {pending ? "…" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
