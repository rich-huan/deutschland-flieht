import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Blendet ein Element ein, sobald es in den sichtbaren Bereich scrollt.
 *
 * Die Direktive setzt lediglich die Klasse `ist-sichtbar`; wie das Element
 * auftritt, entscheidet das jeweilige Stylesheet. Dadurch kann jede Sektion
 * ihre eigene Bewegung definieren, ohne dass die Logik doppelt entsteht.
 *
 * Verwendung:
 *   <li appReveal [appRevealDelay]="120">…</li>
 *
 * Der Beobachter wird nach dem ersten Auftreten wieder geloest — die
 * Animation soll sich beim Zurueckscrollen nicht wiederholen.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.ist-sichtbar]': 'sichtbar()',
    '[style.transition-delay]': 'verzoegerungCss()',
  },
})
export class Reveal {
  /** Verzoegerung in Millisekunden, fuer gestaffelte Gruppen. */
  readonly appRevealDelay = input(0);

  /* Muss ein Signal sein: der Wert wird aus einem IntersectionObserver
     heraus gesetzt, also ausserhalb jeder Angular-Ausfuehrung. Ein
     einfaches Feld wuerde die Ansicht nie aktualisieren — das Element
     bliebe dauerhaft unsichtbar. */
  protected readonly sichtbar = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly verzoegerungCss = computed(() => {
    const ms = this.appRevealDelay();
    return ms > 0 ? `${ms}ms` : null;
  });

  constructor() {
    afterNextRender(() => {
      /* Ohne Bewegungswunsch gar nicht erst animieren: sofort sichtbar. */
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.sichtbar.set(true);
        return;
      }

      const beobachter = new IntersectionObserver(
        ([eintrag]) => {
          if (eintrag.isIntersecting) {
            this.sichtbar.set(true);
            beobachter.disconnect();
          }
        },
        /* Erst ausloesen, wenn das Element ein Stueck weit im Bild steht —
           sonst ist die Bewegung vorbei, bevor man hinsieht. */
        { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
      );

      beobachter.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => beobachter.disconnect());
    });
  }
}
