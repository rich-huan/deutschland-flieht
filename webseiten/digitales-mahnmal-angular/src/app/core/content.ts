/* ===========================================================================
 * Kampagneninhalte — "Deutschland flieht."
 *
 * ALLE Texte und Zahlen der Seite stehen in dieser Datei. Die Komponenten
 * enthalten keine Inhalte, nur Struktur. Aendern heisst: hier aendern.
 *
 * -------------------------------------------------------------------------
 * WICHTIG — ZAHLEN VOR VEROEFFENTLICHUNG PRUEFEN
 * -------------------------------------------------------------------------
 * Jede Kennzahl hat ein Feld `geprueft`. Es steht ueberall auf `false`.
 * Die Werte sind Groessenordnungen als Platzhalter, nicht belegt.
 * Die gesamte Kampagne haengt an der Belastbarkeit dieser Zahlen: eine
 * einzige angreifbare Ziffer kostet die Glaubwuerdigkeit der Seite.
 *
 * Vorgehen: Wert an der genannten Primaerquelle verifizieren, `wert`,
 * `quelle`, `jahr` und `url` eintragen, dann `geprueft: true` setzen.
 * `ZAHLEN_GEPRUEFT` unten meldet den Stand in der Konsole.
 *
 * Empfohlene Primaerquellen:
 *   - Fortzuege / Wanderungssaldo ... Destatis, Wanderungsstatistik (Fachserie 1 R 1.2)
 *   - Abgabenlast ................... OECD, Taxing Wages (Tax Wedge, Single 100% AW)
 *   - Qualifikationsstruktur ........ OECD International Migration Outlook / IAB
 *   - Direktinvestitionen ........... Deutsche Bundesbank, Zahlungsbilanzstatistik
 * ========================================================================= */

/** Eine belegpflichtige Kennzahl. */
export interface Kennzahl {
  /** Anzeigewert, bereits formatiert (z. B. "270.000", "47,9 %"). */
  readonly wert: string;
  /** Ausgeschriebene Bezeichnung, u. a. im Drei-Spalten-Raster. */
  readonly label: string;
  /** Knappe Bezeichnung fuer die Stat-Zeile im Hero (Format "Kurz: Wert"). */
  readonly kurzLabel: string;
  /** Herausgeber der Primaerquelle. */
  readonly quelle: string;
  /** Bezugsjahr des Werts. */
  readonly jahr: string;
  /** Direktlink zur Fundstelle. Leer, solange nicht verifiziert. */
  readonly url?: string;
  /** Erst `true`, wenn der Wert an der Primaerquelle geprueft wurde. */
  readonly geprueft: boolean;
}

/**
 * Ein Bild.
 *
 * Alle Aufnahmen liegen unter public/bilder/ und stammen aus Wikimedia
 * Commons — freie Lizenzen, echte Fotografien von Frankfurt am Main. Sie
 * sind lokal auf Webgroesse gerechnet; die Originale bleiben bei Commons.
 *
 * WICHTIG: Die CC-BY- und CC-BY-SA-Lizenzen verlangen die Nennung von
 * Urheber und Lizenz. Deshalb traegt jedes Bild seinen Nachweis mit, und
 * die Fusszeile listet sie vollstaendig auf. Wer ein Bild austauscht, muss
 * den Nachweis mit austauschen.
 */
export interface Bild {
  readonly pfad: string;
  readonly alt: string;
  /** Werk und Urheber, fuer den Bildnachweis. */
  readonly nachweis: string;
}

/** Ein vollstaendiger Bildnachweis fuer die Fusszeile. */
export interface Bildnachweis {
  readonly werk: string;
  readonly urheber: string;
  readonly lizenz: string;
}

/** Ein Schritt der gepinnten Scroll-Sequenz. */
export interface SequenzSchritt {
  readonly id: string;
  readonly ueberschrift: string;
  readonly text: string;
  readonly bild: Bild;
}

/** Eine Forderung (Karten-Sektion). */
export interface Forderung {
  readonly id: string;
  readonly titel: string;
  readonly text: string;
}

/** Ein Punkt im Drei-Spalten-Raster mit kreisrundem Bildausschnitt. */
export interface Vignette {
  readonly id: string;
  readonly titel: string;
  readonly kennzahl: Kennzahl;
  readonly bild: Bild;
}

/** Eine Antwortmoeglichkeit im Kurz-Check. */
export interface QuizOption {
  readonly id: string;
  /** Beschriftung der Schaltflaeche. */
  readonly label: string;
  /** Kurzform fuer die Auswertung und fuer die Petitionsseite. */
  readonly kurz: string;
}

/** Eine Frage des Kurz-Checks. */
export interface QuizFrage {
  readonly id: string;
  readonly frage: string;
  /** Eine Zeile Kontext unter der Frage. Erklaert, warum gefragt wird. */
  readonly hinweis: string;
  /** Mehrfachauswahl statt Einfachauswahl. */
  readonly mehrfach: boolean;
  readonly optionen: readonly QuizOption[];
}

/** Ein Abschnitt eines Rechtstextes (Impressum, Datenschutz). */
export interface RechtsAbschnitt {
  readonly titel: string;
  readonly absaetze: readonly string[];
}

/* ---------------------------------------------------------------------------
 * Bilder — Frankfurt am Main, Wikimedia Commons, freie Lizenzen
 *
 * Frankfurt ist hier nicht Dekoration, sondern Argument: die Skyline ist das
 * Bild, das Deutschland selbst benutzt, wenn es von Wohlstand, Kapital und
 * Zukunft spricht. Genau davor spielt der Vorgang, um den es auf dieser
 * Seite geht.
 * ------------------------------------------------------------------------- */

export const BILDER = {
  hero: {
    pfad: '/bilder/hero.jpg',
    alt: 'Frankfurt am Main bei Nacht, die beleuchtete Innenstadt vom anderen Mainufer aus',
    nachweis:
      'Leonhard Lenz, „Frankfurt am Main city center from other side of the Main at night“, 2020 (CC0)',
  },
  sequenz1: {
    pfad: '/bilder/seq-1.jpg',
    alt: 'Die Frankfurter Skyline bei Nacht, hell erleuchtete Bürotürme vor dunklem Himmel',
    nachweis: 'Ghorog, „Skyline Frankfurt am Main bei Nacht“ (CC BY-SA 4.0)',
  },
  sequenz2: {
    pfad: '/bilder/seq-2.jpg',
    alt: 'Die nächtliche Skyline spiegelt sich im Wasser des Mains',
    nachweis: 'Gerda Arendt, „Frankfurt skyline reflected at night“ (CC BY-SA 4.0)',
  },
  sequenz3: {
    pfad: '/bilder/seq-3.jpg',
    alt: 'Die Frankfurter Skyline bei Nacht, beleuchtete Bürotürme über dem dunklen Fluss',
    nachweis: 'Jörg Braukmann, „Frankfurt Skyline bei Nacht“, 2022 (CC BY-SA 4.0)',
  },
  kreis1: {
    pfad: '/bilder/kreis-1.jpg',
    alt: 'Die Ignatz-Bubis-Brücke bei Nacht, Lichtspuren über dem Main',
    nachweis: 'rupp.de, „Ignatz-Bubis-Brücke Frankfurt am Main bei Nacht“ (CC BY-SA 3.0)',
  },
  kreis2: {
    pfad: '/bilder/kreis-2.jpg',
    alt: 'Der Frankfurter Hauptbahnhof in farbigem Licht während der Luminale',
    nachweis: 'Norbert Nagel, „Hauptbahnhof Frankfurt, Luminale 2014“ (CC BY-SA 3.0)',
  },
  kreis3: {
    pfad: '/bilder/kreis-3.jpg',
    alt: 'Das Gebäude der Frankfurter Börse in farbigem Licht während der Luminale',
    nachweis: 'Norbert Nagel, „Börse Frankfurt, Luminale 2014“ (CC BY-SA 3.0)',
  },
  /* Freigestellte Eichenkronen aus Corots Studie von Bas-Bréau. Sie rahmen
     den Hero in den oberen Ecken, wie das Laub in der Vorlage. Der Himmel
     wurde ueber Blaustich und Helligkeit herausgerechnet, die Blattkanten
     sind dadurch unregelmaessig geblieben statt ausgestanzt zu wirken.
     Gemalte Kronen ueber einer Nachtaufnahme sind ein bewusster Bruch:
     das Alte rahmt das Neue ein. */
  eicheLinks: {
    pfad: '/bilder/eiche-links.webp',
    alt: '',
    nachweis: 'Camille Corot, „Fontainebleau: Oak Trees at Bas-Bréau“, 1832/33',
  },
  eicheRechts: {
    pfad: '/bilder/eiche-rechts.webp',
    alt: '',
    nachweis: 'Camille Corot, „Fontainebleau: Oak Trees at Bas-Bréau“, 1832/33',
  },
} as const satisfies Record<string, Bild>;

/**
 * Bildvorrat der Forderungs-Karten.
 *
 * Die Karten wechseln im Takt durch diesen Vorrat, jede Karte um einen
 * Platz versetzt — dadurch zeigen nie zwei dasselbe Motiv, und die Sektion
 * steht nie still. Aufnahmen der Luminale, des Frankfurter Lichtfestivals:
 * dieselbe Stadt wie im Rest der Seite, nur in Neon.
 */
export const FORDERUNGS_BILDER: readonly Bild[] = [
  {
    pfad: '/bilder/ford-1.jpg',
    alt: 'Der Frankfurter Hauptbahnhof, in farbiges Licht getaucht',
    nachweis: 'Norbert Nagel, „Hauptbahnhof Frankfurt, Luminale 2014“ (CC BY-SA 3.0)',
  },
  {
    pfad: '/bilder/ford-2.jpg',
    alt: 'Lichtkunst-Installation der Luminale an einer Fassade',
    nachweis: 'Thomas Wolf, „Luminale 2012 – Resonate“ (CC BY-SA 3.0)',
  },
  {
    pfad: '/bilder/ford-3.jpg',
    alt: 'Der Rententurm in farbigem Licht während der Luminale',
    nachweis: 'Thomas Wolf, „Luminale 2012 – Rententurm“ (CC BY-SA 3.0)',
  },
  {
    pfad: '/bilder/ford-4.jpg',
    alt: 'Die Bahnsteighalle des Frankfurter Hauptbahnhofs in farbigem Licht',
    nachweis: 'Norbert Nagel, „Hauptbahnhof Frankfurt, Luminale 2014“ (CC BY-SA 3.0)',
  },
  {
    pfad: '/bilder/ford-5.jpg',
    alt: 'Die Frankfurter Skyline bei Nacht',
    nachweis: 'Marvin Reuter, „Frankfurt Skyline bei Nacht“ (CC BY-SA 4.0)',
  },
  {
    pfad: '/bilder/ford-6.jpg',
    alt: 'Der Main und die beleuchtete Skyline bei Nacht',
    nachweis: 'StapelChips, „Frankfurt Main and Skyline at night“ (CC BY-SA 4.0)',
  },
];

/* ---------------------------------------------------------------------------
 * Kennzahlen
 * ------------------------------------------------------------------------- */

export const KENNZAHLEN = {
  fortzuege: {
    wert: '270.000',
    label: 'Fortzüge deutscher Staatsbürger',
    kurzLabel: 'Fortzüge',
    quelle: 'Statistisches Bundesamt, Wanderungsstatistik',
    jahr: 'PLATZHALTER',
    geprueft: false,
  },
  abgabenlast: {
    wert: '47,9 %',
    label: 'Abgabenlast auf ein Durchschnittseinkommen',
    kurzLabel: 'Abgabenlast',
    quelle: 'OECD, Taxing Wages (Tax Wedge, Single 100 % AW)',
    jahr: 'PLATZHALTER',
    geprueft: false,
  },
  qualifikation: {
    wert: '3 von 4',
    label: 'Auswanderern haben einen Berufs- oder Hochschulabschluss',
    kurzLabel: 'Qualifiziert',
    quelle: 'OECD / IAB',
    jahr: 'PLATZHALTER',
    geprueft: false,
  },
  investitionen: {
    wert: 'PLATZHALTER',
    label: 'Netto-Direktinvestitionen ins Ausland',
    kurzLabel: 'Investitionen',
    quelle: 'Deutsche Bundesbank, Zahlungsbilanzstatistik',
    jahr: 'PLATZHALTER',
    geprueft: false,
  },
} as const satisfies Record<string, Kennzahl>;

/** Meldet in der Entwicklung, wie viele Kennzahlen noch ungeprueft sind. */
export const ZAHLEN_GEPRUEFT = Object.values(KENNZAHLEN).every((k) => k.geprueft);

/* ---------------------------------------------------------------------------
 * Marke und Navigation
 * ------------------------------------------------------------------------- */

export const MARKE = {
  /** Kampagnentitel. Der Punkt macht daraus eine Feststellung. */
  name: 'Deutschland flieht.',
  /** Wird als monumentale Wortmarke im Hero gesetzt. */
  wortmarke: 'Deutschland',
  wortmarkeVerb: 'flieht.',
  monogramm: 'D',
  navLink: { label: 'Petition', pfad: '/petition' },
} as const;

/* ---------------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------------- */

export const HERO = {
  /** Zweizeilige Serif-Headline; die zweite Zeile wird kursiv gesetzt. */
  zeile1: 'DER ZENIT',
  zeile2Kursiv: 'ist überschritten',
  /** Zwei Kennzahlen nebeneinander, wie das Stat-Pair der Vorlage. */
  stats: [KENNZAHLEN.fortzuege, KENNZAHLEN.abgabenlast],
  /* Bewusst keine Schaltflaeche: der Hero behauptet nur. Der Weg zur
     Petition beginnt nach dem Kurz-Check und im Abschluss. */
  /** Aufnahme, aus der die Wortmarke aufsteigt. */
  bild: BILDER.hero,
  /** Eichenkronen, die den Hero oben links und rechts rahmen. */
  eicheLinks: BILDER.eicheLinks,
  eicheRechts: BILDER.eicheRechts,
} as const;

/* ---------------------------------------------------------------------------
 * Gepinnte Scroll-Sequenz
 * ------------------------------------------------------------------------- */

export const SEQUENZ: readonly SequenzSchritt[] = [
  {
    id: 'wer-geht',
    ueberschrift: 'Wer geht, ist jung und gut ausgebildet',
    text:
      'Auswanderung trifft Deutschland nicht in der Breite, sondern an der Spitze. ' +
      'Es gehen überdurchschnittlich viele Menschen mit Berufs- und Hochschulabschluss, ' +
      'in der Mitte ihres Erwerbslebens — also genau die Jahrgänge, die ein Land trägt.',
    bild: BILDER.sequenz1,
  },
  {
    id: 'wer-bleibt',
    ueberschrift: 'Wer bleibt, zahlt mehr',
    text:
      'Jeder Fortzug verteilt die gleiche Last auf weniger Schultern. Steuern und ' +
      'Sozialabgaben zusammen nehmen auf ein durchschnittliches Einkommen fast die ' +
      'Hälfte. Das ist kein Naturgesetz, sondern eine politische Entscheidung.',
    bild: BILDER.sequenz2,
  },
  {
    id: 'unternehmen',
    ueberschrift: 'Und die Unternehmen gehen mit',
    text:
      'Nicht als Umzug, sondern als Entscheidung: Die nächste Fabrik, das nächste Labor, ' +
      'die nächste Stelle entsteht woanders. Das fällt nicht auf, solange die alten ' +
      'noch laufen. Es fällt auf, wenn sie es nicht mehr tun.',
    bild: BILDER.sequenz3,
  },
];

/* ---------------------------------------------------------------------------
 * Manifest — dunkle Display-Headline
 * ------------------------------------------------------------------------- */

export const MANIFEST = {
  zeile1: 'STILLE',
  zeile2Kursiv: 'Abwanderung',
  zeile3: 'EINES LANDES',
  unterzeile:
    'Kein Knall, kein Datum, keine Schlagzeile. Eine Bewegung, die man erst bemerkt, wenn sie nicht mehr umkehrbar ist.',
} as const;

/* ---------------------------------------------------------------------------
 * Fahnen-Sektion (3D)
 * ------------------------------------------------------------------------- */

export const FAHNE = {
  /** Wird als grosse Serif-Lettern vertikal gestapelt hinter der Fahne gesetzt. */
  gestapelt: 'FLUCHT',
  titel: 'Eine Fahne,\ndie verschleißt',
  text:
    'Der Stoff ist derselbe. Was sich ändert, ist der Zustand. Je weiter du scrollst, ' +
    'desto mehr Löcher. Genau so verläuft der Vorgang, um den es hier geht: nicht ' +
    'plötzlich, sondern Faden für Faden.',
  /** Barrierefreie Beschreibung der 3D-Szene. */
  ariaBeschreibung:
    'Dreidimensionale Deutschlandfahne, die sich im Wind bewegt und im Verlauf des ' +
    'Scrollens zunehmend verschmutzt und durchlöchert erscheint.',
} as const;

/* ---------------------------------------------------------------------------
 * Zahlen — Drei-Spalten-Raster mit kreisrunden Ausschnitten
 * ------------------------------------------------------------------------- */

export const ZAHLEN_SEKTION = {
  labelLinks: 'DIE LAGE',
  labelRechts: 'IN ZAHLEN',
  titelZeile1: 'WAS DIE ZAHLEN',
  titelZeile2: 'ZEIGEN',
} as const;

export const VIGNETTEN: readonly Vignette[] = [
  {
    id: 'fortzuege',
    titel: 'Sie gehen',
    kennzahl: KENNZAHLEN.fortzuege,
    bild: BILDER.kreis2,
  },
  {
    id: 'abgaben',
    titel: 'Es wird teurer',
    kennzahl: KENNZAHLEN.abgabenlast,
    bild: BILDER.kreis3,
  },
  {
    id: 'qualifikation',
    titel: 'Es trifft die Mitte',
    kennzahl: KENNZAHLEN.qualifikation,
    bild: BILDER.kreis1,
  },
];

/* ---------------------------------------------------------------------------
 * Forderungen
 *
 * Bewusst anschlussfaehig formuliert: die Kampagne soll von unpolitischen
 * Unzufriedenen bis ins liberale Vorfeld tragen. Deshalb keine Maximal-
 * forderungen, sondern Richtungsentscheidungen, hinter denen sich mehrere
 * Lager versammeln koennen.
 *
 * Offen und daher noch nicht aufgenommen (aus dem Konzept, mit Fragezeichen):
 *   - Spekulationsfrist abschaffen
 * Bei Bedarf hier als vierte Forderung ergaenzen.
 * ------------------------------------------------------------------------- */

export const FORDERUNGEN_SEKTION = {
  label: 'FORDERUNGEN',
  titelZeile1: 'WAS SICH ÄNDERN',
  titelZeile2Kursiv: 'muss',
  einleitung:
    'Sechs Richtungsentscheidungen. Keine Maximalforderungen, keine Parteiprogramme — ' +
    'sondern das, worauf sich jeder einigen kann, der möchte, dass Bleiben wieder die ' +
    'naheliegendere Entscheidung ist als Gehen.',
} as const;

export const FORDERUNGEN: readonly Forderung[] = [
  {
    id: 'entlasten',
    titel: 'Entlasten',
    text:
      'Steuern und Abgaben auf Arbeit spürbar senken. Wer arbeitet, muss am Monatsende ' +
      'mehr behalten als heute — das ist die einfachste Antwort auf die Frage, warum ' +
      'jemand bleiben sollte.',
  },
  {
    id: 'bauen',
    titel: 'Bauen',
    text:
      'Bauvorschriften radikal zusammenstreichen. Wohnraum entsteht nicht durch ' +
      'Förderprogramme, sondern dadurch, dass Bauen wieder erlaubt und bezahlbar ist.',
  },
  {
    id: 'vorsorgen',
    titel: 'Vorsorgen',
    text:
      'Die Altersvorsorge schrittweise vom Umlageverfahren lösen und kapitalgedeckt ' +
      'aufbauen — ohne bestehende Ansprüche zu brechen. Wer jung ist, muss wissen, ' +
      'wofür er einzahlt.',
  },
  {
    id: 'entfesseln',
    titel: 'Entfesseln',
    text:
      'Berichts-, Nachweis- und Dokumentationspflichten zusammenstreichen. Für jede ' +
      'neue Vorschrift müssen zwei alte fallen. Wer gründet, soll arbeiten dürfen ' +
      'statt Formulare auszufüllen.',
  },
  {
    id: 'beschleunigen',
    titel: 'Beschleunigen',
    text:
      'Genehmigungen mit verbindlichen Fristen versehen: Wer als Behörde nicht ' +
      'fristgerecht entscheidet, hat zugestimmt. Verwaltung muss vollständig digital ' +
      'laufen — ohne Papier, ohne Termin, ohne Amtsstube.',
  },
  {
    id: 'zurueckholen',
    titel: 'Zurückholen',
    text:
      'Rückkehr darf nicht bestraft werden. Ausländische Abschlüsse und ' +
      'Versicherungszeiten müssen unbürokratisch anerkannt werden. Wer geht, soll ' +
      'wiederkommen können, ohne von vorn anzufangen.',
  },
];

/* ---------------------------------------------------------------------------
 * Unterstuetzer
 *
 * ACHTUNG: Hier stehen ausschliesslich Platzhalter.
 * Es duerfen erst dann echte Namen, Logos oder Zitate erscheinen, wenn eine
 * Zusage vorliegt. Namen ohne Zusage anzuzeigen waere der schnellste Weg,
 * die Kampagne zu beschaedigen — und rechtlich angreifbar.
 * ------------------------------------------------------------------------- */

export const UNTERSTUETZER = {
  label: 'UNTERSTÜTZT VON',
  /*
   * TODO vor Veroeffentlichung: `name` durch die tatsaechlichen
   * Organisationsnamen ersetzen. Der Name ist der Alternativtext des Logos —
   * ohne ihn ist die Reihe fuer Screenreader wertlos.
   */
  logos: [
    { name: 'Unterstützer (Name eintragen)', pfad: '/bilder/unterstuetzer-1.webp' },
    { name: 'Unterstützer (Name eintragen)', pfad: '/bilder/unterstuetzer-2.webp' },
  ],
  /** Freie Plaetze. Erst nach schriftlicher Zusage befuellen. */
  freieSlots: 4,
  hinweis: 'Weitere Logos erst nach schriftlicher Zusage einsetzen.',
} as const;

/* ---------------------------------------------------------------------------
 * Abschluss
 * ------------------------------------------------------------------------- */

export const ABSCHLUSS = {
  zeile1Kursiv: 'Bleiben',
  zeile1Rest: 'MUSS SICH',
  zeile2: 'WIEDER LOHNEN',
  text:
    'Diese Seite ist ein Mahnmal, kein Abgesang. Die Entwicklung lässt sich drehen — ' +
    'aber nur, wenn genug Menschen sichtbar machen, dass sie sie sehen.',
  cta: { label: 'Petition unterschreiben', pfad: '/petition' },
} as const;

/* ---------------------------------------------------------------------------
 * Footer
 * ------------------------------------------------------------------------- */

export const FOOTER = {
  claim: 'Ein digitales Mahnmal zur Abwanderung aus Deutschland.',
  /* Impressum und Datenschutz sind bei einer Kampagne mit Unterschriften-
     sammlung Pflicht, nicht Kür. Die Seiten müssen vor dem Livegang stehen. */
  links: [
    { label: 'Petition', pfad: '/petition' },
    { label: 'Impressum', pfad: '/impressum' },
    { label: 'Datenschutz', pfad: '/datenschutz' },
  ],
  quellenHinweis:
    'Alle Kennzahlen dieser Seite sind Platzhalter und vor Veröffentlichung zu belegen.',
  /* CC BY und CC BY-SA verlangen die Nennung von Urheber und Lizenz. Das
     ist keine Hoeflichkeit, sondern Bedingung der Nutzung — deshalb steht
     jeder Nachweis einzeln da und nicht als Sammelfloskel. */
  bildnachweisLabel: 'Bildnachweis',
  bildnachweisEinleitung:
    'Nachtaufnahmen von Frankfurt am Main und der Luminale, über Wikimedia Commons ' +
    'unter freien Lizenzen. Die gemalten Eichenkronen im Kopf der Seite stammen aus ' +
    'dem Open-Access-Bestand des Metropolitan Museum of Art.',
  bildnachweisListe: [
    {
      werk: 'Frankfurt am Main city center from other side of the Main at night (2020)',
      urheber: 'Leonhard Lenz',
      lizenz: 'CC0',
    },
    { werk: 'Skyline Frankfurt am Main bei Nacht', urheber: 'Ghorog', lizenz: 'CC BY-SA 4.0' },
    {
      werk: 'Frankfurt skyline reflected at night',
      urheber: 'Gerda Arendt',
      lizenz: 'CC BY-SA 4.0',
    },
    {
      werk: 'Frankfurt Skyline bei Nacht (2022)',
      urheber: 'Jörg Braukmann',
      lizenz: 'CC BY-SA 4.0',
    },
    {
      werk: 'Ignatz-Bubis-Brücke Frankfurt am Main bei Nacht',
      urheber: 'rupp.de',
      lizenz: 'CC BY-SA 3.0',
    },
    {
      werk: 'Hauptbahnhof Frankfurt und Börse Frankfurt, Luminale 2014',
      urheber: 'Norbert Nagel',
      lizenz: 'CC BY-SA 3.0',
    },
    {
      werk: 'Luminale 2012 – Resonate und Rententurm',
      urheber: 'Thomas Wolf',
      lizenz: 'CC BY-SA 3.0',
    },
    { werk: 'Frankfurt Skyline bei Nacht', urheber: 'Marvin Reuter', lizenz: 'CC BY-SA 4.0' },
    {
      werk: 'Frankfurt Main and Skyline at night',
      urheber: 'StapelChips',
      lizenz: 'CC BY-SA 4.0',
    },
    {
      werk: 'Fontainebleau: Oak Trees at Bas-Bréau (1832/33)',
      urheber: 'Camille Corot, The Metropolitan Museum of Art',
      lizenz: 'CC0',
    },
  ] as readonly Bildnachweis[],
  /* TODO vor Veroeffentlichung: je Bild den Link auf die Commons-Dateiseite
     ergaenzen. Bei CC BY-SA gehoert der Verweis auf Lizenz und Quelle dazu. */
} as const;

/* ---------------------------------------------------------------------------
 * Petitionsseite
 * ------------------------------------------------------------------------- */

export const PETITION = {
  titelZeile1: 'JETZT',
  titelZeile2Kursiv: 'unterschreiben',
  einleitung:
    'Deine Unterschrift macht aus einer Beobachtung eine Zahl, die man nicht mehr ' +
    'ignorieren kann. Jeder Fortzug ist für sich genommen eine Privatentscheidung — ' +
    'in der Summe sind es Hunderttausende, und niemand muss darauf antworten, ' +
    'solange niemand sie zählt. Genau das ändert diese Liste.',

  /** Adressat der Übergabe. Steht ganz oben, weil es die erste Rückfrage ist. */
  empfaenger: {
    label: 'ADRESSAT',
    text:
      'Deutscher Bundestag — Petitionsausschuss, sowie die Fraktionsvorsitzenden ' +
      'aller im Bundestag vertretenen Fraktionen.',
  },

  /* Der eigentliche Petitionstext. Das ist der Teil, den Unterzeichnende
     rechtlich und politisch mittragen — er muss ohne die restliche Seite
     verständlich sein und wird bei der Übergabe wörtlich vorgelegt. */
  petitionstext: {
    label: 'PETITIONSTEXT',
    absaetze: [
      'Deutschland verliert Jahr für Jahr Menschen, die es dringend braucht: gut ' +
        'ausgebildet, mitten im Erwerbsleben, oft mit Familie. Sie gehen nicht aus ' +
        'Abenteuerlust, sondern weil sich Arbeit, Aufstieg und Vorsorge anderswo ' +
        'sichtbarer lohnen. Wer bleibt, trägt die gleiche Last auf weniger Schultern.',
      'Die Unterzeichnenden fordern den Deutschen Bundestag auf, die Abwanderung ' +
        'qualifizierter Menschen als das zu behandeln, was sie ist: ein Frühindikator ' +
        'für die Wettbewerbs- und Zukunftsfähigkeit des Landes — und nicht als ' +
        'Randnotiz der Wanderungsstatistik.',
      'Konkret fordern wir eine spürbare Entlastung der Arbeitseinkommen, eine ' +
        'radikale Vereinfachung des Bau- und Genehmigungsrechts sowie den Einstieg ' +
        'in eine kapitalgedeckte Altersvorsorge, ohne bestehende Ansprüche zu brechen. ' +
        'Weiter fordern wir, dass die Bundesregierung dem Bundestag jährlich über ' +
        'Zahl, Qualifikation und Motive der Fortziehenden berichtet.',
      'Wir wollen kein anderes Land. Wir wollen, dass Bleiben sich wieder lohnt.',
    ],
  },

  /** Die drei Forderungen erscheinen auf der Petitionsseite noch einmal. */
  forderungenLabel: 'WOFÜR SIE UNTERSCHREIBEN',

  /* Was mit der Unterschrift geschieht. Ohne diese Auskunft ist ein
     Unterschriftenformular eine Blackbox — und wird entsprechend selten
     ausgefuellt. */
  ablauf: {
    label: 'WAS DANACH PASSIERT',
    schritte: [
      {
        titel: 'Bestätigung per E-Mail',
        text:
          'Du bekommst eine E-Mail mit einem Bestätigungslink. Erst mit dem Klick ' +
          'zählt deine Unterschrift. Ohne diesen Schritt wäre die Liste wertlos, weil ' +
          'jeder jeden eintragen könnte.',
      },
      {
        titel: 'Zählen, nicht weitergeben',
        text:
          'Deine Daten dienen ausschließlich der Petition. Sie werden nicht verkauft, ' +
          'nicht für Werbung genutzt und nicht an Parteien weitergegeben.',
      },
      {
        titel: 'Übergabe',
        text:
          'Nach Abschluss der Sammlung werden Anzahl, Postleitzahlengebiete und — ' +
          'nur bei ausdrücklicher Freigabe — Namen und Begründungen übergeben.',
      },
      {
        titel: 'Löschung',
        text:
          'Spätestens sechs Monate nach der Übergabe werden die personenbezogenen ' +
          'Daten gelöscht. Nicht bestätigte Eintragungen werden nach 14 Tagen gelöscht.',
      },
    ],
  },

  formular: {
    titel: 'Deine Unterschrift',
    untertitel: 'Zwei Minuten. Mit * markierte Felder sind Pflicht.',
    abschnittPerson: 'ZUR PERSON',
    abschnittMotiv: 'IHR MOTIV (FREIWILLIG)',
    abschnittEinwilligung: 'EINWILLIGUNG',

    vorname: 'Vorname',
    nachname: 'Nachname',
    email: 'E-Mail-Adresse',
    emailHinweis: 'Für die Bestätigung. Wird nicht veröffentlicht.',
    plz: 'Postleitzahl',
    plzHinweis: 'Zeigt, aus welchen Regionen die Stimmen kommen.',

    grundLabel: 'Was gibt bei dir den Ausschlag?',
    grundHinweis: 'Mehrfachauswahl möglich.',
    grundAusQuiz:
      'Aus deinem Kurz-Check übernommen — übertragen wurde davon noch nichts. ' +
      'Du kannst die Auswahl hier ändern.',

    geschichte: 'Deine Begründung in eigenen Worten',
    geschichteHinweis:
      'Ein Satz genügt. Die stärksten Argumente in der Übergabe sind keine Zahlen, ' +
      'sondern Sätze von Menschen.',
    geschichtePlatzhalter:
      'Ich denke darüber nach zu gehen, weil …',

    einwilligung:
      'Ich bin damit einverstanden, dass meine Angaben zum Zweck dieser Petition ' +
      'verarbeitet und an die genannten Adressaten übergeben werden. Die Einwilligung ' +
      'kann ich jederzeit formlos widerrufen.',
    oeffentlich:
      'Mein Name und meine Begründung dürfen bei der Übergabe öffentlich genannt werden.',
    updates:
      'Sag mir Bescheid, wenn die Petition übergeben wird. Höchstens fünf E-Mails, ' +
      'Abmeldung mit einem Klick.',

    absenden: 'Unterschreiben',
    datenschutzHinweis:
      'Angaben zur Verarbeitung stehen in der Datenschutzerklärung. Es werden keine ' +
      'Tracker, keine Analyse-Dienste und keine externen Schriften geladen.',
  },

  /** Sammelmeldung über dem Formular, wenn das Absenden fehlschlägt. */
  fehlerUeberschrift: 'Bitte prüf noch diese Angaben:',

  /* Der Zaehler ist eine reine Anzeige ohne Backend. Er darf niemals eine
     erfundene Zahl zeigen — bis der Server steht, bleibt er auf null. */
  zaehlerLabel: 'Unterschriften',
  zaehlerZusatz: 'Der Zähler steht auf null, weil noch nichts gezählt wird.',
  zaehlerStart: 0,

  quittung: {
    titel: 'Nichts wurde gesendet.',
    text:
      'Deine Eingaben waren vollständig — sie wurden aber weder gespeichert noch ' +
      'verschickt. Diese Seite läuft im Demo-Modus.',
    fehltTitel: 'Bis zum Echtbetrieb fehlen',
    fehlt: [
      'ein Endpunkt, der Unterschriften entgegennimmt und speichert',
      'Double-Opt-In per E-Mail, sonst ist die Liste angreifbar',
      'Schutz gegen automatisierte Eintragungen',
      'Impressum und Datenschutzerklärung mit den echten Angaben',
    ],
    zurueck: 'Eingaben erneut ansehen',
  },

  hinweisOhneBackend:
    'Demo-Modus: Es wird nichts gespeichert und nichts versendet. Für den Echtbetrieb ' +
    'fehlen Backend, Double-Opt-In, Impressum und Datenschutzerklärung.',
} as const;

/* ---------------------------------------------------------------------------
 * Kurz-Check (Quiz)
 *
 * Vier Fragen, keine Anmeldung, keine Uebertragung. Der Check hat zwei
 * Aufgaben: er macht aus passivem Lesen eine eigene Aussage, und er liefert
 * der Petitionsseite bereits die Motive, damit dort weniger zu tippen ist.
 *
 * Die Antworten bleiben ausschliesslich im Arbeitsspeicher des Browsers.
 * Kein localStorage, kein Netzwerkaufruf — sonst waere die Zusage
 * "keine Anmeldung, nichts wird gespeichert" nicht wahr.
 * ------------------------------------------------------------------------- */

export const QUIZ = {
  label: 'KURZ-CHECK',
  titelZeile1: 'GEHÖRST DU',
  titelZeile2Kursiv: 'dazu?',
  einleitung:
    'Vier Fragen, etwa dreißig Sekunden. Keine Anmeldung, keine E-Mail, kein Konto. ' +
    'Die Antworten bleiben in deinem Browser und werden nirgendwohin übertragen.',
  starten: 'Check starten',
  weiter: 'Weiter',
  zurueck: 'Zurück',
  auswerten: 'Auswertung ansehen',
  neu: 'Antworten zurücksetzen',
  fortschritt: 'Frage',
  von: 'von',
  ergebnisLabel: 'IHRE AUSWERTUNG',
  ergebnisAlterLabel: 'Alter',
  ergebnisMotivLabel: 'Motive',
  ergebnisOhneMotiv: 'keine Angabe',
  cta: { label: 'Petition unterschreiben', pfad: '/petition' },
  datenschutz:
    'Diese Auswertung entsteht in deinem Browser. Es wurde nichts gespeichert und ' +
    'nichts gesendet.',
} as const;

export const QUIZ_FRAGEN: readonly QuizFrage[] = [
  {
    id: 'gedanke',
    frage: 'Denkst du darüber nach, Deutschland zu verlassen?',
    hinweis: 'Ehrlich, nicht diplomatisch — die Antwort sieht niemand außer dir.',
    mehrfach: false,
    optionen: [
      { id: 'ja-konkret', label: 'Ja, und ich arbeite bereits daran', kurz: 'arbeitet daran' },
      { id: 'ja-oft', label: 'Ja, immer wieder', kurz: 'denkt darüber nach' },
      { id: 'nein-verstehe', label: 'Nein — aber ich verstehe jeden, der geht', kurz: 'bleibt, versteht es aber' },
      { id: 'nein', label: 'Nein, für mich kommt das nicht infrage', kurz: 'bleibt' },
    ],
  },
  {
    id: 'stand',
    frage: 'Wie weit ist die Sache?',
    hinweis: 'Zwischen „mal gegoogelt“ und „Vertrag unterschrieben“ liegen Welten.',
    mehrfach: false,
    optionen: [
      { id: 'nur-gedanke', label: 'Ein Gedanke, mehr nicht', kurz: 'Gedanke' },
      { id: 'informiere', label: 'Ich informiere mich: Länder, Steuern, Papiere', kurz: 'in der Recherche' },
      { id: 'plane', label: 'Ich plane konkret — Job, Visum oder Termin steht', kurz: 'konkrete Planung' },
      { id: 'weg', label: 'Ich lebe bereits im Ausland', kurz: 'bereits ausgewandert' },
    ],
  },
  {
    id: 'alter',
    frage: 'Wie alt bist du?',
    hinweis:
      'Wichtig, weil Abwanderung kein Querschnitt ist: Sie trifft die Jahrgänge, ' +
      'die noch vier Jahrzehnte einzahlen würden.',
    mehrfach: false,
    optionen: [
      { id: 'u30', label: 'Unter 30', kurz: 'unter 30' },
      { id: '30-49', label: '30 bis 49', kurz: '30 bis 49' },
      { id: 'ab50', label: '50 oder älter', kurz: '50 oder älter' },
    ],
  },
  {
    id: 'grund',
    frage: 'Was gibt den Ausschlag?',
    hinweis: 'Mehrfachauswahl möglich.',
    mehrfach: true,
    optionen: [
      { id: 'steuern', label: 'Steuern und Abgaben', kurz: 'Steuern und Abgaben' },
      { id: 'buerokratie', label: 'Bürokratie und Vorschriften', kurz: 'Bürokratie' },
      { id: 'migration', label: 'Migration und innere Sicherheit', kurz: 'Migration und Sicherheit' },
      { id: 'lebenseinstellung', label: 'Lebenseinstellung und persönliche Freiheit', kurz: 'Lebenseinstellung' },
      { id: 'chancen', label: 'Beruf, Löhne, berufliche Chancen', kurz: 'berufliche Chancen' },
      { id: 'wohnen', label: 'Wohnen und Lebenshaltungskosten', kurz: 'Wohnkosten' },
    ],
  },
];

/**
 * Auswertungstexte.
 *
 * Vier Profile, abgeleitet aus den ersten beiden Fragen. Die Texte werten
 * niemanden ab: wer bleibt, ist genauso Adressat der Kampagne wie der, der
 * schon Kisten packt.
 */
export const QUIZ_ERGEBNISSE = {
  entschlossen: {
    titel: 'Du bist längst unterwegs.',
    text:
      'Wer Papiere sortiert oder schon weg ist, hat die Rechnung für sich fertig ' +
      'gemacht. Genau diese Rechnung taucht in keiner Statistik auf — nur das ' +
      'Ergebnis. Wenn du unterschreibst, wird aus deinem Fortgang ein Argument ' +
      'statt einer Randnotiz.',
  },
  erwaegend: {
    titel: 'Du rechnest. Und damit bist du nicht allein.',
    text:
      'Der Gedanke kommt selten aus dem Nichts. Er kommt am Monatsende, beim ' +
      'Steuerbescheid, im Amt, bei der Wohnungssuche. Solange dieser Gedanke ' +
      'privat bleibt, ändert er nichts — sichtbar gemacht, wird er zur Zahl.',
  },
  verstaendnis: {
    titel: 'Du bleibst — und siehst trotzdem, was passiert.',
    text:
      'Man muss nicht selbst gehen wollen, um zu merken, dass zu viele gehen. ' +
      'Wer bleibt, trägt die Folgen unmittelbar: die gleiche Last auf weniger ' +
      'Schultern. Deine Unterschrift zählt genauso.',
  },
  bleibend: {
    titel: 'Du bleibst. Sorg dafür, dass sich das lohnt.',
    text:
      'Diese Seite ist kein Aufruf zum Gehen — im Gegenteil. Sie ist der Versuch, ' +
      'die Bedingungen so zu ändern, dass Bleiben die naheliegendere Entscheidung ' +
      'bleibt. Dafür braucht es genau deine Stimme.',
  },
} as const;

/** Zusatzzeile, wenn die Person unter 30 ist — die politisch relevanteste Gruppe. */
export const QUIZ_HINWEIS_JUNG =
  'Unter 30: Du gehörst zu der Gruppe, deren Fortzug am schwersten wiegt. Wer mit ' +
  'Mitte zwanzig geht, fehlt vier Jahrzehnte lang.';

/* ---------------------------------------------------------------------------
 * Rechtstexte
 *
 * ACHTUNG — beide Texte sind Geruest, nicht fertige Rechtstexte.
 * Alles in eckigen Klammern muss vor dem Livegang durch die tatsaechlichen
 * Angaben ersetzt werden; danach gehoert der Text einmal ueber den Tisch
 * einer Person, die dafuer geradesteht. Eine Kampagne, die E-Mail-Adressen
 * sammelt, ohne Impressum und Datenschutzerklaerung, ist abmahnfaehig.
 * ------------------------------------------------------------------------- */

export const RECHTSTEXT_WARNUNG =
  'Entwurf. Alle Angaben in eckigen Klammern sind vor der Veröffentlichung durch ' +
  'die tatsächlichen Daten zu ersetzen und rechtlich zu prüfen.';

export const IMPRESSUM = {
  titel: 'Impressum',
  einleitung: 'Angaben gemäß § 5 DDG und § 18 Abs. 2 MStV.',
  abschnitte: [
    {
      titel: 'Anbieter',
      absaetze: [
        '[Vor- und Nachname bzw. vollständiger Name der Organisation]',
        '[Straße und Hausnummer]\n[Postleitzahl und Ort]\n[Land]',
      ],
    },
    {
      titel: 'Kontakt',
      absaetze: [
        'E-Mail: [kontakt@beispiel.de]\nTelefon: [Telefonnummer]',
        'Eine ladungsfähige Anschrift ist Pflicht. Ein Postfach genügt nicht.',
      ],
    },
    {
      titel: 'Vertretungsberechtigt',
      absaetze: [
        '[Bei Verein, GmbH oder UG: vertretungsberechtigte Person, Registergericht ' +
          'und Registernummer, gegebenenfalls Umsatzsteuer-Identifikationsnummer ' +
          'nach § 27a UStG.]',
      ],
    },
    {
      titel: 'Inhaltlich verantwortlich nach § 18 Abs. 2 MStV',
      absaetze: [
        '[Vor- und Nachname]\n[Straße und Hausnummer]\n[Postleitzahl und Ort]',
        'Diese Angabe ist zwingend, weil die Seite journalistisch-redaktionelle ' +
          'Inhalte verbreitet.',
      ],
    },
    {
      titel: 'Streitbeilegung',
      absaetze: [
        'Zur Teilnahme an einem Streitbeilegungsverfahren vor einer ' +
          'Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht bereit.',
      ],
    },
    {
      titel: 'Bildnachweis',
      absaetze: [
        'Sämtliche Gemälde stammen aus dem Open-Access-Bestand des Metropolitan ' +
          'Museum of Art, New York, und stehen unter CC0 (Public Domain). Eine ' +
          'Namensnennung ist nicht erforderlich, erfolgt hier aber dennoch.',
      ],
    },
  ] as readonly RechtsAbschnitt[],
} as const;

export const DATENSCHUTZ = {
  titel: 'Datenschutz',
  einleitung:
    'Diese Seite lädt keine externen Schriften, keine Karten, keine Videos und ' +
    'setzt keine Analyse- oder Werbe-Cookies. Verarbeitet werden nur die Daten, ' +
    'die für den Betrieb und für die Petition nötig sind.',
  abschnitte: [
    {
      titel: 'Verantwortlicher',
      absaetze: [
        '[Name, Anschrift und E-Mail-Adresse der verantwortlichen Person oder ' +
          'Organisation — identisch mit dem Impressum.]',
        '[Falls benannt: Kontaktdaten der oder des Datenschutzbeauftragten.]',
      ],
    },
    {
      titel: 'Aufruf der Website (Server-Logdateien)',
      absaetze: [
        'Beim Aufruf werden technisch notwendige Daten verarbeitet: gekürzte ' +
          'IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, übertragene ' +
          'Datenmenge, Browsertyp und Betriebssystem.',
        'Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse ' +
          'liegt im sicheren und störungsfreien Betrieb. Die Logdateien werden nach ' +
          '[7] Tagen gelöscht.',
      ],
    },
    {
      titel: 'Petition: welche Daten und wozu',
      absaetze: [
        'Pflichtangaben sind Vorname, Nachname, E-Mail-Adresse und Postleitzahl. ' +
          'Freiwillig sind die Auswahl der Motive und die Begründung in eigenen Worten.',
        'Zweck ist die Sammlung, Prüfung und Übergabe der Unterschriften. ' +
          'Rechtsgrundlage ist deine Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. ' +
          'Ohne diese Angaben kann die Unterschrift nicht gezählt werden.',
        'Namen und Begründungen werden nur dann öffentlich genannt oder übergeben, ' +
          'wenn du das gesondert freigegeben hast. Ohne Freigabe fließen die ' +
          'Angaben ausschließlich anonymisiert in die Gesamtzahl und die ' +
          'Auswertung nach Postleitzahlgebieten ein.',
      ],
    },
    {
      titel: 'Bestätigungsverfahren (Double-Opt-In)',
      absaetze: [
        'Nach dem Absenden bekommst du eine E-Mail mit einem Bestätigungslink. ' +
          'Erst mit der Bestätigung wird die Unterschrift gültig. Gespeichert werden ' +
          'dabei Zeitpunkt und IP-Adresse der Eintragung und der Bestätigung — als ' +
          'Nachweis, dass die Einwilligung tatsächlich von dir stammt.',
        'Nicht bestätigte Eintragungen werden nach [14] Tagen gelöscht.',
      ],
    },
    {
      titel: 'Speicherdauer',
      absaetze: [
        'Die personenbezogenen Daten der Unterzeichnenden werden spätestens ' +
          '[sechs] Monate nach der Übergabe der Petition gelöscht, sofern keine ' +
          'gesetzlichen Aufbewahrungspflichten entgegenstehen.',
      ],
    },
    {
      titel: 'Empfänger und Auftragsverarbeiter',
      absaetze: [
        '[Hosting-Anbieter mit Anschrift; Auftragsverarbeitungsvertrag nach ' +
          'Art. 28 DSGVO liegt vor.]',
        '[E-Mail-Versanddienstleister, falls eingesetzt.]',
        'Eine Weitergabe an Dritte zu Werbezwecken findet nicht statt. Die Daten ' +
          'werden nicht verkauft und nicht an Parteien übermittelt.',
      ],
    },
    {
      titel: 'Der Kurz-Check',
      absaetze: [
        'Die Antworten des Kurz-Checks werden ausschließlich im Arbeitsspeicher ' +
          'deines Browsers gehalten. Sie werden nicht an den Server übertragen, nicht ' +
          'dauerhaft gespeichert und sind nach dem Schließen des Tabs verschwunden. ' +
          'Übernommen wird davon nur, was du im Petitionsformular stehen lässt und ' +
          'selbst absendest.',
      ],
    },
    {
      titel: 'Deine Rechte',
      absaetze: [
        'Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), ' +
          'Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), ' +
          'Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO).',
        'Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft ' +
          'widerrufen — formlos per E-Mail an [kontakt@beispiel.de]. Die ' +
          'Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.',
        'Dir steht ein Beschwerderecht bei einer Aufsichtsbehörde zu, in der Regel ' +
          'am Ort deines Wohnsitzes: [zuständige Landesdatenschutzbehörde].',
      ],
    },
  ] as readonly RechtsAbschnitt[],
} as const;
