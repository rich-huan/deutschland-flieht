const deNumber = new Intl.NumberFormat("de-DE");

export function formatNumber(value: number): string {
  return deNumber.format(value);
}

export type NumberToken =
  | { kind: "digit"; value: number; key: string; offsetFromRight: number }
  | { kind: "separator"; key: string };

/**
 * Zerlegt eine Zahl in Ziffern und Tausender-Trenner.
 *
 * Die Ziffern werden von rechts nach links durchnummeriert, damit jede
 * Ziffernrolle im Ticker über die gesamte Lebensdauer denselben React-Key
 * behält — nur so bleibt die Rollbewegung an der richtigen Stelle.
 */
export function toNumberTokens(value: number): NumberToken[] {
  const digits = Math.trunc(Math.abs(value)).toString().split("");
  const tokens: NumberToken[] = [];

  digits.forEach((digit, index) => {
    const positionFromRight = digits.length - 1 - index;
    tokens.push({
      kind: "digit",
      value: Number(digit),
      key: `d${positionFromRight}`,
      offsetFromRight: positionFromRight,
    });
    if (positionFromRight > 0 && positionFromRight % 3 === 0) {
      tokens.push({ kind: "separator", key: `s${positionFromRight}` });
    }
  });

  return tokens;
}
