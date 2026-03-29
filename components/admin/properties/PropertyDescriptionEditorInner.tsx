"use client";

import { useMemo } from "react";
import type { AlignmentSupportedOption } from "ckeditor5";
import {
  Alignment,
  Autoformat,
  BlockQuote,
  Bold,
  ClassicEditor as ClassicEditorCtor,
  Essentials,
  Heading,
  HorizontalLine,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  RemoveFormat,
  Strikethrough,
  Underline,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { cn } from "@/lib/utils";

export interface PropertyDescriptionEditorProps {
  id?: string;
  value: string | null | undefined;
  onChange: (html: string | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  /** Remount editor when this changes (e.g. sheet entity id). */
  formKey?: string;
  className?: string;
}

export function PropertyDescriptionEditorInner({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  formKey = "default",
  className,
}: PropertyDescriptionEditorProps) {
  const config = useMemo(
    () => ({
      licenseKey: "GPL" as const,
      plugins: [
        Essentials,
        Autoformat,
        Paragraph,
        Heading,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        Link,
        List,
        BlockQuote,
        HorizontalLine,
        Alignment,
        Indent,
        RemoveFormat,
      ],
      heading: {
        options: [
          {
            model: "paragraph" as const,
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1" as const,
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2" as const,
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3" as const,
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4" as const,
            view: "h4",
            title: "Heading 4",
            class: "ck-heading_heading4",
          },
          {
            model: "heading5" as const,
            view: "h5",
            title: "Heading 5",
            class: "ck-heading_heading5",
          },
          {
            model: "heading6" as const,
            view: "h6",
            title: "Heading 6",
            class: "ck-heading_heading6",
          },
        ],
      },
      toolbar: {
        items: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "|",
          "link",
          "|",
          "bulletedList",
          "numberedList",
          "outdent",
          "indent",
          "|",
          "alignment",
          "|",
          "blockQuote",
          "horizontalLine",
          "|",
          "undo",
          "redo",
          "|",
          "removeFormat",
        ],
        shouldNotGroupWhenFull: true,
      },
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
      },
      alignment: {
        options: [
          "left",
          "center",
          "right",
          "justify",
        ] as AlignmentSupportedOption[],
      },
    }),
    [],
  );

  const data = value ?? "";

  return (
    <div
      id={id}
      className={cn(
        "property-description-editor flex min-h-[min(32rem,72vh)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm ring-1 ring-border/50",
        className,
      )}
    >
      <div
        className={cn(
          "property-description-editor__surface flex min-h-[min(28rem,65vh)] flex-1 flex-col",
          // Classic editor fills the frame; editable grows and scrolls inside.
          "[&_.ck.ck-editor]:flex [&_.ck.ck-editor]:min-h-0 [&_.ck.ck-editor]:flex-1 [&_.ck.ck-editor]:flex-col",
          "[&_.ck.ck-editor__top]:shrink-0",
          "[&_.ck.ck-toolbar]:flex-wrap [&_.ck.ck-toolbar]:rounded-none [&_.ck.ck-toolbar]:border-0 [&_.ck.ck-toolbar]:border-b [&_.ck.ck-toolbar]:border-border [&_.ck.ck-toolbar]:bg-muted/50 [&_.ck.ck-toolbar]:px-1 [&_.ck.ck-toolbar]:py-0.5",
          "[&_.ck.ck-editor__main]:flex [&_.ck.ck-editor__main]:min-h-0 [&_.ck.ck-editor__main]:flex-1 [&_.ck.ck-editor__main]:flex-col",
          "[&_.ck.ck-editor__editable]:!min-h-[min(28rem,58vh)] [&_.ck.ck-editor__editable]:max-h-[min(48rem,72vh)] [&_.ck.ck-editor__editable]:flex-1 [&_.ck.ck-editor__editable]:overflow-y-auto",
          "[&_.ck.ck-editor__editable]:rounded-none [&_.ck.ck-editor__editable]:border-0 [&_.ck.ck-editor__editable]:bg-background",
          "[&_.ck.ck-editor__editable]:pl-10 [&_.ck.ck-editor__editable]:pr-5 [&_.ck.ck-editor__editable]:pb-6 [&_.ck.ck-editor__editable]:pt-4",
          // Preflight zeros ul/ol padding; CKEditor only sets list-style-type — restore indent so bullets/numbers are not clipped.
          "[&_.ck-content_ul]:!mx-0 [&_.ck-content_ul]:![padding-inline-start:2.25rem] [&_.ck-content_ul]:![list-style-position:outside]",
          "[&_.ck-content_ol]:!mx-0 [&_.ck-content_ol]:![padding-inline-start:2.25rem] [&_.ck-content_ol]:![list-style-position:outside]",
          "[&_.ck-content_li_ul]:![padding-inline-start:2rem] [&_.ck-content_li_ol]:![padding-inline-start:2rem]",
          // Preflight resets h1–h6 to inherit; without this, heading levels look identical to body text.
          "[&_.ck-content]:text-[15px] [&_.ck-content]:leading-relaxed [&_.ck-content]:text-foreground",
          "[&_.ck-content>*:first-child]:!mt-0",
          "[&_.ck-content_h1]:!mb-3 [&_.ck-content_h1]:!mt-6 [&_.ck-content_h1]:!text-3xl [&_.ck-content_h1]:!font-semibold [&_.ck-content_h1]:!leading-tight",
          "[&_.ck-content_h2]:!mb-2.5 [&_.ck-content_h2]:!mt-5 [&_.ck-content_h2]:!text-2xl [&_.ck-content_h2]:!font-semibold [&_.ck-content_h2]:!leading-snug",
          "[&_.ck-content_h3]:!mb-2 [&_.ck-content_h3]:!mt-4 [&_.ck-content_h3]:!text-xl [&_.ck-content_h3]:!font-semibold [&_.ck-content_h3]:!leading-snug",
          "[&_.ck-content_h4]:!mb-2 [&_.ck-content_h4]:!mt-4 [&_.ck-content_h4]:!text-lg [&_.ck-content_h4]:!font-semibold",
          "[&_.ck-content_h5]:!mb-1.5 [&_.ck-content_h5]:!mt-3 [&_.ck-content_h5]:!text-base [&_.ck-content_h5]:!font-semibold",
          "[&_.ck-content_h6]:!mb-1.5 [&_.ck-content_h6]:!mt-3 [&_.ck-content_h6]:!text-sm [&_.ck-content_h6]:!font-semibold [&_.ck-content_h6]:!uppercase [&_.ck-content_h6]:!tracking-wide",
          "[&_.ck.ck-focused.ck-editor__editable]:shadow-[inset_0_0_0_2px_hsl(var(--ring)/0.35)]",
        )}
      >
        <CKEditor
          key={formKey}
          editor={ClassicEditorCtor}
          config={config}
          data={data}
          disabled={disabled}
          onChange={(_event, editor) => {
            const html = editor.getData();
            onChange(html.trim() === "" ? null : html);
          }}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
}
