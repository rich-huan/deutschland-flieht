import type { CSSProperties } from "react";
import { formatNumber, toNumberTokens } from "../lib/format";
import { cx } from "../lib/cx";
import styles from "./Odometer.module.css";

const REEL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface OdometerProps {
  value: number;
  /**
   * Erhöht sich bei jeder Aktualisierung und löst dadurch den gelben
   * Leucht-Impuls neu aus (React montiert das Impuls-Element per Key neu).
   */
  pulse?: number;
  /** `display` für den Hero-Ticker, `inline` für den Unterstützer-Zähler. */
  size?: "display" | "inline";
  className?: string;
}

interface DigitProps {
  value: number;
  /** Position von rechts — steuert den gestaffelten Einsatz der Rollen. */
  offsetFromRight: number;
}

function Digit({ value, offsetFromRight }: DigitProps) {
  return (
    <span className={styles.digit}>
      <span
        className={styles.reel}
        style={
          {
            "--reel-position": value,
            "--reel-delay": `${offsetFromRight * 55}ms`,
          } as CSSProperties
        }
      >
        {REEL_DIGITS.map((digit) => (
          <span key={digit} className={styles.cell}>
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Zahlenanzeige im Stil einer mechanischen Fallblattanzeige:
 * jede Ziffer sitzt auf einer eigenen Rolle, die vertikal in Position fährt.
 */
export function Odometer({ value, pulse = 0, size = "display", className }: OdometerProps) {
  const tokens = toNumberTokens(value);

  return (
    <span className={cx(styles.odometer, styles[size], className)}>
      <span className={styles.reels} aria-hidden="true">
        {pulse > 0 && <span key={pulse} className={styles.pulse} />}
        {tokens.map((token) =>
          token.kind === "separator" ? (
            <span key={token.key} className={styles.separator} />
          ) : (
            <Digit
              key={token.key}
              value={token.value}
              offsetFromRight={token.offsetFromRight}
            />
          ),
        )}
      </span>
      {/* Für Screenreader: der aktuelle Wert als schlichter Text, ohne Live-Meldung. */}
      <span className="sr-only">{formatNumber(value)}</span>
    </span>
  );
}
