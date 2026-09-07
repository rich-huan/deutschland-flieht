/**
 * Sämtliche Inhalte der Seite an einer Stelle.
 *
 * WICHTIG — Datenlage:
 * Alle Zahlenwerte in dieser Datei sind ausdrücklich gekennzeichnete
 * PLATZHALTER. Es liegen im Projekt keine geprüften Datenquellen vor.
 * Sobald echte Zahlen samt Quelle vorhanden sind, genügt es, die Werte und
 * das Feld `source` hier zu ersetzen — die Komponenten bleiben unverändert.
 *
 * Ebenso sind die Zitate in `voices` redaktionelle Beispielformulierungen und
 * keine echten Testimonials.
 */

/** Wird an mehreren Stellen sichtbar ausgewiesen, damit Demo-Werte als solche erkennbar sind. */
export const DEMO_LABEL = "Demo-Daten";

export interface NavItem {
  id: string;
  label: string;
}

export const site = {
  wordmark: "Deutschland flieht.",
  nav: [
    { id: "warum", label: "Warum" },
    { id: "zahlen", label: "Zahlen" },
    { id: "chronik", label: "Chronik" },
    { id: "wohin", label: "Wohin" },
    { id: "stimmen", label: "Stimmen" },
    { id: "petition", label: "Petition" },
  ] satisfies NavItem[],
  ctaLabel: "Unterschreiben",
} as const;

export const hero = {
  eyebrow: "Ein Land verliert Vertrauen.",
  titleLead: "Deutschland",
  titleAccent: "flieht",
  lede: "Immer mehr Menschen können sich vorstellen, Deutschland dauerhaft zu verlassen.",
} as const;

/** Konfiguration des Live-Tickers im Hero. PLATZHALTER-Wert. */
export const liveTicker = {
  initialValue: 12_483_721,
  caption: "Menschen in Deutschland, die sich vorstellen können auszuwandern",
  step: { min: 1, max: 4 },
  interval: { min: 2600, max: 6400 },
} as const;

export interface Reason {
  id: string;
  title: string;
  body: string;
}

export const reasons: readonly Reason[] = [
  {
    id: "kosten",
    title: "Lebenshaltungskosten",
    body: "Immer mehr Einkommen verschwindet in Wohnen, Energie und Alltag.",
  },
  {
    id: "steuern",
    title: "Steuern & Abgaben",
    body: "Viele Menschen haben das Gefühl, dass von ihrer Arbeit immer weniger übrig bleibt.",
  },
  {
    id: "buerokratie",
    title: "Bürokratie",
    body: "Komplexität und langsame Prozesse prägen Unternehmen wie Privatleben.",
  },
  {
    id: "vertrauen",
    title: "Vertrauen",
    body: "Ein wachsender Teil der Bevölkerung zweifelt daran, dass sich die Situation verbessert.",
  },
  {
    id: "perspektive",
    title: "Perspektive",
    body: "Andere Länder erscheinen einfacher, günstiger oder dynamischer.",
  },
] as const;

export interface Stat {
  id: string;
  value: number;
  unit: "percent" | "absolute";
  caption: string;
  share: number | null;
  /** `null` = noch keine Quelle hinterlegt; wird als Platzhalter ausgewiesen. */
  source: string | null;
}

export const stats: readonly Stat[] = [
  {
    id: "bereitschaft",
    value: 26,
    unit: "percent",
    caption: "können sich vorstellen, Deutschland dauerhaft zu verlassen",
    share: 26,
    source: null,
  },
  {
    id: "fortzuege",
    value: 270_000,
    unit: "absolute",
    caption: "Menschen mit deutscher Staatsangehörigkeit verlassen das Land pro Jahr",
    share: null,
    source: null,
  },
  {
    id: "gruende",
    value: 61,
    unit: "percent",
    caption: "nennen wirtschaftliche Gründe als ausschlaggebend",
    share: 61,
    source: null,
  },
] as const;

/* ------------------------------------------------------------------ *\
   03 — Chronik: Verlauf über die Jahre
\* ------------------------------------------------------------------ */

export interface TimelinePoint {
  year: number;
  /** PLATZHALTER: Fortzüge in Tausend. */
  value: number;
}

export const timeline = {
  title: "Der Trend zeigt in eine Richtung",
  lede: "Fortzüge von Menschen mit deutscher Staatsangehörigkeit, in Tausend je Jahr. Der Einbruch 2020 zeigt, wie sensibel die Kurve auf äußere Ereignisse reagiert.",
  unit: "Tausend Fortzüge",
  source: null as string | null,
  points: [
    { year: 2015, value: 138 },
    { year: 2016, value: 146 },
    { year: 2017, value: 149 },
    { year: 2018, value: 152 },
    { year: 2019, value: 157 },
    { year: 2020, value: 132 },
    { year: 2021, value: 151 },
    { year: 2022, value: 174 },
    { year: 2023, value: 196 },
    { year: 2024, value: 238 },
    { year: 2025, value: 270 },
  ] satisfies TimelinePoint[],
} as const;

/* ------------------------------------------------------------------ *\
   04 — Wohin: Zielländer
\* ------------------------------------------------------------------ */

export interface Destination {
  id: string;
  country: string;
  /** PLATZHALTER: Anteil an allen Fortzügen in Prozent. */
  value: number;
  note: string;
}

export const destinations = {
  title: "Und wohin gehen sie?",
  lede: "Die meisten bleiben in Reichweite. Nähe, Sprache und ein vertrauter Arbeitsmarkt wiegen offenbar schwerer als die Ferne.",
  unit: "Anteil an allen Fortzügen",
  source: null as string | null,
  items: [
    { id: "ch", country: "Schweiz", value: 21, note: "Sprache, Löhne, Nähe" },
    { id: "at", country: "Österreich", value: 14, note: "Sprache und Nähe" },
    { id: "us", country: "USA", value: 11, note: "Arbeitsmarkt" },
    { id: "es", country: "Spanien", value: 9, note: "Lebenshaltung, Klima" },
    { id: "pl", country: "Polen", value: 7, note: "Kosten und Nähe" },
    { id: "nl", country: "Niederlande", value: 6, note: "Arbeitsmarkt" },
  ] satisfies Destination[],
} as const;

export interface Voice {
  id: string;
  quote: string;
}

export const voices: readonly Voice[] = [
  { id: "leistung", quote: "Ich habe nicht das Gefühl, dass sich Leistung noch lohnt." },
  { id: "kinder", quote: "Ich möchte meinen Kindern andere Möglichkeiten geben." },
  { id: "freiheit", quote: "Ich will weniger Bürokratie und mehr Freiheit." },
] as const;

/* ------------------------------------------------------------------ *\
   Manifest — die Überleitung zur Petition
\* ------------------------------------------------------------------ */

export const manifest = {
  kicker: "Worum es geht",
  lines: [
    "Ein Land, das seine Leute",
    "gehen lässt, verliert",
    "nicht nur Menschen.",
  ],
  accent: "Es verliert seine Zukunft.",
  body: "Wer geht, nimmt Ausbildung, Steuern, Ideen und Familien mit. Und wer bleibt, trägt mehr. Das ist keine Frage von links oder rechts — es ist eine Frage, ob dieses Land ein Ort bleibt, an dem man sich etwas aufbauen will.",
} as const;

export const petition = {
  headlineLead: "Wir wollen, dass Deutschland wieder ein Land wird, in dem Menschen",
  headlineAccent: "bleiben wollen",
  body: "Dieser Aufruf richtet sich an alle, die nicht gehen wollen — sondern etwas verändern. Trag dich ein und mach sichtbar, wie viele das genauso sehen.",
  /** PLATZHALTER-Wert bis zur Anbindung einer echten Datenquelle. */
  supporters: 38_421,
  /**
   * Deutlich ruhiger als der Hero-Ticker: nur gelegentlich eine Stimme mehr.
   * Muss eine stabile Konstante bleiben — der Zähler-Hook hängt daran.
   */
  supporterTicker: {
    step: { min: 1, max: 2 },
    interval: { min: 9000, max: 22000 },
  },
  supportersCaption: "Menschen haben bereits unterschrieben",
  consentLabel: "Ich unterstütze den Aufruf.",
  submitLabel: "Petition unterschreiben",
  successTitle: "Danke. Deine Stimme zählt.",
  successBody:
    "Demo-Modus: Es wurden keine Daten übertragen und nichts gespeichert. Der Absende-Vorgang ist im Code vorbereitet und lässt sich mit einem Backend verbinden.",
} as const;

export const footer = {
  links: [
    { href: "#impressum", label: "Impressum" },
    { href: "#datenschutz", label: "Datenschutz" },
  ],
  disclaimer:
    "Unabhängige Kampagnenseite. Alle dargestellten Zahlen sind Platzhalter und keine belegten Statistiken. Quellenangaben werden an dieser Stelle ergänzt, sobald geprüfte Daten vorliegen.",
} as const;
