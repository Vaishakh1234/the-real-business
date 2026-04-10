"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Check, Loader2, RotateCcw, Send, X } from "lucide-react";
import { toast } from "sonner";
import { CHATBOT } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { buildLeadMessage, type ChatNodeTextInput } from "./chatFlows";
import { BotAvatar, ChatMessageBubble, TypingIndicator } from "./ChatMessage";
import { ChatQuickReplies } from "./ChatQuickReplies";
import { useChatbot } from "./useChatbot";

export function ChatWidget() {
  const chat = useChatbot();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showTyping, setShowTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const prevMsgCount = useRef(chat.messages.length);

  const scrollMessages = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useEffect(() => {
    if (!chat.panelOpen) return;
    const newBotMsg =
      chat.messages.length > prevMsgCount.current &&
      chat.messages[chat.messages.length - 1]?.role === "bot";
    prevMsgCount.current = chat.messages.length;

    if (newBotMsg) {
      setShowTyping(true);
      const t = window.setTimeout(() => {
        setShowTyping(false);
        scrollMessages();
      }, 500);
      return () => window.clearTimeout(t);
    }
    scrollMessages();
  }, [
    chat.panelOpen,
    chat.messages,
    chat.currentNodeId,
    chat.submitted,
    scrollMessages,
  ]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !chat.panelOpen) return;
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
      setShowScrollBtn(!atBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [chat.panelOpen]);

  useEffect(() => {
    if (!chat.panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") chat.close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chat.panelOpen, chat.close]);

  useEffect(() => {
    if (chat.panelOpen) {
      const t = window.setTimeout(() => closeBtnRef.current?.focus(), 100);
      return () => window.clearTimeout(t);
    }
  }, [chat.panelOpen]);

  useEffect(() => {
    if (chat.panelOpen && chat.currentNode.type === "text_input") {
      const t = window.setTimeout(() => textAreaRef.current?.focus(), 150);
      return () => window.clearTimeout(t);
    }
  }, [chat.panelOpen, chat.currentNode]);

  const handleLeadSuccess = useCallback(() => {
    chat.leadSuccess();
    toast.success("Thanks! We'll get back to you soon.");
  }, [chat.leadSuccess]);

  const submittingRef = useRef(false);

  useEffect(() => {
    if (
      chat.currentNode.type !== "lead_auto_submit" ||
      chat.submitted ||
      chat.submitError ||
      submittingRef.current
    )
      return;

    submittingRef.current = true;
    const {
      leadName = "",
      leadEmail = "",
      leadPhone = "",
      leadNotes = "",
    } = chat.textFields;

    const baseMessage = buildLeadMessage(chat.pathSegments, chat.textFields);
    const extra = leadNotes ? `\n\nAdditional notes: ${leadNotes}` : "";
    const message = `${baseMessage}${extra}`.trim();

    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: leadName || "Unknown",
        email: leadEmail || null,
        phone: leadPhone || null,
        message: message || null,
        source: "chatbot",
        lead_type: "enquiry",
      }),
    })
      .then(async (res) => {
        const json = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        if (!res.ok) throw new Error(json.error ?? "Something went wrong");
        handleLeadSuccess();
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "Failed to submit";
        chat.leadError(msg);
        toast.error(msg);
      })
      .finally(() => {
        submittingRef.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.currentNode.type, chat.submitted, chat.submitError]);

  return (
    <>
      <AnimatePresence>
        {chat.panelOpen && (
          <motion.div
            key="chat-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${CHATBOT.botName} — chat`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed z-[100] flex flex-col overflow-hidden bg-background",
              "shadow-[0_8px_60px_-12px_rgba(0,0,0,0.25)]",
              "inset-0 h-[100dvh] max-h-[100dvh] w-full rounded-none",
              "md:inset-auto md:bottom-6 md:right-6 md:left-auto md:top-auto",
              "md:h-[min(520px,min(82dvh,calc(100dvh-6rem)))] md:max-h-[82dvh] md:w-[380px] md:rounded-2xl md:border md:border-border/50",
            )}
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingTop: "env(safe-area-inset-top)",
            }}
          >
            {/* Premium header */}
            <header className="relative flex shrink-0 items-center justify-between gap-3 px-4 py-3.5 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-charcoal to-[hsl(38,20%,18%)]" />
              <div className="relative flex items-center gap-3 min-w-0">
                <div className="relative">
                  <BotAvatar size="lg" />
                  <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full border-2 border-brand-charcoal bg-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-bold leading-tight">
                    {CHATBOT.botName}
                  </p>
                  <p className="truncate text-[11px] text-white/55 leading-tight mt-0.5">
                    {CHATBOT.assistantLabel} · Online
                  </p>
                </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={chat.close}
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </header>

            {/* Messages area */}
            <div
              ref={scrollContainerRef}
              className="relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4"
              aria-live="polite"
              aria-relevant="additions"
            >
              <div className="flex flex-col gap-3">
                {chat.messages.map((m) => (
                  <ChatMessageBubble key={m.id} message={m} />
                ))}
                <AnimatePresence>
                  {showTyping && <TypingIndicator />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll-to-bottom fab */}
              <AnimatePresence>
                {showScrollBtn && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={scrollMessages}
                    className="sticky bottom-2 left-1/2 z-10 mx-auto flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-background shadow-md border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Scroll to latest"
                  >
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Footer / input area */}
            <div className="shrink-0 border-t border-border/60 bg-muted/20 px-4 py-3">
              {chat.submitted ? (
                <div className="space-y-3 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check className="h-5 w-5 text-emerald-600" aria-hidden />
                  </div>
                  <p className="text-[13px] font-medium text-foreground leading-snug">
                    {CHATBOT.successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={chat.resetConversation}
                    className="inline-flex items-center justify-center gap-1.5 text-[13px] font-medium text-brand-gold hover:text-brand-gold-hover transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    {CHATBOT.startNewLabel}
                  </button>
                </div>
              ) : chat.currentNode.type === "lead_auto_submit" ? (
                chat.submitError ? (
                  <div className="space-y-3 text-center">
                    <p className="text-[13px] text-destructive">
                      {chat.submitError}
                    </p>
                    <button
                      type="button"
                      className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-brand-gold text-[13px] font-semibold text-white transition-colors hover:bg-brand-gold-hover"
                      onClick={chat.clearSubmitError}
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-3 text-[13px] text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    <span>Sending your details…</span>
                  </div>
                )
              ) : chat.currentNode.type === "text_input" ? (
                <ChatTextStep
                  node={chat.currentNode}
                  onSubmit={chat.submitText}
                  disabled={false}
                  inputRef={textAreaRef}
                />
              ) : (
                <ChatQuickReplies
                  options={chat.currentNode.options}
                  onSelect={chat.selectOption}
                  disabled={false}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium floating action button */}
      <AnimatePresence>
        {!chat.panelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "fixed z-[100]",
              "bottom-[max(5.5rem,env(safe-area-inset-bottom)+1.25rem)] right-4",
              "md:bottom-6 md:right-6",
            )}
          >
            {/* Pulse ring */}
            <span
              className="absolute inset-0 animate-ping rounded-full bg-brand-gold/20"
              style={{ animationDuration: "2.5s" }}
            />
            <motion.button
              type="button"
              onClick={chat.toggle}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className={cn(
                "relative flex h-[56px] w-[56px] items-center justify-center rounded-full",
                "bg-gradient-to-br from-brand-gold via-brand-gold to-[hsl(32,45%,42%)]",
                "text-white shadow-[0_4px_24px_-4px_hsl(38,39%,52%,0.5)]",
                "transition-shadow hover:shadow-[0_6px_32px_-4px_hsl(38,39%,52%,0.6)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
              )}
              aria-label={CHATBOT.bubbleAriaLabel}
              aria-expanded={chat.panelOpen}
              aria-haspopup="dialog"
            >
              <svg
                viewBox="0 0 28 28"
                fill="none"
                className="h-7 w-7"
                aria-hidden
              >
                <rect
                  x="2"
                  y="4"
                  width="24"
                  height="16"
                  rx="4"
                  stroke="white"
                  strokeWidth="1.6"
                />
                <path
                  d="M9 24l5-4h-4"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="12" r="1.3" fill="white" />
                <circle cx="14" cy="12" r="1.3" fill="white" />
                <circle cx="19" cy="12" r="1.3" fill="white" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const SINGLE_LINE_FIELDS = new Set(["leadName", "leadEmail", "leadPhone"]);

function ChatTextStep({
  node,
  onSubmit,
  disabled,
  inputRef,
}: {
  node: ChatNodeTextInput;
  onSubmit: (text: string) => void;
  disabled: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const [value, setValue] = useState("");
  const singleLine = SINGLE_LINE_FIELDS.has(node.fieldKey);
  const inputElRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (singleLine) {
      inputElRef.current?.focus();
    }
  }, [singleLine, node.id]);

  const isSubmitLabel = node.submitLabel === "Send";

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
        setValue("");
      }}
    >
      {singleLine ? (
        <div className="flex gap-2">
          <input
            ref={inputElRef}
            type={node.fieldKey === "leadEmail" ? "email" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={node.placeholder}
            disabled={disabled}
            autoComplete={
              node.fieldKey === "leadName"
                ? "name"
                : node.fieldKey === "leadEmail"
                  ? "email"
                  : "tel"
            }
            className="h-11 flex-1 rounded-xl border border-border/60 bg-background px-3 text-[13px] ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40 focus-visible:border-brand-gold/50 transition-colors"
          />
          <button
            type="submit"
            disabled={disabled}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              "bg-brand-charcoal text-white hover:bg-brand-charcoal/85",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40",
              "disabled:opacity-50 disabled:pointer-events-none",
            )}
            aria-label={node.submitLabel ?? "Continue"}
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <>
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={node.placeholder}
            rows={3}
            disabled={disabled}
            className="min-h-[5rem] w-full resize-none rounded-xl border border-border/60 bg-background px-3 py-2.5 text-[13px] ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40 focus-visible:border-brand-gold/50 transition-colors"
          />
          <button
            type="submit"
            disabled={disabled}
            className={cn(
              "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-colors",
              isSubmitLabel
                ? "bg-brand-gold text-white hover:bg-brand-gold-hover"
                : "bg-brand-charcoal text-white hover:bg-brand-charcoal/85",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40",
              "disabled:opacity-50 disabled:pointer-events-none",
            )}
          >
            {isSubmitLabel && <Send className="h-3.5 w-3.5" aria-hidden />}
            {node.submitLabel ?? "Continue"}
          </button>
        </>
      )}
    </form>
  );
}
