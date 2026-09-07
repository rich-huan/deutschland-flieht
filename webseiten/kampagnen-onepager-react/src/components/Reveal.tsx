import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../hooks/useInView";
import { cx } from "../lib/cx";
import styles from "./Reveal.module.css";

interface RevealProps {
  children: ReactNode;
  /** `sharpen` blendet zusätzlich von leichter Unschärfe auf — nur für Headlines. */
  variant?: "rise" | "sharpen";
  /** Versatz in Millisekunden, um Elemente nacheinander erscheinen zu lassen. */
  delay?: number;
  className?: string;
}

/**
 * Blendet seinen Inhalt einmalig ein, sobald er in den Viewport kommt.
 * Bei reduzierter Bewegung erscheint er ohne Übergang (siehe global.css).
 */
export function Reveal({ children, variant = "rise", delay = 0, className }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cx(styles.reveal, styles[variant], className)}
      data-visible={inView ? "" : undefined}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
