"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Theme } from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MobileFilterSheetHandle,
  mobileFilterBottomSheetContentClassName,
} from "@/components/ui/mobile-filter-sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] w-[280px] items-center justify-center text-xs text-muted-foreground">
      Loading…
    </div>
  ),
});

const PICKER_PROPS = {
  theme: Theme.LIGHT,
  lazyLoadEmojis: true,
  previewConfig: { showPreview: false },
} as const;

export type EmojiPickerPopoverProps = {
  value: string;
  onSelect: (emoji: string) => void;
  className?: string;
  "aria-label"?: string;
};

export function EmojiPickerPopover({
  value,
  onSelect,
  className,
  "aria-label": ariaLabel = "Choose emoji icon",
}: EmojiPickerPopoverProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const triggerClassName = cn(
    "h-10 w-16 shrink-0 rounded-xl border-input px-0 text-lg font-normal",
    className,
  );

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
    setSheetOpen(false);
    setPopoverOpen(false);
  };

  const triggerInner = value ? (
    <span className="leading-none" aria-hidden>
      {value}
    </span>
  ) : (
    <Smile className="h-5 w-5 text-muted-foreground" />
  );

  return (
    <>
      {/* Mobile / narrow: bottom drawer (matches admin lg breakpoint) */}
      <div className="lg:hidden">
        <Button
          type="button"
          variant="outline"
          aria-label={ariaLabel}
          className={triggerClassName}
          onClick={() => setSheetOpen(true)}
        >
          {triggerInner}
        </Button>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="bottom"
            overlayClassName="z-[100]"
            className={cn(
              mobileFilterBottomSheetContentClassName,
              "z-[100] flex flex-col gap-0 p-0",
            )}
          >
            <MobileFilterSheetHandle />
            <SheetHeader className="shrink-0 space-y-1 px-4 pb-3 pt-1 text-left">
              <SheetTitle className="text-base font-semibold text-[#1a2b4b]">
                Choose icon
              </SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 justify-center overflow-x-hidden overflow-y-auto px-3 pb-3">
              <EmojiPicker
                {...PICKER_PROPS}
                width="100%"
                height={360}
                className="!w-full max-w-[min(100%,400px)]"
                onEmojiClick={handleEmojiClick}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop / lg+: anchored popover */}
      <div className="hidden lg:block">
        <Popover modal={false} open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              aria-label={ariaLabel}
              className={triggerClassName}
            >
              {triggerInner}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto border-gray-200 p-0 shadow-xl"
            align="start"
            side="bottom"
            sideOffset={8}
          >
            <EmojiPicker
              {...PICKER_PROPS}
              width={280}
              height={320}
              onEmojiClick={handleEmojiClick}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
