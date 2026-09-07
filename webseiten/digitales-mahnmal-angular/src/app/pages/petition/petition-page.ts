import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { FORDERUNGEN, PETITION, QUIZ_FRAGEN } from '../../core/content';
import { QuizStore } from '../../core/quiz-store';

/** Felder, zu denen es eine Fehlermeldung gibt. */
type Pflichtfeld = 'vorname' | 'nachname' | 'email' | 'plz' | 'einwilligung';

/**
 * Petitionsseite.
 *
 * Links steht, was unterschrieben wird — Adressat, Petitionstext,
 * Forderungen und der Weg der Daten. Rechts das Formular. Diese Reihenfolge
 * ist keine Geschmacksfrage: Wer nicht weiss, wohin seine E-Mail-Adresse
 * geht, traegt sie nicht ein.
 *
 * Das Formular ist vollstaendig validiert, speichert aber nichts: es gibt
 * kein Backend. Statt einen Erfolg vorzutaeuschen, sagt die Seite nach dem
 * Absenden offen, dass sie im Demo-Modus laeuft.
 *
 * Fuer den Echtbetrieb fehlen:
 *   - Endpunkt, der die Unterschrift entgegennimmt
 *   - Double-Opt-In per E-Mail (sonst sind die Unterschriften wertlos)
 *   - Impressum und Datenschutzerklaerung mit den echten Angaben
 *   - serverseitiger Schutz gegen automatisierte Eintraege
 */
@Component({
  selector: 'app-petition-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './petition-page.html',
  styleUrl: './petition-page.scss',
})
export class PetitionPage {
  private readonly fb = inject(FormBuilder);
  private readonly quiz = inject(QuizStore);

  protected readonly inhalt = PETITION;
  protected readonly forderungen = FORDERUNGEN;

  /** Dieselben Motive wie im Kurz-Check — eine Liste, nicht zwei. */
  protected readonly motivOptionen =
    QUIZ_FRAGEN.find((f) => f.id === 'grund')?.optionen ?? [];

  /* Wer den Kurz-Check gemacht hat, findet seine Motive hier vorausgewaehlt.
     Uebertragen wurde dabei nichts: die Antworten lagen nur im Speicher
     dieses Tabs, und sie verlassen ihn erst mit dem Absenden. */
  protected readonly motive = signal<readonly string[]>([...this.quiz.motive()]);
  protected readonly ausQuiz = this.quiz.motive().length > 0;

  /** Bleibt bei null, solange kein Backend zaehlt. Keine erfundene Zahl. */
  protected readonly zaehler = signal(PETITION.zaehlerStart);
  protected readonly abgeschickt = signal(false);
  /** Ab dem ersten Absendeversuch werden alle Fehler gezeigt, nicht nur die berührten. */
  protected readonly versucht = signal(false);

  protected readonly formular = this.fb.nonNullable.group({
    vorname: ['', [Validators.required, Validators.maxLength(80)]],
    nachname: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    plz: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    geschichte: ['', [Validators.maxLength(1200)]],
    einwilligung: [false, [Validators.requiredTrue]],
    oeffentlich: [false],
    updates: [false],
    /* Honigtopf: fuer Menschen unsichtbar und nicht fokussierbar. Was hier
       steht, hat ein Bot eingetragen. Ein serverseitiger Schutz ersetzt das
       nicht — er kommt zusaetzlich. */
    webseite: [''],
  });

  private readonly fehlerTexte: Readonly<Record<Pflichtfeld, string>> = {
    vorname: 'Bitte trag deinen Vornamen ein.',
    nachname: 'Bitte trag deinen Nachnamen ein.',
    email: 'Bitte eine gültige E-Mail-Adresse angeben — an sie geht die Bestätigung.',
    plz: 'Die Postleitzahl besteht aus fünf Ziffern.',
    einwilligung: 'Ohne Einwilligung dürfen wir die Unterschrift nicht annehmen.',
  };

  private readonly pflichtfelder: readonly Pflichtfeld[] = [
    'vorname',
    'nachname',
    'email',
    'plz',
    'einwilligung',
  ];

  /** Zeigt einen Fehler, sobald das Feld berührt wurde oder abgeschickt ist. */
  protected fehler(feld: Pflichtfeld): boolean {
    const c = this.formular.controls[feld];
    return c.invalid && (c.touched || c.dirty || this.versucht());
  }

  protected fehlerText(feld: Pflichtfeld): string {
    return this.fehlerTexte[feld];
  }

  /** Sammelmeldung über dem Formular: alle offenen Punkte auf einen Blick. */
  protected offeneFehler(): readonly { feld: Pflichtfeld; text: string }[] {
    if (!this.versucht()) {
      return [];
    }
    return this.pflichtfelder
      .filter((f) => this.formular.controls[f].invalid)
      .map((f) => ({ feld: f, text: this.fehlerTexte[f] }));
  }

  /** Springt aus der Sammelmeldung zum betroffenen Feld. */
  protected fokussieren(feld: Pflichtfeld): void {
    document.getElementById(`pt-${feld}`)?.focus();
  }

  protected istMotiv(id: string): boolean {
    return this.motive().includes(id);
  }

  protected motivUmschalten(id: string): void {
    this.motive.update((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
  }

  /** Restliche Zeichen im Freitextfeld. */
  protected verbleibend(): number {
    return 1200 - this.formular.controls.geschichte.value.length;
  }

  protected absenden(): void {
    this.versucht.set(true);

    if (this.formular.invalid) {
      this.formular.markAllAsTouched();
      /* Zum ersten offenen Punkt springen, statt den Menschen suchen zu
         lassen — bei einem langen Formular sonst der haeufigste Abbruch. */
      const erstes = this.offeneFehler()[0];
      if (erstes) {
        document.getElementById(`pt-${erstes.feld}`)?.focus();
      }
      return;
    }

    /* Bewusst kein Netzwerkaufruf und kein Hochzaehlen des Zaehlers:
       es waere eine Luege gegenueber dem Unterzeichnenden. */
    this.abgeschickt.set(true);
  }

  protected zurueckZumFormular(): void {
    this.abgeschickt.set(false);
  }
}
