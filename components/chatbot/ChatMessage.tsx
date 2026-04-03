"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "./useChatbot";

export function BotAvatar({
  className,
  size = "sm",
}: {
  className?: string;
  /** `lg` for chat header; `sm` for message rows and typing indicator */
  size?: "sm" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold to-[hsl(32,45%,42%)] shadow-sm",
        size === "lg" ? "h-9 w-9" : "h-7 w-7",
        className,
      )}
    >
      <Bot
        className={cn(
          "text-white shrink-0",
          size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5",
        )}
        strokeWidth={2}
        aria-hidden
      />
    </div>
  );
}

export function ChatMessageBubble({ message }: { message: ChatMessageType }) {
  const isBot = message.role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex gap-2",
        isBot ? "self-start" : "self-end flex-row-reverse",
      )}
    >
      {isBot && <BotAvatar className="mt-0.5" />}
      <div
        className={cn(
          "max-w-[min(100%,17rem)] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm",
          isBot
            ? "rounded-tl-md bg-muted/80 text-foreground"
            : "rounded-tr-md bg-brand-gold text-white",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 self-start"
    >
      <BotAvatar />
      <div className="flex gap-1 rounded-2xl rounded-tl-md bg-muted/80 px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
