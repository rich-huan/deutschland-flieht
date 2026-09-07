import { voices } from "../content/site";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import styles from "./Voices.module.css";

export function Voices() {
  return (
    <section id="stimmen" className={styles.section} aria-labelledby="stimmen-title">
      <div className="container">
        <SectionHead
          index="05"
          label="Stimmen"
          title="Was Menschen sagen, die darüber nachdenken"
          titleId="stimmen-title"
        />

        <div className={styles.list}>
          {voices.map((voice) => (
            <Reveal key={voice.id} variant="sharpen" className={styles.item}>
              <figure className={styles.figure}>
                <blockquote className={styles.quote}>
                  <p>{voice.quote}</p>
                </blockquote>
                <figcaption className={styles.caption}>Exemplarisches Statement</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
