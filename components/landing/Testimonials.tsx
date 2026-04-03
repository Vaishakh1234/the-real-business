"use client";

import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants/site";

interface Review {
  quote: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
}

const reviews: Review[] = [
  {
    quote:
      "The Real Business transformed our home buying experience with professionalism and care, making the process smooth and enjoyable from start to finish.",
    name: "Sreelakshmi Menon",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "24th May, 2024",
  },
  {
    quote:
      "Needed a quick sale. They delivered an amazing offer, exceeding our expectations. So grateful for their expertise and guidance throughout the process.",
    name: "Rajesh Krishnan",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 4.5,
    date: "12th Mar, 2024",
  },
  {
    quote:
      "Professional, fast, and reliable. We got our dream plot in under 30 days. From first consultation to final paperwork, truly outstanding work.",
    name: "Arun Nambiar",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "8th Jan, 2024",
  },
  {
    quote:
      "They truly understood what we wanted and found us the perfect property. Great communication throughout the entire buying process.",
    name: "Deepa Pillai",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 4,
    date: "15th Apr, 2024",
  },
  {
    quote:
      "The team's local knowledge of Palakkad is unmatched. They helped us navigate the market and get the best deal we could ask for.",
    name: "Vishnu Unnikrishnan",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
    rating: 4.5,
    date: "2nd Jun, 2024",
  },
  {
    quote:
      "Excellent service from start to finish. They were patient, knowledgeable, and always available to answer all of our questions.",
    name: "Ananya Nair",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    date: "19th Feb, 2024",
  },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex w-[280px] flex-shrink-0 flex-col justify-between rounded-2xl border border-neutral-100 bg-white p-4 shadow-[0_1px_12px_rgba(0,0,0,0.05)] xs:w-[320px] sm:w-[400px] sm:p-6">
      {/* Quote icon */}
      <div>
        <Quote className="mb-3 h-6 w-6 fill-brand-gold/20 text-brand-gold sm:h-7 sm:w-7" />

        {/* Quote text */}
        <p className="text-[14px] leading-relaxed text-neutral-600 sm:text-[15px]">
          {review.quote}
        </p>
      </div>

      {/* Footer: reviewer + rating */}
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-100 pt-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.avatar}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-neutral-50"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">
              {review.name}
            </p>
            <p className="text-xs text-neutral-400">{review.date}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm font-bold text-neutral-800">
            {review.rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.floor(review.rating);
              const half = !filled && i < review.rating;
              return (
                <span key={i} className="relative h-3.5 w-3.5">
                  <Star className="absolute inset-0 h-3.5 w-3.5 fill-neutral-200 text-neutral-200" />
                  {(filled || half) && (
                    <span
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: half ? "50%" : "100%" }}
                    >
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  return (
    <section
      className="py-10 pb-24 sm:py-14 sm:pb-28 lg:py-16 lg:pb-32"
      aria-labelledby="reviews-heading"
    >
      {/* Header — constrained to content frame */}
      <div className="mx-auto mb-8 w-full max-w-[1680px] px-4 xs:px-5 sm:mb-12 sm:px-6 lg:px-16 xl:px-24">
        <div>
          <h2
            id="reviews-heading"
            className="font-heading text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl"
          >
            What our clients say about our services
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-neutral-500 sm:text-base">
            Read how our clients found a trusted partner for their real estate
            goals in Palakkad.
          </p>
        </div>
      </div>

      {/* Auto-scrolling marquee — aligned with content frame */}
      <div className="mx-auto w-full max-w-[1680px] px-4 xs:px-5 sm:px-6 lg:px-16 xl:px-24">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-16 lg:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-16 lg:w-24" />

          <div
            className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused] sm:gap-6"
            style={{ animationDuration: "40s" }}
          >
            {[...reviews, ...reviews].map((review, i) => (
              <ReviewCard key={`${review.name}-${i}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
