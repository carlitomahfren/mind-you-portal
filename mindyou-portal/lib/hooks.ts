"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Guards against duplicate submits that beat React's state flush on fast
 * double-taps. Call guard() at the top of a submit handler — it returns false
 * if a submit is already in flight. Always call release() when it settles.
 */
export function useSubmitGuard() {
  const busyRef = useRef(false);

  const guard = useCallback(() => {
    if (busyRef.current) return false;
    busyRef.current = true;
    return true;
  }, []);

  const release = useCallback(() => {
    busyRef.current = false;
  }, []);

  return { guard, release };
}

/** Autofocuses the target input on pointer-precise devices only, so mobile keyboards don't pop open on page load. */
export function useDesktopAutofocus<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    try {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      // Let entrance animations settle before pulling focus.
      const t = setTimeout(() => ref.current?.focus({ preventScroll: true }), 350);
      return () => clearTimeout(t);
    } catch {
      return;
    }
  }, []);

  return ref;
}
