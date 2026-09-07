import { Injectable, computed, signal } from '@angular/core';

import { QUIZ_FRAGEN, type QuizOption } from './content';

/**
 * Antworten des Kurz-Checks.
 *
 * Bewusst nur im Arbeitsspeicher: kein localStorage, kein sessionStorage,
 * kein Netzwerkaufruf. Die Seite verspricht "keine Anmeldung, nichts wird
 * gespeichert" — dieses Versprechen darf der Speicher nicht brechen. Beim
 * Neuladen der Seite sind die Antworten weg, und das ist so gewollt.
 *
 * Der einzige Zweck ueber das Quiz hinaus: die Petitionsseite kann die
 * bereits gewaehlten Motive uebernehmen, damit dort weniger zu tun ist.
 * Uebertragen wird davon nichts, solange der Mensch nicht selbst absendet.
 */
@Injectable({ providedIn: 'root' })
export class QuizStore {
  /** Gewaehlte Options-IDs je Frage-ID. Mehrfachfragen halten mehrere. */
  private readonly antworten = signal<Readonly<Record<string, readonly string[]>>>({});

  /** Nur-Lese-Sicht fuer die Auswertung. */
  readonly alle = this.antworten.asReadonly();

  /** True, sobald mindestens eine Frage beantwortet ist. */
  readonly begonnen = computed(() => Object.keys(this.antworten()).length > 0);

  /**
   * Motive aus der letzten Frage — die Petitionsseite waehlt damit die
   * gleichen Felder vor.
   */
  readonly motive = computed<readonly string[]>(() => this.antworten()['grund'] ?? []);

  /** Antworten einer Frage, leer wenn noch nicht beantwortet. */
  gewaehlt(frageId: string): readonly string[] {
    return this.antworten()[frageId] ?? [];
  }

  /** Setzt die Antwort einer Einfachauswahl. */
  setzen(frageId: string, optionId: string): void {
    this.antworten.update((a) => ({ ...a, [frageId]: [optionId] }));
  }

  /** Schaltet eine Option einer Mehrfachauswahl an oder aus. */
  umschalten(frageId: string, optionId: string): void {
    this.antworten.update((a) => {
      const bisher = a[frageId] ?? [];
      const neu = bisher.includes(optionId)
        ? bisher.filter((id) => id !== optionId)
        : [...bisher, optionId];
      return { ...a, [frageId]: neu };
    });
  }

  zuruecksetzen(): void {
    this.antworten.set({});
  }

  /** Findet die Option zu einer ID — fuer Auswertung und Petitionsseite. */
  static option(frageId: string, optionId: string): QuizOption | undefined {
    return QUIZ_FRAGEN.find((f) => f.id === frageId)?.optionen.find(
      (o) => o.id === optionId,
    );
  }
}
