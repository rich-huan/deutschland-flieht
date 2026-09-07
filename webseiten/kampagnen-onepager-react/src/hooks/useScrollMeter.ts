import { type RefObject, useEffect, useState } from "react";

interface ScrollMeter {
  /** Wird wahr, sobald der Hero verlassen wird — der Kopf zieht sich dann zusammen. */
  detached: boolean;
}

/**
 * Schreibt den Lesefortschritt direkt als Transform auf das übergebene Element.
 *
 * Der Fortschritt läuft bewusst am React-Zustand vorbei: Ein `setState` pro
 * Scroll-Frame würde den ganzen Kopf 60-mal je Sekunde neu rendern. Nur der
 * Schwellwert `detached` ist Zustand — der ändert sich zweimal pro Seite.
 */
export function useScrollMeter(barRef: RefObject<HTMLElement | null>): ScrollMeter {
  const [detached, setDetached] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      setDetached(window.scrollY > 24);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [barRef]);

  return { detached };
}
