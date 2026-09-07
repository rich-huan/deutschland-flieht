# Deutschland flieht.

Onepager-Kampagnenseite, gebaut wie ein politisches Flugblatt.

Die Seite hat **zwei Flächen, nicht eine**: Hero, Stimmen, Manifest und Fuß
liegen in der Nacht — Industriestadt, brennender Horizont, Funkenflug. Die
Kapitel dazwischen liegen auf warmem Zeitungspapier mit schwarzer Schrift. Der
Wechsel gibt der Seite ihren Rhythmus und ist die wichtigste Gestaltungs-
entscheidung des Projekts.

Sie funktioniert über Typografie, Zahlen, Raum und Bewegung — nicht über
Karten, Icons oder Stockfotos.

## Entwicklung

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Typprüfung (tsc) + Produktions-Build
npm run lint     # oxlint
```

Stack: Vite + React 19 + TypeScript (strict). Keine Animations-, Chart- oder
UI-Bibliothek — alle Bewegungen laufen über CSS, `IntersectionObserver` und
drei Canvas-Schleifen (Funken, zweimal Feuer). Die Diagramme sind handgebautes
SVG.

## Aufbau

```
src/
  content/site.ts        Sämtliche Texte und Zahlen an einer Stelle
  components/            Sektionen und wiederverwendbare Bausteine
  effects/               Funkenflug, Feuerhorizont, Stadtsilhouette
  hooks/                 useInView, useCountUp, useDemoCounter,
                         useReducedMotion, useScrollMeter
  lib/                   Zahlformatierung, Validierung, Absende-Anbindung
  styles/                Design-Tokens und globale Grundlagen
```

Ablauf der Seite: Ladeanimation, Hero mit Live-Ticker (Nacht), dann die
Kapitel 01 Warum · 02 Zahlen · 03 Chronik · 04 Wohin (Papier), 05 Stimmen
(Nacht), ein Manifest ohne Nummer als Überleitung (Nacht) und 06 Petition
(Papier).

## Gestaltung

**Schriften** (Google Fonts, in `index.html` geladen)

| Rolle | Schrift |
| --- | --- |
| Headlines | Archivo, Breitenachse auf ~84–92 gestellt |
| Fließtext | Inter |
| Ticker-Ziffern, Diagrammachsen, Quellenvermerke | IBM Plex Mono |

Die Mono steht **nur an echten Daten**. Gesperrte Versal-Mono an jeder
Bildunterschrift und jedem Navigationspunkt ist der Griff, der eine Seite nach
Vorlage aussehen lässt — Beschriftungen, Kolumnentitel und Navigation laufen
deshalb in Inter, in lesbarer Größe.

**Flächen** (`src/styles/tokens.css`) — die Nacht steht als Standard im
`:root`, das Papier in einem Block `[data-surface="paper"]`. Ein Abschnitt
wechselt die Fläche allein durch dieses Attribut; Schrift, Linien, Akzent und
Diagrammfarben ziehen automatisch mit, weil alle Bausteine dieselben Token
lesen.

**Akzent** ist die Glut. Auf der Nacht `#ff8a1f`, auf dem Papier das dunklere
`#b03806` — sonst wäre der Kontrast zu schwach.

**Diagrammfarben** je Fläche geprüft (Helligkeitsband, Chroma,
Farbfehlsichtigkeit, Kontrast): Nacht `#f2600c` / `#3e9bd1`, Papier
`#c4400a` / `#1f6fa0`. Nicht ohne erneute Prüfung ersetzen.

## Platzhalter ersetzen

**Alle Zahlen der Seite sind gekennzeichnete Demo-Werte.** Es liegen keine
geprüften Datenquellen vor, deshalb weist die Seite sie an mehreren Stellen
sichtbar als solche aus („Demo-Daten“, „Platzhalter — Quelle wird ergänzt“).

Zum Ersetzen genügt `src/content/site.ts`:

| Wert | Konstante |
| --- | --- |
| Hero-Ticker | `liveTicker.initialValue` |
| Statistiken | `stats[].value`, `stats[].share`, `stats[].source` |
| Verlaufskurve | `timeline.points`, `timeline.source` |
| Zielländer | `destinations.items`, `destinations.source` |
| Unterstützerzahl | `petition.supporters` |
| Zitate | `voices` (aktuell exemplarische Formulierungen) |

Sobald ein `source`-Feld gesetzt ist, zeigt die jeweilige Sektion die Quelle
statt des Platzhalter-Hinweises an. Der Hinweistext im Footer
(`footer.disclaimer`) sollte dann ebenfalls angepasst werden.

## Petition an ein Backend anbinden

`src/lib/petition.ts` enthält den einzigen Berührungspunkt zum Server:

```ts
const ENDPOINT: string | null = null;
```

Solange `ENDPOINT` leer ist, läuft der Absende-Vorgang im Demo-Modus — es wird
nichts übertragen und nichts gespeichert, und die Bestätigung sagt das auch.
Mit eingetragener URL sendet `submitSignature()` die Unterschrift als JSON per
`POST`. Die Formularkomponente muss dafür nicht geändert werden.

Die Validierung (`validateSignature`) liegt in derselben Datei und ist
unabhängig von React testbar.

## Bewegung und Barrierefreiheit

- `prefers-reduced-motion: reduce` schaltet Ladeanimation, Funkenflug, Feuer
  und Maus-Glow vollständig ab, blendet Inhalte ohne Übergang ein und
  zeigt alle Gründe gleich präsent. Horizontlicht und Silhouette bleiben ruhig
  stehen.
- `prefers-contrast: more` hebt die Abdunklung der nicht fokussierten Einträge
  auf.
- Die Canvas-Simulationen pausieren in Hintergrund-Tabs und außerhalb des
  Sichtfelds; auf Touch-Geräten entfallen Maus-Glow und Zeigerfunken.
- Der Funkenflug blendet über den Papier-Kapiteln aus — Glut auf hellem Grund
  läge dort nur als Schmutz.
- Beide Diagramme haben eine Tabellen-Alternative für Screenreader, direkte
  Beschriftungen statt Zahlen an jedem Punkt und eine Hover-Ebene mit Tooltip.
- Mobiles Menü mit Fokusfalle, Escape zum Schließen und Rückgabe des Fokus.
- Sichtbare Fokus-Zustände, beschriftete Formularfelder, Sprunglink zum Inhalt.

## Leistung

Gemessen bei voller Partikelzahl mit bewegter Maus: 60 fps. Der Lesefortschritt
im Kopf wird direkt als Transform geschrieben und löst kein React-Rendern aus.
