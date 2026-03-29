"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "trb-property-wishlist";

/** Stable empty set for SSR — must not be mutated; `getServerSnapshot` must return cached identity. */
const SERVER_SNAPSHOT = new Set<string>();

function readIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

let cache = readIds();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Set<string> {
  return cache;
}

function getServerSnapshot(): Set<string> {
  return SERVER_SNAPSHOT;
}

function persist(next: Set<string>) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    /* ignore quota */
  }
  emit();
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY || e.storageArea !== window.localStorage) return;
  cache = readIds();
  emit();
}

export function useWishlist() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const has = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback((id: string) => {
    const next = new Set(cache);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    persist(next);
  }, []);

  const add = useCallback((id: string) => {
    const next = new Set(cache);
    next.add(id);
    persist(next);
  }, []);

  const remove = useCallback((id: string) => {
    const next = new Set(cache);
    next.delete(id);
    persist(next);
  }, []);

  const removeMany = useCallback((toRemove: string[]) => {
    if (toRemove.length === 0) return;
    const next = new Set(cache);
    for (const id of toRemove) next.delete(id);
    persist(next);
  }, []);

  const clear = useCallback(() => {
    persist(new Set());
  }, []);

  return {
    ids,
    has,
    toggle,
    add,
    remove,
    removeMany,
    clear,
    count: ids.size,
  };
}
