import { DEMO_LABEL, petition } from "../content/site";
import { useDemoCounter } from "../hooks/useDemoCounter";
import { useInView } from "../hooks/useInView";
import { Odometer } from "./Odometer";
import { PetitionForm } from "./PetitionForm";
import { Reveal } from "./Reveal";
import styles from "./Petition.module.css";

/** Unterstützer-Zähler. DEMO-WERT aus `content/site.ts`. */
function SupporterCount() {
  const [ref, inView] = useInView<HTMLParagraphElement>({ threshold: 0.6 });
  const { value, updates } = useDemoCounter(petition.supporters, petition.supporterTicker);

  // Beim Erscheinen rollen die letzten Stellen aus der Null in ihre Position.
  const displayed = inView ? value : Math.floor(petition.supporters / 1000) * 1000;

  return (
    <p ref={ref} className={styles.supporters}>
      <Odometer value={displayed} pulse={updates} size="inline" />
      <span className={styles.supportersText}>
        {petition.supportersCaption}
        <span className={styles.supportersTag}>{DEMO_LABEL}</span>
      </span>
    </p>
  );
}

export function Petition() {
  return (
    <section id="petition" data-surface="paper" className={styles.section} aria-labelledby="petition-title">
      <div className={`container ${styles.inner}`}>
        <p className={styles.rule}>
          <span className={styles.index}>06</span>
          <span className="meta">Der Aufruf</span>
          <span className={styles.ruleLine} />
        </p>

        <Reveal variant="sharpen">
          <h2 id="petition-title" className={styles.title}>
            {petition.headlineLead}{" "}
            <span className={styles.mark}>{petition.headlineAccent}</span>.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className={styles.body}>{petition.body}</p>
        </Reveal>

        <Reveal delay={200}>
          <SupporterCount />
        </Reveal>

        <Reveal delay={280} className={styles.formSlot}>
          <PetitionForm />
        </Reveal>
      </div>
    </section>
  );
}
