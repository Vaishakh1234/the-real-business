"use client";

import { useEffect, useRef, useState } from "react";

const TYPE_MS = 38;
const PAUSE_MS = 2600;

/**
 * When `idle` is true (empty, unfocused search), cycles through `hints` with a typewriter effect.
 */
export function useSearchTypewriter(
  idle: boolean,
  hints: readonly string[],
): string {
  const [hintIdx, setHintIdx] = useState(0);
  const [typedLen, setTypedLen] = useState(0);
  const idlePrev = useRef(false);

  useEffect(() => {
    if (idle && !idlePrev.current) {
      setHintIdx(0);
      setTypedLen(0);
    }
    idlePrev.current = idle;
  }, [idle]);

  useEffect(() => {
    if (!idle || hints.length === 0) return;

    const text = hints[hintIdx] ?? "";
    if (typedLen < text.length) {
      const id = window.setTimeout(() => setTypedLen((n) => n + 1), TYPE_MS);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      setHintIdx((h) => (h + 1) % hints.length);
      setTypedLen(0);
    }, PAUSE_MS);
    return () => window.clearTimeout(id);
  }, [idle, hintIdx, typedLen, hints]);

  if (!idle || hints.length === 0) return "";
  const full = hints[hintIdx] ?? "";
  return full.slice(0, typedLen);
}
