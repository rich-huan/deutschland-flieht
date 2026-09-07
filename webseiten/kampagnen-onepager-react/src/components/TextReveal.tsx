import { type CSSProperties, type ElementType, Fragment } from "react";
import { useInView } from "../hooks/useInView";
import { cx } from "../lib/cx";
import styles from "./TextReveal.module.css";

interface TextRevealProps {
  /** Bei `lines` bestimmt jeder Eintrag eine eigene Zeile mit eigener Maske. */
  text: string | readonly string[];
  as?: ElementType;
  /** `words` staffelt Wort für Wort, `lines` fährt ganze Zeilen aus einer Maske. */
  mode?: "words" | "lines";
  /** Verzögerung vor dem ersten Element in Millisekunden. */
  delay?: number;
  /** Abstand zwischen zwei Elementen in Millisekunden. */
  stagger?: number;
  className?: string;
  id?: string;
}

/**
 * Setzt Text so, dass er beim Erscheinen gestaffelt einläuft — wortweise oder
 * zeilenweise aus einer Maske heraus.
 *
 * Der Text bleibt dabei ein zusammenhängender Textknoten für Screenreader:
 * die Aufteilung passiert nur visuell, Leerzeichen bleiben erhalten.
 */
export function TextReveal({
  text,
  as: Tag = "p",
  mode = "words",
  delay = 0,
  stagger = 34,
  className,
  id,
}: TextRevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.25 });

  const parts = typeof text === "string" ? text.split(" ") : text;
  const plain = typeof text === "string" ? text : text.join(" ");

  return (
    <Tag
      ref={ref}
      id={id}
      className={cx(styles.reveal, styles[mode], className)}
      data-visible={inView ? "" : undefined}
    >
      {/* Für Screenreader der ungeteilte Satz … */}
      <span className="sr-only">{plain}</span>

      {/* … sichtbar dagegen die gestaffelten Teile. */}
      <span aria-hidden="true" className={styles.parts}>
        {parts.map((part, index) => (
          <Fragment key={`${part}-${index}`}>
            <span
              className={styles.mask}
              style={{ "--part-delay": `${delay + index * stagger}ms` } as CSSProperties}
            >
              <span className={styles.part}>{part}</span>
            </span>
            {/* Das Wortzwischenraum muss außerhalb der Maske stehen — in einem
                inline-block würde er verschluckt. */}
            {mode === "words" && index < parts.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
