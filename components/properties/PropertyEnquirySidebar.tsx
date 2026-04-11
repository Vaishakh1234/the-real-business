"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Loader2, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/useWishlist";
import {
  ASK_LEON,
  CONTACT,
  getContactWhatsAppUrl,
  getContactWhatsAppUrlWithPrefill,
  SOCIAL_LINKS,
} from "@/lib/constants/site";
import { buildPropertyWhatsAppPrefillMessage } from "@/lib/whatsapp-property-prefill";
import { cn } from "@/lib/utils";
import type { PropertyWithRelations } from "@/types";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { LISTING_CARD } from "@/lib/constants/listing-card";

const ENQUIRY_DEFAULT = "I'm interested in this property.";
const VISIT_DEFAULT = "I would like to book a site visit for this property.";

type LeadTab = "enquiry" | "visit";

export function PropertyEnquirySidebar({
  propertyId,
  propertyTitle,
  property,
}: {
  propertyId: string;
  propertyTitle: string;
  /** When set, WhatsApp opens with a pre-filled enquiry for this listing. */
  property?: PropertyWithRelations;
}) {
  const { has, toggle } = useWishlist();
  const saved = has(propertyId);
  const [tab, setTab] = useState<LeadTab>("enquiry");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(ENQUIRY_DEFAULT);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const whatsappHref = property
    ? getContactWhatsAppUrlWithPrefill(
        buildPropertyWhatsAppPrefillMessage(
          property,
          `/properties/${property.slug}`,
        ),
      )
    : getContactWhatsAppUrl();

  const syncMessageWithTab = useCallback((next: LeadTab) => {
    setTab(next);
    setMessage(next === "enquiry" ? ENQUIRY_DEFAULT : VISIT_DEFAULT);
  }, []);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: propertyTitle,
          text: `Check out this property: ${propertyTitle}`,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      } catch {
        toast.error("Could not share or copy link");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName) {
      toast.error("Please enter your name");
      return;
    }
    if (!trimmedEmail && !trimmedPhone) {
      toast.error("Please enter either email or phone number");
      return;
    }

    const intentPrefix =
      tab === "visit" ? "[Site visit request]\n\n" : "[Property enquiry]\n\n";
    const bodyMessage = `${intentPrefix}${message.trim() || (tab === "visit" ? VISIT_DEFAULT : ENQUIRY_DEFAULT)}`;

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail || null,
          phone: trimmedPhone || null,
          message: bodyMessage,
          source: "website",
          lead_type: tab === "visit" ? "site_visit" : "enquiry",
          property_id: propertyId,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error ?? "Failed to submit");
      }
      setStatus("success");
      toast.success("Thank you — we will get back to you soon.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage(tab === "enquiry" ? ENQUIRY_DEFAULT : VISIT_DEFAULT);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-neutral-200/90 bg-white px-4 py-8 shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:rounded-2xl sm:px-8 sm:py-12 sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <div className="mx-auto flex max-w-[17rem] flex-col items-center text-center">
          <div
            className="mb-6 flex size-[4.5rem] shrink-0 items-center justify-center rounded-full bg-[#1E8E3E] shadow-[0_6px_20px_rgba(30,142,62,0.32)] ring-[10px] ring-[#1E8E3E]/10 animate-in zoom-in-50 fade-in duration-500 motion-reduce:animate-none"
            aria-hidden
          >
            <Check
              className="size-[2rem] text-white"
              strokeWidth={2.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </div>
          <h3 className="font-heading text-xl font-semibold tracking-tight text-brand-charcoal">
            Message received
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Our team will contact you shortly.
          </p>

          {whatsappHref ? (
            <>
              <p className="mt-8 text-sm text-muted-foreground">or</p>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-gold text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {CONTACT.whatsappLabel}
              </a>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-brand-charcoal hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] sm:space-y-5 sm:rounded-2xl sm:p-6 sm:shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex flex-1 min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-brand-charcoal hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          <Share2 className="h-4 w-4 shrink-0" aria-hidden />
          Share
        </button>
        <button
          type="button"
          onClick={() => {
            toggle(propertyId);
            toast.success(saved ? "Removed from saved" : "Saved to your list");
          }}
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
            saved
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-neutral-200 bg-white text-muted-foreground hover:bg-neutral-50",
          )}
          aria-label={saved ? "Remove from saved" : "Save property"}
          aria-pressed={saved}
        >
          <Heart
            className={cn("h-5 w-5", saved && "fill-current")}
            aria-hidden
          />
        </button>
      </div>

      <div
        className="rounded-xl p-4 text-white"
        style={{ backgroundColor: LISTING_CARD.ctaRed }}
      >
        <div className="flex gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
            <Image
              src="/images/home-modal/home-modal-6.png"
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-base font-bold leading-tight">
              Are you interested?
            </p>
            <p className="mt-1 text-sm text-white/90 leading-snug">
              {ASK_LEON.description.slice(0, 90)}
              {ASK_LEON.description.length > 90 ? "…" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl border border-neutral-200 bg-neutral-50/80 p-1">
        <button
          type="button"
          onClick={() => syncMessageWithTab("enquiry")}
          className={cn(
            "min-h-10 flex-1 rounded-lg text-sm font-semibold transition-colors",
            tab === "enquiry"
              ? "bg-brand-gold-muted text-brand-charcoal shadow-sm"
              : "text-muted-foreground hover:bg-white/80 hover:text-brand-charcoal",
          )}
        >
          Enquiry
        </button>
        <button
          type="button"
          onClick={() => syncMessageWithTab("visit")}
          className={cn(
            "min-h-10 flex-1 rounded-lg text-sm font-semibold transition-colors",
            tab === "visit"
              ? "bg-brand-gold-muted text-brand-charcoal shadow-sm"
              : "text-muted-foreground hover:bg-white/80 hover:text-brand-charcoal",
          )}
        >
          Book a site visit
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="pd-name"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Name <span className="text-brand-charcoal">*</span>
          </label>
          <input
            id="pd-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="pd-phone"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Phone
          </label>
          <input
            id="pd-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
            placeholder="Phone number"
          />
        </div>
        <div>
          <label
            htmlFor="pd-email"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Email
          </label>
          <input
            id="pd-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
            placeholder="you@example.com"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          * Enter at least email or phone so we can reach you.
        </p>
        <div>
          <label
            htmlFor="pd-message"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Message
          </label>
          <textarea
            id="pd-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
          className="flex w-full min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            backgroundColor: LISTING_CARD.ctaRed,
            outlineColor: LISTING_CARD.ctaRed,
          }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
              Sending…
            </>
          ) : tab === "visit" ? (
            "Request site visit"
          ) : (
            "Submit enquiry"
          )}
        </button>
      </form>

      {whatsappHref ? (
        <>
          <p className="py-3 text-center text-sm text-muted-foreground">or</p>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-gold text-sm font-semibold text-white hover:bg-brand-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {CONTACT.whatsappLabel}
          </a>
        </>
      ) : null}

      <div className="border-t border-neutral-200 pt-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Follow us
        </p>
        <div className="flex flex-wrap gap-2">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.platform}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.ariaLabel}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-brand-gold/50 hover:bg-brand-gold/5 hover:text-brand-charcoal"
            >
              <SocialIcon platform={social.platform} className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>

      <Link
        href="/properties"
        className="mt-5 block w-full text-center text-sm font-medium text-muted-foreground hover:text-brand-charcoal"
      >
        ← Back to all properties
      </Link>
    </div>
  );
}
