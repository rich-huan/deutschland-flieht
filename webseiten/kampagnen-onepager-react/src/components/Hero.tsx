import { hero } from "../content/site";
import { FireHorizon } from "../effects/FireHorizon";
import { LiveTicker } from "./LiveTicker";
import styles from "./Hero.module.css";

interface HeroProps {
  /** Erst wenn der Vorhang der Ladeanimation läuft, startet der Hero. */
  ready: boolean;
}

export function Hero({ ready }: HeroProps) {
  return (
    <section
      className={styles.hero}
      data-ready={ready ? "" : undefined}
      aria-labelledby="hero-title"
    >
      <FireHorizon intensity={1} skyline="full" className={styles.horizon} />

      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowRule} />
          {hero.eyebrow}
        </p>

        <h1 id="hero-title" className={styles.title}>
          {/* Der Schein liegt außerhalb der Masken — sonst schneiden sie ihn
              zu einem harten Rechteck. */}
          <span className={styles.titleGlow} aria-hidden="true" />
          <span className={styles.maskLine}>
            <span className={styles.lead}>{hero.titleLead}</span>
          </span>
          <span className={styles.maskLine}>
            <span className={styles.accent}>
              {hero.titleAccent}
              <span className={styles.dot}>.</span>
            </span>
          </span>
        </h1>

        <p className={styles.lede}>{hero.lede}</p>

        <div className={styles.tickerSlot}>
          <LiveTicker />
        </div>
      </div>

      <span className={styles.scrollCue} aria-hidden="true" />
    </section>
  );
}
