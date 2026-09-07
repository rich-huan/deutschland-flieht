/** Fügt Klassennamen zusammen und lässt `false`/`undefined` weg. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
