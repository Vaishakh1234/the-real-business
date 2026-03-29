"use client";

/**
 * HeroSearchPanel
 *
 * Home hero block: white floating card with headline text, Post property link,
 * and category dropdown + keyword search + Search CTA.
 * Sits on the hero imagery; max-width is controlled by the parent wrapper in `Hero`.
 *
 * Also renders “Recent searches” chips below the card (localStorage-backed).
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Clock, ChevronRight, HousePlus, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HOME_HERO_SEARCH_PROMPT,
  PUBLIC_SEARCH_TYPEWRITER_HINTS,
  postPropertyHrefWithCta,
} from "@/lib/constants/site";
import { usePublicCategories } from "@/hooks/useCategories";
import { useSearchTypewriter } from "@/hooks/useSearchTypewriter";
const RECENT_KEY = "trb-hero-recent-searches";

/** Radix Select items need non-empty values; map to "" for URL/state */
const HERO_CATEGORY_ALL = "__all__" as const;

/** Default listing type for hero search (matches former “Buy” tab). */
const HERO_SEARCH_LIST_TYPE = "sale" as const;
const HERO_RECENT_LABEL = "Properties";

/** Web Speech API (Chrome/Edge/Safari); not in all TS `lib` versions */
type HeroSpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onresult:
    | ((e: {
        results: { length: number; [i: number]: { 0: { transcript: string } } };
      }) => void)
    | null;
  start: () => void;
  stop: () => void;
};
type HeroSpeechRecognitionCtor = new () => HeroSpeechRecognitionInstance;

type RecentItem = { label: string; href: string };

type HeroSearchPanelProps = {
  /** Place under headline + category row (margin) instead of bottom-aligned in hero */
  stackedBelowCategories?: boolean;
};

export function HeroSearchPanel({
  stackedBelowCategories = false,
}: HeroSearchPanelProps = {}) {
  const [search, setSearch] = useState("");
  const [heroQueryFocused, setHeroQueryFocused] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [voiceListening, setVoiceListening] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<HeroSpeechRecognitionInstance | null>(
    null,
  );
  const { data: categories = [], isLoading: categoriesLoading } =
    usePublicCategories();

  const heroQueryIdle = !search.trim() && !heroQueryFocused;
  const heroTypewriterText = useSearchTypewriter(
    heroQueryIdle,
    PUBLIC_SEARCH_TYPEWRITER_HINTS,
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw) as RecentItem[]);
    } catch {
      setRecent([]);
    }
  }, []);

  const buildParams = useCallback(() => {
    const p = new URLSearchParams();
    const q = search.trim();
    if (q) p.set("search", q);
    if (categoryId) p.set("category_id", categoryId);
    return p;
  }, [search, categoryId]);

  const resultsHref = useMemo(() => {
    const qs = buildParams().toString();
    return qs ? `/properties?${qs}` : "/properties";
  }, [buildParams]);

  useEffect(() => {
    return () => {
      try {
        speechRecognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      speechRecognitionRef.current = null;
    };
  }, []);

  const startVoiceSearch = useCallback(() => {
    if (typeof window === "undefined") return;

    const w = window as unknown as {
      SpeechRecognition?: HeroSpeechRecognitionCtor;
      webkitSpeechRecognition?: HeroSpeechRecognitionCtor;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      toast.error("Voice search isn’t available in this browser", {
        description: "Try Chrome, Edge, or Safari.",
      });
      return;
    }

    try {
      speechRecognitionRef.current?.stop();
    } catch {
      /* ignore */
    }

    const rec = new Ctor();
    speechRecognitionRef.current = rec;
    rec.lang =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : "en-IN";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setVoiceListening(true);

    rec.onend = () => {
      setVoiceListening(false);
      speechRecognitionRef.current = null;
    };

    rec.onerror = (event: { error: string }) => {
      setVoiceListening(false);
      speechRecognitionRef.current = null;
      if (event.error === "aborted") return;
      if (event.error === "no-speech") {
        toast.message("No speech heard", {
          description: "Tap the mic again and speak your search.",
        });
        return;
      }
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        toast.error("Microphone access blocked", {
          description:
            "Allow microphone permission for this site and try again.",
        });
        return;
      }
      if (event.error === "audio-capture") {
        toast.error("No microphone found", {
          description: "Check that a mic is connected and enabled.",
        });
        return;
      }
      toast.error("Voice search didn’t work", {
        description: "Check your connection and try again.",
      });
    };

    rec.onresult = (event: {
      results: { length: number; [i: number]: { 0: { transcript: string } } };
    }) => {
      const last = event.results[event.results.length - 1];
      const text = last?.[0]?.transcript?.trim();
      if (text) {
        setSearch((prev) => (prev ? `${prev} ${text}` : text));
        queueMicrotask(() => searchInputRef.current?.focus());
      }
    };

    try {
      rec.start();
    } catch {
      setVoiceListening(false);
      speechRecognitionRef.current = null;
      toast.error("Could not start voice search", {
        description: "Try again in a moment.",
      });
    }
  }, []);

  const persistRecent = useCallback(() => {
    try {
      const label = search.trim()
        ? `${HERO_RECENT_LABEL} · ${search.trim()}`
        : `${HERO_RECENT_LABEL} in Palakkad`;
      const href = `/properties?${buildParams().toString()}`;
      const prev = (() => {
        try {
          const r = localStorage.getItem(RECENT_KEY);
          return r ? (JSON.parse(r) as RecentItem[]) : [];
        } catch {
          return [];
        }
      })();
      const next = [
        { label, href },
        ...prev.filter((x) => x.href !== href),
      ].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      setRecent(next);
    } catch {
      /* ignore */
    }
  }, [buildParams, search]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "w-full min-w-0 max-w-[42rem] flex-shrink-0 self-start space-y-4 xl:max-w-5xl",
        stackedBelowCategories
          ? "mt-4 pb-4 sm:mt-10 sm:pb-4 lg:pb-4"
          : "mt-3 pb-6 sm:mt-4 sm:pb-8 lg:pb-10",
      )}
    >
      <div className="w-full min-w-0">
        {/*
         * ── Hero search card ─────────────────────────────────────────
         * Row 1: headline + vertical rule + Post property
         * Row 2: category select | search field | SEARCH button
         */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.04]">
          {/* Row 1: headline + Post property */}
          <div className="flex flex-col gap-0 border-b border-neutral-200 lg:flex-row lg:items-stretch lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex min-h-[52px] items-center px-3 py-2.5 sm:min-h-[56px] sm:px-4 sm:py-3">
                <p className="font-heading text-lg font-bold leading-snug tracking-tight text-neutral-700 sm:text-xl">
                  {HOME_HERO_SEARCH_PROMPT}
                </p>
              </div>
            </div>

            <div className="hidden h-auto w-px shrink-0 bg-neutral-200 lg:block" />

            <div className="flex items-center justify-center border-t border-neutral-200 px-4 py-2.5 lg:border-t-0 lg:py-0 lg:pr-5">
              <Link
                href={postPropertyHrefWithCta("POST_PROPERTY_HP_SEARCH_BAR")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 transition-colors hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
              >
                Post property
                <HousePlus
                  className="h-4 w-4 shrink-0 opacity-90"
                  strokeWidth={2}
                  aria-hidden
                />
              </Link>
            </div>
          </div>

          {/* Row 2: single search bar (reference layout: dropdown | input | utility icons | search) */}
          <div className="p-3 sm:p-4 md:p-5">
            <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] md:h-14 md:flex-row md:items-stretch">
              <div className="relative flex min-h-[52px] shrink-0 items-stretch border-b border-neutral-200 bg-white md:min-h-0 md:w-[min(10.25rem,32vw)] md:max-w-[11rem] md:border-b-0 md:border-r md:border-neutral-200">
                <Select
                  value={categoryId || HERO_CATEGORY_ALL}
                  onValueChange={(v) =>
                    setCategoryId(v === HERO_CATEGORY_ALL ? "" : v)
                  }
                  disabled={categoriesLoading}
                >
                  <SelectTrigger
                    id="hero-property-type"
                    aria-label="Property type"
                    className={cn(
                      "h-full min-h-[52px] w-full rounded-none border-0 bg-transparent px-3 py-3 text-left text-[15px] font-semibold text-neutral-800 shadow-none ring-0 ring-offset-0 focus:ring-2 focus:ring-brand-gold/50 focus:ring-offset-0 data-[state=open]:ring-2 data-[state=open]:ring-brand-gold/40 md:min-h-0 md:h-14 md:rounded-l-xl md:px-3.5 md:py-0",
                      "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:text-neutral-500 [&>svg]:opacity-100",
                    )}
                  >
                    <SelectValue placeholder="All residential" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={6}
                    align="start"
                    className="z-[200] max-h-72 w-max min-w-[var(--radix-select-trigger-width)] max-w-[min(22rem,calc(100vw-2rem))] border-neutral-200 bg-white text-neutral-900 shadow-lg"
                  >
                    <SelectItem
                      value={HERO_CATEGORY_ALL}
                      className="cursor-pointer py-2.5 pl-3 pr-8 text-[15px] font-medium focus:bg-neutral-100 focus:text-neutral-900"
                    >
                      All residential
                    </SelectItem>
                    {categories.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className="cursor-pointer py-2.5 pl-3 pr-8 text-[15px] focus:bg-neutral-100 focus:text-neutral-900"
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative flex min-h-[52px] min-w-0 flex-1 items-center px-3 md:min-h-0 md:px-4">
                <input
                  ref={searchInputRef}
                  type="search"
                  id="hero-search-query"
                  placeholder={
                    heroQueryFocused
                      ? "Enter locality, project, society, or landmark"
                      : undefined
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setHeroQueryFocused(true)}
                  onBlur={() => setHeroQueryFocused(false)}
                  className="relative z-10 min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-500 md:py-0 md:text-[17px]"
                  aria-label="Search locality, project, society, or landmark"
                />
                {heroQueryIdle ? (
                  <span
                    role="status"
                    aria-live="polite"
                    className="pointer-events-none absolute left-3 top-1/2 z-0 max-w-[calc(100%-1.5rem)] -translate-y-1/2 truncate text-left text-[15px] text-neutral-500 md:left-4 md:max-w-[calc(100%-2rem)] md:text-[17px]"
                  >
                    {heroTypewriterText}
                    <span
                      className="ml-px inline-block h-[1em] w-px translate-y-px animate-pulse bg-neutral-500/70 align-middle"
                      aria-hidden
                    />
                  </span>
                ) : null}
              </div>

              <div className="flex min-h-[52px] items-center justify-end gap-2 border-t border-neutral-200 bg-white px-3 py-2.5 md:min-h-0 md:h-14 md:border-t-0 md:border-l md:border-neutral-200 md:px-2.5 md:py-2">
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  disabled={voiceListening}
                  aria-pressed={voiceListening}
                  aria-busy={voiceListening}
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-wait",
                    voiceListening
                      ? "border-red-400/80 text-red-600 ring-2 ring-red-400/40"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800",
                  )}
                  aria-label={
                    voiceListening ? "Listening… speak now" : "Search by voice"
                  }
                  title={
                    voiceListening
                      ? "Listening… speak your search"
                      : "Voice search"
                  }
                >
                  <Mic
                    className={cn(
                      "h-[18px] w-[18px]",
                      voiceListening && "animate-pulse",
                    )}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </button>

                <Link
                  href={resultsHref}
                  onClick={persistRecent}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black text-white shadow-sm transition-colors hover:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
                  aria-label="Search listings"
                >
                  <Search
                    className="h-[18px] w-[18px]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent searches (same localStorage key as before extraction) */}
      {recent.length > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/60">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Recent searches
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {recent.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex max-w-[min(100%,280px)] items-center gap-1.5 truncate rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <Clock className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
            <Link
              href="/properties"
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-brand-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              View all searches
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
