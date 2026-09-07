import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { TextReveal } from "./TextReveal";
import styles from "./SectionHead.module.css";

interface SectionHeadProps {
  /** Laufende Nummer im Kopfbalken, z. B. „01“. */
  index: string;
  label: string;
  title: string;
  /** Wird mit `aria-labelledby` des Abschnitts verknüpft. */
  titleId?: string;
  children?: ReactNode;
}

/**
 * Kopfzeile einer Sektion: schmale Auszeichnungszeile auf einer Haarlinie mit
 * mitlaufender Glut, darunter die Headline, die wortweise einläuft.
 */
export function SectionHead({ index, label, title, titleId, children }: SectionHeadProps) {
  return (
    <header className={styles.head}>
      <Reveal className={styles.ruleWrap}>
        <p className={styles.rule}>
          <span className={styles.index}>{index}</span>
          <span className="meta">{label}</span>
        </p>
      </Reveal>

      <TextReveal as="h2" id={titleId} text={title} className={styles.title} stagger={42} />

      {children && (
        <Reveal delay={220}>
          <p className={styles.lede}>{children}</p>
        </Reveal>
      )}
    </header>
  );
}
