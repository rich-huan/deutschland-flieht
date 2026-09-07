import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Abschluss } from '../../sections/abschluss/abschluss';
import { Fahne } from '../../sections/fahne/fahne';
import { Forderungen } from '../../sections/forderungen/forderungen';
import { Hero } from '../../sections/hero/hero';
import { Manifest } from '../../sections/manifest/manifest';
import { Quiz } from '../../sections/quiz/quiz';
import { Sequenz } from '../../sections/sequenz/sequenz';
import { Unterstuetzer } from '../../sections/unterstuetzer/unterstuetzer';
import { Zahlen } from '../../sections/zahlen/zahlen';

/**
 * Startseite — das eigentliche Mahnmal.
 *
 * Der Rhythmus folgt der Vorlage: hell, dann ein langer dunkler Block, dann
 * wieder hell. Die Schnitte sind hart, ohne Verlauf dazwischen.
 *
 *   Hero (Putty)      Behauptung und Wortmarke
 *   Sequenz (Ink)     drei Schritte, gepinnt
 *   Manifest (Ink)    Display-Headline
 *   Fahne (Ink)       3D-Fahne, sauber bis zerschlissen
 *   Unterstuetzer     Platzhalter
 *   Zahlen (Ink)      Kennzahlen mit Beleg
 *   Forderungen (Ink) was zu tun ist
 *   Quiz (Putty)      Kurz-Check — die erste Stelle, an der man selbst etwas tut
 *   Abschluss (Chalk) Aufruf
 *
 * Der Kurz-Check steht bewusst am Ende des dunklen Blocks: davor liest man
 * nur, danach fragt die Seite zurueck — und uebergibt direkt an die Petition.
 */
@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Hero,
    Sequenz,
    Manifest,
    Fahne,
    Unterstuetzer,
    Zahlen,
    Forderungen,
    Quiz,
    Abschluss,
  ],
  template: `
    <app-hero />
    <app-sequenz />
    <app-manifest />
    <app-fahne />
    <app-unterstuetzer />
    <app-zahlen />
    <app-forderungen />
    <app-quiz />
    <app-abschluss />
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Landing {}
