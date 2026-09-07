import { footer } from "../content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <p className={styles.wordmark}>
            Deutschland flieht<span className={styles.dot}>.</span>
          </p>

          <nav aria-label="Rechtliches">
            <ul className={styles.links}>
              {footer.links.map((link) => (
                <li key={link.href}>
                  <a className={styles.link} href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Platz für Quellenangaben, sobald belegte Zahlen vorliegen. */}
        <p className={styles.disclaimer}>{footer.disclaimer}</p>
      </div>
    </footer>
  );
}
