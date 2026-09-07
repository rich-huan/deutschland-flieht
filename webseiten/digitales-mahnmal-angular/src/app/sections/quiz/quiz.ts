import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  QUIZ,
  QUIZ_ERGEBNISSE,
  QUIZ_FRAGEN,
  QUIZ_HINWEIS_JUNG,
  type QuizFrage,
  type QuizOption,
} from '../../core/content';
import { QuizStore } from '../../core/quiz-store';

/** Die vier Auswertungsprofile. */
type Profil = keyof typeof QUIZ_ERGEBNISSE;

/**
 * Kurz-Check.
 *
 * Vier Fragen, eine nach der anderen, ohne Anmeldung und ohne Uebertragung.
 * Die Antworten liegen im QuizStore und damit ausschliesslich im Speicher
 * dieses Tabs; die Petitionsseite liest von dort nur die Motive, um sie
 * vorzuwaehlen.
 *
 * Bedienung: Die Optionen sind echte Radiobuttons beziehungsweise
 * Checkboxen. Damit funktionieren Tastatur, Screenreader und Formularlogik
 * ohne Nachbau. Ein Mausklick springt automatisch zur naechsten Frage — bei
 * Tastaturbedienung nicht, sonst koennte man mit den Pfeiltasten nicht mehr
 * durch die Optionen wandern (erkennbar an `detail === 0`).
 */
@Component({
  selector: 'app-quiz',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  private readonly store = inject(QuizStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly inhalt = QUIZ;
  protected readonly fragen = QUIZ_FRAGEN;
  protected readonly hinweisJung = QUIZ_HINWEIS_JUNG;

  protected readonly index = signal(0);
  protected readonly fertig = signal(false);

  protected readonly aktuelle = computed<QuizFrage>(() => this.fragen[this.index()]);
  protected readonly istLetzte = computed(() => this.index() === this.fragen.length - 1);

  /** Fortschritt in Prozent, fuer den Balken ueber der Frage. */
  protected readonly fortschritt = computed(() =>
    this.fertig()
      ? 100
      : Math.round(((this.index() + (this.beantwortet() ? 1 : 0)) / this.fragen.length) * 100),
  );

  /** Ist die aktuelle Frage beantwortet? */
  protected readonly beantwortet = computed(
    () => this.store.gewaehlt(this.aktuelle().id).length > 0,
  );

  /* Die Motivfrage ist freiwillig — dort darf man auch ohne Auswahl weiter. */
  protected readonly weiterMoeglich = computed(
    () => this.beantwortet() || this.aktuelle().mehrfach,
  );

  private timer = 0;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  protected istGewaehlt(frageId: string, optionId: string): boolean {
    return this.store.gewaehlt(frageId).includes(optionId);
  }

  /** Auswahl uebernehmen. Bei Einfachauswahl ersetzt sie die bisherige. */
  protected waehlen(frage: QuizFrage, option: QuizOption): void {
    if (frage.mehrfach) {
      this.store.umschalten(frage.id, option.id);
    } else {
      this.store.setzen(frage.id, option.id);
    }
  }

  /**
   * Mausklick auf eine Option. `detail > 0` bedeutet: es war ein echter
   * Zeigerklick, keine Auswahl per Leertaste oder Pfeiltaste.
   */
  protected geklickt(frage: QuizFrage, ereignis: MouseEvent): void {
    if (frage.mehrfach || ereignis.detail === 0) {
      return;
    }
    clearTimeout(this.timer);
    /* Kurze Pause, damit die Auswahl noch sichtbar wird, bevor die naechste
       Frage kommt — sonst wirkt der Sprung wie ein Fehler. */
    this.timer = window.setTimeout(() => this.weiter(), 320);
  }

  protected weiter(): void {
    clearTimeout(this.timer);
    if (this.istLetzte()) {
      this.fertig.set(true);
      return;
    }
    this.index.update((i) => i + 1);
  }

  protected zurueck(): void {
    clearTimeout(this.timer);
    if (this.fertig()) {
      this.fertig.set(false);
      return;
    }
    this.index.update((i) => Math.max(0, i - 1));
  }

  protected neu(): void {
    clearTimeout(this.timer);
    this.store.zuruecksetzen();
    this.index.set(0);
    this.fertig.set(false);
  }

  /* --- Auswertung --------------------------------------------------------
     Vollstaendig aus den Antworten abgeleitet, ohne Zufall und ohne
     Punktesystem: bei gleichen Antworten steht immer dasselbe da.        */

  private erste(frageId: string): string | undefined {
    return this.store.gewaehlt(frageId)[0];
  }

  protected readonly profil = computed<Profil>(() => {
    const gedanke = this.erste('gedanke');
    const stand = this.erste('stand');

    if (stand === 'plane' || stand === 'weg' || gedanke === 'ja-konkret') {
      return 'entschlossen';
    }
    if (gedanke === 'ja-oft') {
      return 'erwaegend';
    }
    if (gedanke === 'nein-verstehe') {
      return 'verstaendnis';
    }
    return 'bleibend';
  });

  protected readonly ergebnis = computed(() => QUIZ_ERGEBNISSE[this.profil()]);

  protected readonly alterKurz = computed(() => {
    const id = this.erste('alter');
    return id ? (QuizStore.option('alter', id)?.kurz ?? '') : this.inhalt.ergebnisOhneMotiv;
  });

  protected readonly istJung = computed(() => this.erste('alter') === 'u30');

  protected readonly motiveKurz = computed(() => {
    const ids = this.store.gewaehlt('grund');
    if (ids.length === 0) {
      return this.inhalt.ergebnisOhneMotiv;
    }
    return ids
      .map((id) => QuizStore.option('grund', id)?.kurz)
      .filter((k): k is string => !!k)
      .join(', ');
  });
}
