"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { PropertyDescriptionEditorProps } from "./PropertyDescriptionEditorInner";

const PropertyDescriptionEditorInner = dynamic(
  () =>
    import("./PropertyDescriptionEditorInner").then(
      (m) => m.PropertyDescriptionEditorInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          "flex min-h-[min(32rem,70vh)] items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground",
        )}
      >
        Loading editor…
      </div>
    ),
  },
);

export type { PropertyDescriptionEditorProps } from "./PropertyDescriptionEditorInner";

export function PropertyDescriptionEditor(
  props: PropertyDescriptionEditorProps,
) {
  return <PropertyDescriptionEditorInner {...props} />;
}
