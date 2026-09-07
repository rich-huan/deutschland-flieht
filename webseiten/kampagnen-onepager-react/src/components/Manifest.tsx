import { manifest } from "../content/site";
import { FireHorizon } from "../effects/FireHorizon";
import { Reveal } from "./Reveal";
import { TextReveal } from "./TextReveal";
import styles from "./Manifest.module.css";

/**
 * Ruhiger, ganzflächiger Zwischenruf zwischen Daten und Petition — das
 * einzige Kapitel ohne Nummer und ohne Zahlen.
 */
export function Manifest() {
  return (
    <section className={styles.section} aria-labelledby="manifest-title">
      <FireHorizon intensity={0.75} skyline="full" className={styles.horizon} />

      <div className={`container ${styles.inner}`}>
        <Reveal>
          <p className={styles.kicker}>
            <span className={styles.rule} />
            {manifest.kicker}
          </p>
        </Reveal>

        <TextReveal
          as="h2"
          id="manifest-title"
          mode="lines"
          text={manifest.lines}
          stagger={110}
          delay={120}
          className={styles.headline}
        />

        <TextReveal
          as="p"
          mode="lines"
          text={[manifest.accent]}
          delay={480}
          className={styles.accent}
        />

        <Reveal delay={280}>
          <p className={styles.body}>{manifest.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
