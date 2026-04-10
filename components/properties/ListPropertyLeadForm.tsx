"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { LISTING_CARD } from "@/lib/constants/listing-card";
import { CONTACT, getContactWhatsAppUrl } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Public form on the property directory page for owners who want to list with the brokerage.
 * Creates a lead with `lead_type: list_property`.
 */
export function ListPropertyLeadForm({ className }: { className?: string }) {
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState<"sale" | "rent">("sale");
  const [locality, setLocality] = useState("");
  const [details, setDetails] = useState("");
  const whatsappHref = getContactWhatsAppUrl();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) {
      toast.error("Please enter your name.");
      return;
    }
    const em = email.trim();
    const ph = phone.replace(/\s/g, "").trim();
    if (!em && !ph) {
      toast.error("Please enter either email or phone.");
      return;
    }
    setPending(true);
    try {
      const message = [
        `[List property — ${intent === "sale" ? "For sale" : "For rent"}]`,
        locality.trim() ? `Location / area: ${locality.trim()}` : null,
        details.trim() ? `Details: ${details.trim()}` : null,
      ]
        .filter(Boolean)
        .join("\n\n");
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: n,
          email: em || null,
          phone: ph || null,
          message,
          source: "website",
          lead_type: "list_property",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to submit");
      toast.success(
        "Thanks — we will contact you shortly about listing your property.",
      );
      setName("");
      setEmail("");
      setPhone("");
      setLocality("");
      setDetails("");
      setIntent("sale");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.07)] sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold-muted text-brand-charcoal"
          aria-hidden
        >
          <Home className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-bold tracking-tight text-brand-charcoal sm:text-xl">
            List your property with us
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Tell us about the property you want to list. Our team will reach
            out to help you publish it and connect with buyers or tenants.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="list-prop-name">Your name</Label>
            <Input
              id="list-prop-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="h-11 rounded-xl border-neutral-200 bg-white"
              autoComplete="name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="list-prop-email">Email</Label>
            <Input
              id="list-prop-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-xl border-neutral-200 bg-white"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="list-prop-phone">Phone</Label>
            <Input
              id="list-prop-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile number"
              className="h-11 rounded-xl border-neutral-200 bg-white"
              autoComplete="tel"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="list-prop-intent">Listing</Label>
            <Select
              value={intent}
              onValueChange={(v) => setIntent(v as "sale" | "rent")}
            >
              <SelectTrigger
                id="list-prop-intent"
                className="h-11 rounded-xl border-neutral-200 bg-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="sale">For sale</SelectItem>
                <SelectItem value="rent">For rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="list-prop-locality">
              Location / area (optional)
            </Label>
            <Input
              id="list-prop-locality"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Ottapalam, Palakkad district"
              className="h-11 rounded-xl border-neutral-200 bg-white"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="list-prop-details">
              Property details (optional)
            </Label>
            <Textarea
              id="list-prop-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Plot size, built-up area, expected price range, road access…"
              className="min-h-[100px] resize-y rounded-xl border-neutral-200 bg-white p-3 text-[15px]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs text-muted-foreground">
            By submitting, you agree we may contact you about this listing.
          </p>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                style={{ backgroundColor: LISTING_CARD.ctaRed }}
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" aria-hidden />
                WhatsApp
              </a>
            ) : null}
            <Button
              type="submit"
              disabled={pending}
              className="h-11 min-w-[160px] rounded-full bg-brand-charcoal font-semibold text-white shadow-sm transition-[background-color,transform] hover:bg-brand-charcoal/92 focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-[0.99]"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Request a listing call"
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground sm:text-left">
          Want to see our listings first?{" "}
          <Link
            href="/properties"
            className="font-medium text-brand-charcoal underline decoration-neutral-300 underline-offset-4 hover:decoration-brand-gold"
          >
            View details
          </Link>
          {" · "}
          <Link
            href="/contact"
            className="font-medium text-brand-charcoal underline decoration-neutral-300 underline-offset-4 hover:decoration-brand-gold"
          >
            {CONTACT.contactUsLabel}
          </Link>
        </p>
      </form>
    </div>
  );
}
