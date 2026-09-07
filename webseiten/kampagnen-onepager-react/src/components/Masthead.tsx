import { useEffect, useRef, useState } from "react";
import { site } from "../content/site";
import { useScrollMeter } from "../hooks/useScrollMeter";
import { MobileMenu } from "./MobileMenu";
import styles from "./Masthead.module.css";

/**
 * Zeitungskopf: Wortmarke, Inhaltsverzeichnis, ein Knopf.
 *
 * Über dem Hero ist der Kopf durchsichtig und hell beschriftet; sobald die
 * Papier-Kapitel beginnen, legt er sich als Papierstreifen darüber und dreht
 * die Schrift auf Schwarz.
 */
export function Masthead() {
  const barRef = useRef<HTMLSpanElement>(null);
  const { detached } = useScrollMeter(barRef);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Hebt den Abschnitt hervor, der gerade gelesen wird.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = site.nav
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={styles.masthead}
        data-detached={detached ? "" : undefined}
        data-surface={detached ? "paper" : undefined}
      >
        <div className={styles.bar}>
          <a className={styles.wordmark} href="#top">
            Deutschland flieht<span className={styles.dot}>.</span>
            <span className="sr-only"> — zum Seitenanfang</span>
          </a>

          <nav className={styles.nav} aria-label="Kapitel">
            <ul className={styles.navList}>
              {site.nav.map((item) => (
                <li key={item.id}>
                  <a
                    className={styles.link}
                    href={`#${item.id}`}
                    aria-current={activeId === item.id ? "true" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a className={styles.cta} href="#petition">
              {site.ctaLabel}
            </a>

            <button
              type="button"
              className={styles.burger}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span className="sr-only">Menü öffnen</span>
            </button>
          </div>
        </div>

        {/* Lesefortschritt der ganzen Seite. */}
        <span ref={barRef} className={styles.progress} aria-hidden="true" />
      </header>

      <MobileMenu open={menuOpen} activeId={activeId} onClose={() => setMenuOpen(false)} />
    </>
  );
}
