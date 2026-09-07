import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UNTERSTUETZER } from '../../core/content';

/**
 * Unterstuetzer-Reihe.
 *
 * Enthaelt ausschliesslich leere Slots. Echte Namen, Logos oder Zitate
 * duerfen hier erst stehen, wenn eine schriftliche Zusage vorliegt —
 * angebliche Unterstuetzer waeren rechtlich angreifbar und wuerden der
 * Kampagne mehr schaden als eine kurze Liste.
 */
@Component({
  selector: 'app-unterstuetzer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="us surface-ink inset" aria-labelledby="us-titel">
      <h2 id="us-titel" class="us__label t-micro">{{ inhalt.label }}</h2>

      <ul class="us__reihe">
        @for (logo of inhalt.logos; track logo.pfad) {
          <li class="us__slot">
            <img class="us__logo" [src]="logo.pfad" [alt]="logo.name" loading="lazy" decoding="async" />
          </li>
        }
        <!-- Noch freie Plaetze, bewusst als leere Rahmen gezeichnet und
             nicht als Fantasielogos. -->
        @for (i of freieSlots; track i) {
          <li class="us__slot">
            <span class="us__strich" aria-hidden="true"></span>
          </li>
        }
      </ul>

      <p class="us__hinweis t-micro">{{ inhalt.hinweis }}</p>
    </section>
  `,
  styles: `
    @use 'mixins' as *;

    .us {
      padding-block: var(--spacing-60) var(--spacing-96);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-32);
      text-align: center;
    }

    .us__label {
      margin: 0;
      color: rgba(255, 255, 255, 0.55);
      letter-spacing: 0.18em;
    }

    .us__reihe {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-40);
      margin: 0;
    }

    .us__slot {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 120px;
      height: 64px;
    }

    /* Logos laufen einfarbig hell mit — das System kennt keine gesaettigten
       Farben, und eine Reihe unterschiedlich bunter Marken wuerde die
       Flaeche zerreissen. */
    .us__logo {
      max-height: 56px;
      max-width: 140px;
      width: auto;
      object-fit: contain;
      opacity: 0.9;
    }

    /* Bewusst als leerer Platz gezeichnet, nicht als Fantasielogo. */
    .us__strich {
      display: block;
      width: 96px;
      height: 22px;
      border: 1px dashed rgba(255, 255, 255, 0.22);
      border-radius: var(--radius-links);
    }

    .us__hinweis {
      color: rgba(255, 255, 255, 0.45);
      letter-spacing: 0.06em;
      max-width: 48ch;
    }

    @include mobile {
      .us__reihe {
        gap: var(--spacing-20);
      }
    }
  `,
})
export class Unterstuetzer {
  protected readonly inhalt = UNTERSTUETZER;
  /** Indizes der noch freien Plaetze, nur zum Zeichnen der leeren Rahmen. */
  protected readonly freieSlots = Array.from(
    { length: UNTERSTUETZER.freieSlots },
    (_, i) => i,
  );
}
