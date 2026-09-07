import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Weiches Auslaufen, damit die Zahl am Ende zur Ruhe kommt statt abzubrechen. */
function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4;
}

/**
 * Zählt einmalig auf einen Zielwert hoch, sobald `active` wahr wird.
 * Bei reduzierter Bewegung wird der Zielwert sofort angezeigt.
 */
export function useCountUp(target: number, active: boolean, duration = 1600): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Ohne Animation wird der Zielwert direkt beim Rendern zurückgegeben.
    if (!active || reduced) return;

    let frame = 0;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutQuart(progress) * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration, reduced]);

  if (reduced) return active ? target : 0;
  return value;
}
