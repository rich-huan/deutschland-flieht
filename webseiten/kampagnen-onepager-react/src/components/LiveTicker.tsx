import { DEMO_LABEL, liveTicker } from "../content/site";
import { useDemoCounter } from "../hooks/useDemoCounter";
import { Odometer } from "./Odometer";
import styles from "./LiveTicker.module.css";

/**
 * Der Ticker im Hero.
 *
 * DEMO-MODUS: Der Startwert stammt aus `content/site.ts` und wird lokal in
 * unregelmäßigen Abständen leicht erhöht. Er ist als Demo-Wert ausgewiesen und
 * stellt keine echten Live-Daten dar.
 */
export function LiveTicker() {
  const { value, updates } = useDemoCounter(liveTicker.initialValue, {
    step: liveTicker.step,
    interval: liveTicker.interval,
  });

  return (
    <div className={styles.ticker}>
      <p className={styles.status}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.live}>Live</span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.demo}>{DEMO_LABEL}</span>
      </p>

      <Odometer value={value} pulse={updates} size="display" className={styles.value} />

      <p className={styles.caption}>{liveTicker.caption}</p>
    </div>
  );
}
