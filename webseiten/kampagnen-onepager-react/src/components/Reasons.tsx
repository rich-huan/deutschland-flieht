import { useEffect, useRef, useState } from "react";
import { reasons } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import styles from "./Reasons.module.css";

/**
 * Beim Scrollen tritt jeweils der Grund hervor, der gerade die Mitte des
 * Bildschirms durchläuft — die übrigen treten zurück.
 */
function useFocusedReason(enabled: boolean): [React.RefObject<HTMLOListElement | null>, string | null] {
  const listRef = useRef<HTMLOListElement>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!enabled || !list || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setFocusedId(entry.target.getAttribute("data-reason"));
          }
        }
      },
      // Schmales Band quer durch die Bildschirmmitte.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    const items = list.querySelectorAll("[data-reason]");
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [enabled]);

  return [listRef, focusedId];
}

export function Reasons() {
  const reduced = useReducedMotion();
  const [listRef, focusedId] = useFocusedReason(!reduced);

  return (
    <section id="warum" data-surface="paper" className={styles.section} aria-labelledby="warum-title">
      <div className="container">
        <SectionHead
          index="01"
          label="Die Frage"
          title="Warum wollen Menschen gehen?"
          titleId="warum-title"
        />

        <ol ref={listRef} className={styles.list}>
          {reasons.map((reason, position) => (
            <li
              key={reason.id}
              data-reason={reason.id}
              // Ohne Fokus-Logik (reduzierte Bewegung) sind alle Einträge gleich präsent …
              data-active={reduced || focusedId === reason.id ? "" : undefined}
              // … die gelbe Markierung bleibt dann aber weg, sonst hebt sie nichts mehr hervor.
              data-focused={!reduced && focusedId === reason.id ? "" : undefined}
              className={styles.item}
            >
              <Reveal className={styles.row}>
                <span className={styles.index} aria-hidden="true">
                  {String(position + 1).padStart(2, "0")}
                </span>
                <div className={styles.text}>
                  <h3 className={styles.title}>{reason.title}</h3>
                  <p className={styles.body}>{reason.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
