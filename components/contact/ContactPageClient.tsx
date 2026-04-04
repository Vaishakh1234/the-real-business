"use client";

import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { publicContentFrameClass } from "@/lib/constants/publicLayout";
import { CONTACT, SOCIAL_LINKS } from "@/lib/constants/site";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { useSubmitContactForm } from "@/hooks/useLeads";

const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val.replace(/\s/g, "")),
      "Enter a valid 10-digit Indian mobile number",
    ),
  interest: z.enum(["buy", "sell", "rent", "general"], {
    required_error: "Please select an option",
  }),
  message: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 10 && val.length <= 2000),
      "If provided, message must be 10–2000 characters",
    ),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const interestOptions: {
  value: ContactFormValues["interest"];
  label: string;
}[] = [
  { value: "buy", label: "Buying a property" },
  { value: "sell", label: "Selling a property" },
  { value: "rent", label: "Renting a property" },
  { value: "general", label: "General inquiry" },
];

export function ContactPageClient() {
  const submitContact = useSubmitContactForm();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      interest: "general",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact.mutate(
      {
        name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: data.email,
        phone: data.phone?.trim() || null,
        message: `Interest: ${interestOptions.find((o) => o.value === data.interest)?.label ?? data.interest}\n\n${data.message ?? "(No message)"}`,
        source: "website",
      },
      {
        onSuccess: () => reset(),
      },
    );
  };

  return (
    <section className="flex min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] w-full flex-col py-10 sm:py-14">
      <div
        className={cn(publicContentFrameClass, "flex min-h-0 flex-1 flex-col")}
      >
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl mb-2">
          Contact The Real Business
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Real estate marketing, consultancy, and buying &amp; selling support
          in Palakkad. For common questions, see our{" "}
          <Link
            href="/faq"
            className="font-medium text-brand-gold hover:underline"
          >
            FAQ
          </Link>
          , explore{" "}
          <Link
            href="/services"
            className="font-medium text-brand-gold hover:underline"
          >
            our services
          </Link>
          , or{" "}
          <Link
            href="/properties"
            className="font-medium text-brand-gold hover:underline"
          >
            browse current listings
          </Link>
          .
        </p>
        <div className="grid flex-1 grid-cols-1 content-center gap-12 xl:grid-cols-2 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Send us a message
              </h2>
              <p className="text-muted-foreground">
                Whether you&apos;re looking to buy, sell, or just have a
                question, our team is ready to assist you.
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register("firstName")}
                    className="w-full min-h-[48px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                    placeholder="e.g. Ramesh"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register("lastName")}
                    className="w-full min-h-[48px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                    placeholder="e.g. Kumar"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full min-h-[48px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                    placeholder="e.g. name@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone")}
                    className="w-full min-h-[48px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all"
                    placeholder="e.g. 98765 43210"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="interest"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  I&apos;m interested in <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="interest"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="interest"
                        className={cn(
                          "w-full h-[52px] px-4 py-3 rounded-xl border border-border bg-muted text-foreground shadow-sm transition-all",
                          "focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold focus:ring-offset-0",
                          "hover:bg-muted/80",
                          "data-[placeholder]:text-muted-foreground",
                          errors.interest &&
                            "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                        )}
                      >
                        <SelectValue placeholder="Choose an option" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-border bg-white shadow-lg">
                        {interestOptions.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="rounded-lg py-2.5 pl-3 pr-8 focus:bg-brand-gold/10 focus:text-foreground cursor-pointer"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.interest && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.interest.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className="w-full min-h-[120px] px-4 py-3 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all resize-none"
                  placeholder="How can we help you? (optional; if provided, min. 10 characters)"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitContact.isPending}
                className="w-full py-4 bg-brand-charcoal text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {submitContact.isPending ? "Sending…" : "Send Message"}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="bg-muted p-4 sm:p-6 lg:p-8 rounded-2xl border border-border">
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4 sm:mb-6">
                Contact Information
              </h3>

              <address className="space-y-4 sm:space-y-6 not-italic">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                    <MapPin size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                      Office
                    </h4>
                    <p className="text-gray-600 text-[13px] sm:text-base leading-snug">
                      {CONTACT.address.line1}
                      <br />
                      {CONTACT.address.city}
                    </p>
                  </div>
                </div>

                {CONTACT.phone ? (
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                      <Phone size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                        Phone
                      </h4>
                      <p className="text-gray-600 text-[13px] sm:text-base leading-snug">
                        {CONTACT.phone}
                      </p>
                    </div>
                  </div>
                ) : null}

                {CONTACT.whatsappUrl ? (
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                      <MessageCircle size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                        WhatsApp
                      </h4>
                      <a
                        href={CONTACT.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-gold text-[13px] sm:text-base leading-snug hover:underline"
                      >
                        {CONTACT.whatsappLabel}
                      </a>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                    <Mail size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                      Email
                    </h4>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="text-gray-600 text-[13px] sm:text-base leading-snug hover:text-brand-gold transition-colors"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-brand-gold shrink-0 shadow-sm">
                    <Clock size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground mb-0.5 sm:mb-1 text-sm sm:text-base">
                      Working Hours
                    </h4>
                    <p className="text-gray-600 text-[13px] sm:text-base leading-snug">
                      {CONTACT.workingHours.weekdays}
                      <br />
                      {CONTACT.workingHours.saturday}
                    </p>
                  </div>
                </div>
              </address>

              {SOCIAL_LINKS.length > 0 && (
                <div className="mt-6 sm:mt-8 pt-6 border-t border-border">
                  <h4 className="font-bold text-foreground mb-3 text-sm sm:text-base">
                    Follow Us
                  </h4>
                  <div className="flex items-center gap-3">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.platform}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.ariaLabel}
                        className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-brand-gold hover:border-brand-gold/50 transition-colors"
                      >
                        <SocialIcon platform={social.platform} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
