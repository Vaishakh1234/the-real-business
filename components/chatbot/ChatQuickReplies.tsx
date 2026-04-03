"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChatOption } from "./chatFlows";

export function ChatQuickReplies({
  options,
  onSelect,
  disabled,
}: {
  options: ChatOption[];
  onSelect: (o: ChatOption) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 pt-0.5",
        "md:flex-wrap",
        "max-md:flex-nowrap max-md:overflow-x-auto max-md:pb-1 max-md:[scrollbar-gutter:stable]",
        "max-md:snap-x max-md:snap-mandatory max-md:-mx-1 max-md:px-1",
      )}
      role="group"
      aria-label="Quick replies"
    >
      {options.map((opt, i) => (
        <motion.button
          key={opt.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(opt)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.22,
            delay: i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "min-h-[42px] shrink-0 snap-start rounded-xl border border-border/60 bg-background px-3.5 text-left text-[13px] font-medium text-foreground",
            "shadow-sm transition-all duration-200",
            "hover:border-brand-gold/50 hover:bg-brand-gold/5 hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40 focus-visible:ring-offset-1",
            "disabled:pointer-events-none disabled:opacity-50",
            "max-md:max-w-[85vw]",
          )}
        >
          {opt.label}
        </motion.button>
      ))}
    </div>
  );
}
