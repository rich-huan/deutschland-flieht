import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { HERO, MARKE } from '../../core/content';
import { fensterScroll } from '../../core/scroll-progress';
import { Zaehlwert } from '../../shared/zaehlwert';

/**
 * Hero — Putty-Canvas mit kleinem Typo-Cluster ueber monumentaler Wortmarke.
 *
 * Die Wortmarke ist das Signaturelement: sie laeuft absichtlich ueber die
 * Viewportbreite hinaus und wird an beiden Raendern beschnitten.
 *
 * Bewusst ohne Schaltflaeche: der Hero behauptet nur. Der Weg zur Petition
 * beginnt weiter unten, nach dem Kurz-Check und im Abschluss.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Zaehlwert],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly hero = HERO;
  protected readonly marke = MARKE;

  private readonly scroll = fensterScroll();

  /**
   * Die Wortmarke ruht auf der Oberkante des Gemaeldes und sinkt beim
   * Scrollen dahinter weg. Sie bewegt sich schneller als die Seite, dadurch
   * wirkt es, als tauche sie hinter der Kante ab, statt nur mitzulaufen.
   */
  protected readonly markeVersatz = computed(() =>
    Math.min(this.scroll() * 0.9, 420),
  );
}
