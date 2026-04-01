"use client";

import Image, { type ImageProps } from "next/image";
import { type ImgHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

export const PROPERTY_PLACEHOLDER_SRC = "/images/property-placeholder.png";

const FALLBACK_BG = "bg-[#eef4fb]";

/**
 * Drop-in next/image replacement that shows a branded placeholder
 * illustration when the source URL is broken or fails to load.
 */
export function PropertyImage({
  className,
  onError: externalOnError,
  ...props
}: ImageProps) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <Image
        {...props}
        src={PROPERTY_PLACEHOLDER_SRC}
        className={cn(className, `!object-contain ${FALLBACK_BG}`)}
        unoptimized
        onError={undefined}
      />
    );
  }

  return (
    <Image
      {...props}
      className={className}
      onError={(e) => {
        setBroken(true);
        if (typeof externalOnError === "function") {
          (
            externalOnError as (
              e: React.SyntheticEvent<HTMLImageElement>,
            ) => void
          )(e);
        }
      }}
    />
  );
}

/**
 * Native &lt;img&gt; with the same broken-image fallback.
 * Use where next/image isn't viable (e.g. inside framer-motion cards).
 */
export function PropertyNativeImg({
  className,
  onError: _externalOnError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...props}
        src={PROPERTY_PLACEHOLDER_SRC}
        className={cn(className, `!object-contain ${FALLBACK_BG}`)}
        alt={props.alt || "Property image placeholder"}
        onError={undefined}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} className={className} onError={() => setBroken(true)} />
  );
}
