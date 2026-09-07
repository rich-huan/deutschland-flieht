import {
  DestroyRef,
  ElementRef,
  Signal,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';

/**
 * Fortschritt eines Elements durch den Viewport, als Signal von 0 bis 1.
 *
 * 0 = die Oberkante des Elements erreicht gerade die Oberkante des Viewports,
 * 1 = die Unterkante des Elements verlaesst gerade die Unterkante.
 *
 * Wird von der gepinnten Sequenz und der Fahnen-Sektion genutzt. Die Messung
 * laeuft ueber requestAnimationFrame, damit pro Frame hoechstens ein Layout-
 * Read passiert und der Scroll-Handler passiv bleibt.
 *
 * Muss im Injection-Kontext aufgerufen werden (Feld-Initialisierer oder
 * Konstruktor einer Komponente).
 */
export function scrollProgress(
  host: ElementRef<HTMLElement>,
  options: { readonly pinned?: boolean } = {},
): Signal<number> {
  const progress = signal(0);
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    let frame = 0;

    const measure = (): void => {
      frame = 0;
      const el = host.nativeElement;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;

      /* Bei gepinnten Sektionen ist die scrollbare Strecke die Elementhoehe
         abzuechlich einer Viewporthoehe - so lange bleibt der Inhalt stehen.
         Sonst zaehlt der volle Durchlauf durch den Viewport. */
      const strecke = options.pinned
        ? Math.max(1, rect.height - viewport)
        : Math.max(1, rect.height + viewport);

      const gelaufen = options.pinned ? -rect.top : viewport - rect.top;

      const p = gelaufen / strecke;
      progress.set(p < 0 ? 0 : p > 1 ? 1 : p);
    };

    const schedule = (): void => {
      if (frame === 0) {
        frame = requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    destroyRef.onDestroy(() => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    });
  });

  return progress.asReadonly();
}

/**
 * Aktuelle Scrollposition des Fensters als Signal.
 *
 * Fuer Effekte, die sich direkt an der Scrollstrecke orientieren und nicht
 * am Durchlauf eines bestimmten Elements — etwa die Wortmarke im Hero, die
 * beim Scrollen hinter die Bildkante sinkt.
 */
export function fensterScroll(): Signal<number> {
  const wert = signal(0);
  const destroyRef = inject(DestroyRef);

  afterNextRender(() => {
    let frame = 0;

    const messen = (): void => {
      frame = 0;
      wert.set(window.scrollY);
    };

    const planen = (): void => {
      if (frame === 0) {
        frame = requestAnimationFrame(messen);
      }
    };

    messen();
    window.addEventListener('scroll', planen, { passive: true });

    destroyRef.onDestroy(() => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', planen);
    });
  });

  return wert.asReadonly();
}

/** Blendet einen Wert zwischen zwei Schwellen von 0 auf 1 auf. */
export function rampe(wert: number, von: number, bis: number): number {
  if (bis <= von) {
    return wert >= bis ? 1 : 0;
  }
  const t = (wert - von) / (bis - von);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}
