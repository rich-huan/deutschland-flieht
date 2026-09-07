import { ChangeDetectionStrategy, Component } from '@angular/core';

import { VIGNETTEN, ZAHLEN_SEKTION } from '../../core/content';
import { Reveal } from '../../shared/reveal';
import { Zaehlwert } from '../../shared/zaehlwert';

/**
 * Drei-Spalten-Raster mit kreisrunden Bildausschnitten.
 *
 * Jede Spalte traegt eine Kennzahl. Die Quellenangabe steht direkt darunter
 * und nicht in einer Fussnote: eine Kampagne, die mit Zahlen argumentiert,
 * muss den Beleg dort zeigen, wo die Zahl steht.
 */
@Component({
  selector: 'app-zahlen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, Zaehlwert],
  templateUrl: './zahlen.html',
  styleUrl: './zahlen.scss',
})
export class Zahlen {
  protected readonly sektion = ZAHLEN_SEKTION;
  protected readonly vignetten = VIGNETTEN;
}
