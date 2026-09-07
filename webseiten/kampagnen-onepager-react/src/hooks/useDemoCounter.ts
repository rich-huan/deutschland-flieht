import { useEffect, useState } from "react";

interface Range {
  min: number;
  max: number;
}

interface DemoCounterOptions {
  /** Zuwachs je Aktualisierung. */
  step: Range;
  /** Abstand zwischen zwei Aktualisierungen in Millisekunden. */
  interval: Range;
  /** Aktualisierungen anhalten (z. B. wenn das Element nicht sichtbar ist). */
  enabled?: boolean;
}

interface DemoCounterState {
  value: number;
  /** Zählt jede Aktualisierung mit — dient als Auslöser für den Leucht-Impuls. */
  updates: number;
}

function randomBetween({ min, max }: Range): number {
  return min + Math.random() * (max - min);
}

/**
 * DEMO-MODUS: erhöht einen Startwert in unregelmäßigen Abständen leicht.
 *
 * Das ist bewusst keine echte Live-Datenquelle. Sobald eine API existiert,
 * kann dieser Hook durch einen Datenabruf ersetzt werden — die Signatur
 * (`value` + `updates`) bleibt für die Ticker-Komponente identisch.
 */
export function useDemoCounter(
  initialValue: number,
  { step, interval, enabled = true }: DemoCounterOptions,
): DemoCounterState {
  const [state, setState] = useState<DemoCounterState>({
    value: initialValue,
    updates: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    let timer = 0;

    const schedule = () => {
      timer = window.setTimeout(() => {
        setState((previous) => ({
          value: previous.value + Math.round(randomBetween(step)),
          updates: previous.updates + 1,
        }));
        schedule();
      }, randomBetween(interval));
    };

    const handleVisibility = () => {
      window.clearTimeout(timer);
      // Im Hintergrund-Tab läuft nichts weiter — spart Rechenzeit und Akku.
      if (document.visibilityState === "visible") schedule();
    };

    schedule();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, step, interval]);

  return state;
}
