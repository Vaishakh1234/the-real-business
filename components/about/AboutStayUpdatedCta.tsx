"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  ABOUT_NEWSLETTER_BG_IMAGE,
  FAQ_NEWSLETTER,
} from "@/lib/constants/site";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";

export function AboutStayUpdatedCta() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
          message: "Newsletter subscription from /about page",
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
    <section className="border-t border-neutral-200/50 pb-16 sm:pb-24 lg:pb-28">
      <div className={publicContentFrameClass}>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[1.75rem] bg-[#2C4E68] shadow-[0_24px_60px_-28px_rgba(20,40,55,0.45)] sm:rounded-[2rem]">
          <div
            className="pointer-events-none absolute bottom-0 right-0 top-[22%] w-full max-w-[min(100%,520px)] sm:top-[14%]"
            aria-hidden
          >
            <Image
              src={ABOUT_NEWSLETTER_BG_IMAGE}
              alt=""
              fill
              className="object-cover object-[82%_100%] sm:object-[center_bottom]"
              sizes="(max-width: 768px) 100vw, 520px"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#2C4E68] from-[28%] via-[#2C4E68]/95 to-[#2C4E68]/45 sm:from-[36%] sm:via-[#2C4E68]/85 sm:to-transparent"
            aria-hidden
          />

          <div className="relative z-[1] flex flex-col items-center px-6 py-14 text-center sm:px-10 sm:py-16 md:py-20">
            <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-[2rem] md:leading-snug">
              {FAQ_NEWSLETTER.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
              {FAQ_NEWSLETTER.subtitle}
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:mt-12 sm:flex-row sm:items-stretch sm:rounded-full sm:bg-white sm:p-1.5 sm:pl-6 sm:shadow-md"
              noValidate
            >
              <label htmlFor="about-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="about-newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                disabled={pending}
                className="min-h-[52px] w-full rounded-full border border-white/30 bg-white px-5 py-3.5 text-sm text-brand-charcoal outline-none placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-white/70 sm:min-h-0 sm:flex-1 sm:border-0 sm:bg-transparent sm:py-3 sm:shadow-none sm:focus-visible:ring-0"
              />
              <button
                type="submit"
                disabled={pending}
                className="min-h-[52px] shrink-0 rounded-full border border-white bg-black px-8 text-sm font-semibold text-white transition-colors hover:bg-neutral-900 disabled:opacity-60 sm:min-h-[48px] sm:px-7"
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
