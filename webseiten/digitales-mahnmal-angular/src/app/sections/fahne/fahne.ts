import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
} from '@angular/core';

import { FAHNE } from '../../core/content';
import { scrollProgress } from '../../core/scroll-progress';
import { FahnenCanvas } from './fahnen-canvas';

/**
 * Fahnen-Sektion.
 *
 * Drei Ebenen uebereinander:
 *   1. gestapelte Serif-Lettern, die beim Scrollen nach oben wandern
 *   2. feine Wireframe-Geometrie als Raster
 *   3. die 3D-Fahne, die diagonal durchs Bild zieht und dabei verschleisst
 */
@Component({
  selector: 'app-fahne',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FahnenCanvas],
  templateUrl: './fahne.html',
  styleUrl: './fahne.scss',
})
export class Fahne {
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly inhalt = FAHNE;
  protected readonly buchstaben = FAHNE.gestapelt.split('');

  protected readonly fortschritt = scrollProgress(this.host, { pinned: true });

  /** Verschiebung der Letternspalte in Prozent ihrer eigenen Hoehe. */
  protected readonly letternVersatz = computed(() => {
    const anzahl = this.buchstaben.length;
    /* Die Spalte ist so hoch wie alle Lettern zusammen; sichtbar ist immer
       nur ein Ausschnitt. Sie faehrt genau um die Differenz nach oben. */
    return -this.fortschritt() * (100 - 100 / anzahl);
  });

}
