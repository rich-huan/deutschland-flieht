import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ABSCHLUSS } from '../../core/content';

/**
 * Heller Abschluss nach dem langen dunklen Block — der harte Flaechenwechsel
 * ist das Mittel, mit dem die Seite ihren Schluss markiert.
 */
@Component({
  selector: 'app-abschluss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="ab surface-chalk inset" aria-labelledby="ab-titel">
      <h2 id="ab-titel" class="ab__titel">
        <span class="ab__zeile">
          <span class="t-italic">{{ inhalt.zeile1Kursiv }}</span>
          {{ inhalt.zeile1Rest }}
        </span>
        <span class="ab__zeile">{{ inhalt.zeile2 }}</span>
      </h2>

      <p class="ab__text">{{ inhalt.text }}</p>

      <a class="pill" [routerLink]="inhalt.cta.pfad">{{ inhalt.cta.label }}</a>
    </section>
  `,
  styles: `
    @use 'mixins' as *;

    .ab {
      padding-block: var(--spacing-96);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-32);
      text-align: center;
    }

    .ab__titel {
      margin: 0;
      font-family: var(--font-davinci);
      font-weight: var(--font-weight-regular);
      font-size: var(--text-section-fluid);
      line-height: var(--leading-section);
      letter-spacing: -0.009em;
      color: var(--color-ink);
      display: flex;
      flex-direction: column;
    }

    .ab__zeile {
      display: block;
    }

    .ab__text {
      @include grotesk-body;
      max-width: 52ch;
      color: var(--color-graphite);
    }

    @include tablet {
      .ab {
        padding-block: var(--spacing-60);
      }
    }
  `,
})
export class Abschluss {
  protected readonly inhalt = ABSCHLUSS;
}
