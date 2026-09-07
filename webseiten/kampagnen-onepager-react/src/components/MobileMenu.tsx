import { useEffect, useRef } from "react";
import { site } from "../content/site";
import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  open: boolean;
  activeId: string | null;
  onClose: () => void;
}

/**
 * Vollflächiges Menü für schmale Displays. Die Einträge laufen nacheinander
 * ein; Escape und ein Klick auf einen Eintrag schließen es wieder.
 */
export function MobileMenu({ open, activeId, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      // Der Fokus bleibt im Menü, solange es offen ist.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={styles.overlay}
      data-open={open ? "" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Menü"
      // Geschlossen ist das Menü für Tastatur und Screenreader nicht vorhanden.
      aria-hidden={open ? undefined : true}
      inert={!open}
    >
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.head}>
          <span className="meta">Navigation</span>
          <button type="button" ref={closeRef} className={styles.close} onClick={onClose}>
            <span aria-hidden="true">Schließen</span>
            <span className="sr-only">Menü schließen</span>
          </button>
        </div>

        <nav>
          <ul className={styles.list}>
            {site.nav.map((item, position) => (
              <li key={item.id} style={{ transitionDelay: `${140 + position * 60}ms` }}>
                <a
                  className={styles.link}
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "true" : undefined}
                  onClick={onClose}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className={styles.cta} href="#petition" onClick={onClose}>
          {site.ctaLabel}
        </a>
      </div>
    </div>
  );
}
