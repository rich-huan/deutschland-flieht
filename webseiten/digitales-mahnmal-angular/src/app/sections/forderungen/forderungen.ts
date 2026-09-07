import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

import {
  FORDERUNGEN,
  FORDERUNGEN_SEKTION,
  FORDERUNGS_BILDER,
} from '../../core/content';
import { Reveal } from '../../shared/reveal';

/**
 * Forderungs-Karten.
 *
 * Jede Karte traegt eine Nachtaufnahme, und die Aufnahmen wandern: alle
 * paar Sekunden rueckt der Vorrat um einen Platz weiter, jede Karte um
 * einen Platz versetzt. Dadurch zeigen nie zwei Karten dasselbe Motiv, und
 * die Sektion steht nie still — sie ist der lauteste Moment der Seite, weil
 * hier steht, was zu tun ist.
 *
 * Alle Bilder liegen dauerhaft im DOM und werden nur in der Deckkraft
 * gewechselt. Ein Wechsel der `src` waere leichter, wuerde aber beim ersten
 * Durchlauf blinken, solange die Datei noch nicht im Cache liegt.
 */
@Component({
  selector: 'app-forderungen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  templateUrl: './forderungen.html',
  styleUrl: './forderungen.scss',
})
export class Forderungen {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sektion = FORDERUNGEN_SEKTION;
  protected readonly forderungen = FORDERUNGEN;
  protected readonly bilder = FORDERUNGS_BILDER;

  /** Wie oft der Vorrat weitergerueckt ist. */
  protected readonly takt = signal(0);

  constructor() {
    afterNextRender(() => {
      /* Ohne Bewegungswunsch bleibt jede Karte bei ihrem ersten Bild. Eine
         Sektion, die von selbst blinkt, ist genau das, was hinter
         prefers-reduced-motion abgestellt gehoert. */
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const uhr = window.setInterval(() => this.takt.update((t) => t + 1), 5200);
      this.destroyRef.onDestroy(() => clearInterval(uhr));
    });
  }

  /**
   * Welches Bild des Vorrats liegt gerade auf Karte `karte` oben?
   * Der Versatz um den Kartenindex sorgt dafuer, dass zwei Karten nie
   * dasselbe Motiv zeigen, solange es mindestens so viele Bilder wie
   * Karten gibt.
   */
  protected istOben(karte: number, bild: number): boolean {
    return (karte + this.takt()) % this.bilder.length === bild;
  }

  /** Laufende Nummer der Karte, zweistellig — „01“ bis „06“. */
  protected nummer(i: number): string {
    return String(i + 1).padStart(2, '0');
  }
}
