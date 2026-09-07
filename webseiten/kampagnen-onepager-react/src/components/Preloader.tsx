import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import styles from "./Preloader.module.css";

type Phase = "loading" | "exiting" | "done";

interface PreloaderProps {
  /** Wird gerufen, sobald der Vorhang oben ist — der Hero startet dann. */
  onDone: () => void;
}

/**
 * Auftakt der Seite: Wortmarke, Fortschrittslinie und Zähler, danach fährt der
 * Vorhang nach oben.
 *
 * Der Fortschritt ist an `document.fonts.ready` gekoppelt — die Seite zeigt
 * sich also erst, wenn die Schriften stehen, und springt nicht nach.
 */
export function Preloader({ onDone }: PreloaderProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduced ? "done" : "loading");
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(onDone);

  // Der Rückruf wird in einem Ref gehalten, damit ein neuer Verweis vom
  // Elternteil die laufende Ladeanimation nicht neu startet.
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  // Ohne Bewegung entfällt der Auftakt vollständig.
  useEffect(() => {
    if (!reduced) return;
    doneRef.current();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    document.body.style.overflow = "hidden";

    let frame = 0;
    let ceiling = 88;
    let current = 0;
    let cancelled = false;

    // Die letzten Prozent gibt erst der geladene Zeichensatz frei.
    void document.fonts.ready.then(() => {
      ceiling = 100;
    });

    const start = performance.now();
    const step = (now: number) => {
      if (cancelled) return;

      // Nach 3 Sekunden wird nicht länger auf Schriften gewartet.
      if (now - start > 3000) ceiling = 100;

      current += (ceiling - current) * 0.055 + 0.35;
      const value = Math.min(current, 100);
      setProgress(value);

      if (value >= 99.6) {
        setProgress(100);
        setPhase("exiting");
        return;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  useEffect(() => {
    if (phase !== "exiting") return;

    // Der Hero startet, sobald der Vorhang zu laufen beginnt.
    doneRef.current();
    document.body.style.overflow = "";

    const timer = window.setTimeout(() => setPhase("done"), 1100);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={styles.preloader} data-phase={phase} role="presentation">
      <div className={styles.panel}>
        <div className={styles.inner}>
          <p className={styles.kicker}>Kampagnenseite</p>

          <p className={styles.wordmark}>
            <span className={styles.mask}>
              <span className={styles.line} style={{ animationDelay: "120ms" }}>
                Deutschland
              </span>
            </span>
            <span className={styles.mask}>
              <span className={styles.line} style={{ animationDelay: "260ms" }}>
                flieht.
              </span>
            </span>
          </p>

          <div className={styles.meter}>
            <div className={styles.track}>
              <span className={styles.fill} style={{ transform: `scaleX(${progress / 100})` }} />
            </div>
            <span className={styles.count}>
              {String(Math.round(progress)).padStart(3, "0")}
              <span className={styles.percent}>%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
