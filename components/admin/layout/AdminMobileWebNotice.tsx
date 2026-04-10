"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  dismissAdminMobileWebNotice,
  isAdminMobileWebNoticeDismissed,
} from "@/lib/constants/admin-mobile-notice";
import { cn } from "@/lib/utils";

/** Matches Tailwind `lg` (1024px): admin uses bottom nav / drawer below this width. */
const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

export function AdminMobileWebNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);

    function sync() {
      const mobile = mq.matches;
      if (!mobile) {
        setOpen(false);
        return;
      }
      if (isAdminMobileWebNoticeDismissed()) {
        setOpen(false);
        return;
      }
      setOpen(true);
    }

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        className={cn(
          "font-admin-sans",
          // Fade-only entrance so slide/zoom does not fight centering transforms on small screens.
          "data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=closed]:zoom-out-100",
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Admin on your phone</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-balance">
            You can review leads, get push alerts from <strong>Settings</strong>{" "}
            (or the header bell), and manage listings on the go. For heavy
            editing (long descriptions, many photos), a larger screen is still
            easier when you have time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              dismissAdminMobileWebNotice();
            }}
          >
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
