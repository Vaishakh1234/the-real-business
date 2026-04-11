"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type AdminLogoutConfirmationProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isLoggingOut: boolean;
  title?: string;
  description?: string;
};

const DEFAULT_TITLE = "Sign out?";
const DEFAULT_DESCRIPTION =
  "Are you sure you want to sign out? Your current session will be ended.";

export function AdminLogoutConfirmation({
  open,
  onOpenChange,
  onConfirm,
  isLoggingOut,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: AdminLogoutConfirmationProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && isLoggingOut) return;
        onOpenChange(next);
      }}
    >
      <AlertDialogContent
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground shadow-xl",
          // Bottom sheet on viewports below lg (admin mobile shell)
          "max-lg:gap-0 max-lg:rounded-b-none max-lg:rounded-t-3xl max-lg:border-x-0 max-lg:border-b-0",
          "max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:top-auto max-lg:w-full max-lg:max-w-none",
          "max-lg:translate-x-0 max-lg:translate-y-0",
          "max-lg:p-4 max-lg:pt-2 max-lg:pb-[calc(1rem+env(safe-area-inset-bottom))]",
          "max-lg:max-h-[min(90dvh,calc(100dvh-env(safe-area-inset-bottom)))]",
          "max-lg:data-[state=open]:slide-in-from-bottom max-lg:data-[state=closed]:slide-out-to-bottom",
          "max-lg:data-[state=open]:zoom-in-100 max-lg:data-[state=closed]:zoom-out-100",
        )}
      >
        <div
          className="flex justify-center pb-2 lg:hidden"
          aria-hidden
        >
          <div className="h-1.5 w-10 shrink-0 rounded-full bg-muted" />
        </div>
        <AlertDialogHeader className="max-lg:text-left">
          <AlertDialogTitle className="max-lg:text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="max-lg:text-[15px] max-lg:leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-3 max-lg:mt-6 sm:flex-col-reverse sm:gap-3 lg:mt-4 lg:flex-row lg:justify-end lg:gap-2 lg:space-x-2">
          <AlertDialogCancel
            disabled={isLoggingOut}
            className="max-lg:h-12 max-lg:w-full max-lg:rounded-xl sm:mt-0"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isLoggingOut}
            variant="destructive"
            className="max-lg:h-12 max-lg:w-full max-lg:rounded-xl sm:min-w-[110px]"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing Out…
              </>
            ) : (
              "Sign Out"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
