import type { CSSProperties } from "react";
import { type Stat, stats } from "../content/site";
import { useCountUp } from "../hooks/useCountUp";
import { useInView } from "../hooks/useInView";
import { formatNumber } from "../lib/format";
import { SectionHead } from "./SectionHead";
import styles from "./Numbers.module.css";

function StatRow({ stat }: { stat: Stat }) {
  const [ref, inView] = useInView<HTMLLIElement>({ threshold: 0.4 });
  const value = useCountUp(stat.value, inView);

  return (
    <li ref={ref} className={styles.stat} data-visible={inView ? "" : undefined}>
      <p className={styles.value}>
        {formatNumber(value)}
        {stat.unit === "percent" && <span className={styles.unit}>%</span>}
      </p>

      <p className={styles.caption}>{stat.caption}</p>

      {stat.share !== null && (
        <div
          className={styles.bar}
          style={{ "--share": `${stat.share}%` } as CSSProperties}
          aria-hidden="true"
        >
          <span className={styles.fill} />
        </div>
      )}

      <p className={styles.source}>{stat.source ?? "Platzhalter — Quelle wird ergänzt"}</p>
    </li>
  );
}

export function Numbers() {
  return (
    <section id="zahlen" data-surface="paper" className={styles.section} aria-labelledby="zahlen-title">
      <div className="container">
        <SectionHead index="02" label="Die Größenordnung" title="Wie groß ist das?" titleId="zahlen-title">
          Die folgenden Werte sind Platzhalter. Sie zeigen, wie die Seite mit
          belastbaren Zahlen aussehen wird, sobald geprüfte Quellen vorliegen.
        </SectionHead>

        <ol className={styles.list}>
          {stats.map((stat) => (
            <StatRow key={stat.id} stat={stat} />
          ))}
        </ol>
      </div>
    </section>
  );
}
