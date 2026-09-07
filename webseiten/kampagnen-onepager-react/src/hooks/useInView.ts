import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Beobachtung nach dem ersten Treffer beenden (Standard: ja). */
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Beobachtet ein Element und meldet, sobald es im Viewport erscheint.
 * Wird für die Einblend-Animationen und die Zahlen-Counter verwendet.
 */
export function useInView<T extends Element>({
  once = true,
  threshold = 0.2,
  rootMargin = "0px 0px -12% 0px",
}: UseInViewOptions = {}): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  // Ohne IntersectionObserver (sehr alte Browser) gilt der Inhalt als sichtbar.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return [ref, inView];
}
