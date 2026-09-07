import { type CSSProperties, useState } from "react";
import { destinations } from "../content/site";
import { useInView } from "../hooks/useInView";
import { SectionHead } from "./SectionHead";
import styles from "./Destinations.module.css";

/** Längster Balken füllt die Spur — sonst wären alle Werte gestaucht. */
const SCALE = Math.max(...destinations.items.map((item) => item.value));

export function Destinations() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="wohin" data-surface="paper" className={styles.section} aria-labelledby="wohin-title">
      <div className="container">
        <SectionHead index="04" label="Zielländer" title={destinations.title} titleId="wohin-title">
          {destinations.lede}
        </SectionHead>

        <figure ref={ref} className={styles.figure} data-visible={inView ? "" : undefined}>
          <figcaption className={styles.legend}>
            <span className={styles.swatch} aria-hidden="true" />
            {destinations.unit}
          </figcaption>

          <ol className={styles.list}>
            {destinations.items.map((item, index) => (
              <li
                key={item.id}
                className={styles.row}
                data-active={hovered === item.id ? "" : undefined}
                onPointerEnter={() => setHovered(item.id)}
                onPointerLeave={() => setHovered(null)}
              >
                <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>

                <span className={styles.country}>
                  {item.country}
                  <span className={styles.note}>{item.note}</span>
                </span>

                <span className={styles.track}>
                  <span
                    className={styles.bar}
                    style={
                      {
                        "--share": `${(item.value / SCALE) * 100}%`,
                        "--bar-delay": `${index * 110}ms`,
                      } as CSSProperties
                    }
                  />
                </span>

                {/* Direkte Beschriftung statt Achse — der Wert steht am Balken. */}
                <span className={styles.value}>
                  {item.value}
                  <span className={styles.percent}>%</span>
                </span>
              </li>
            ))}
          </ol>

          <p className={styles.source}>
            {destinations.source ?? "Platzhalter — Quelle wird ergänzt"}
          </p>

          <table className="sr-only">
            <caption>{destinations.title}</caption>
            <thead>
              <tr>
                <th scope="col">Land</th>
                <th scope="col">{destinations.unit} in Prozent</th>
              </tr>
            </thead>
            <tbody>
              {destinations.items.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.country}</th>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      </div>
    </section>
  );
}
