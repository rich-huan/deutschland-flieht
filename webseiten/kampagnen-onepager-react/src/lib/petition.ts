export interface SignatureDraft {
  firstName: string;
  lastName: string;
  email: string;
  consent: boolean;
}

export type SignatureField = keyof SignatureDraft;

export type FieldErrors = Partial<Record<SignatureField, string>>;

export const emptySignature: SignatureDraft = {
  firstName: "",
  lastName: "",
  email: "",
  consent: false,
};

/** Bewusst nachsichtig: prüft die Form, nicht die Existenz der Adresse. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateSignature(draft: SignatureDraft): FieldErrors {
  const errors: FieldErrors = {};

  if (draft.firstName.trim().length < 2) {
    errors.firstName = "Bitte gib deinen Vornamen an.";
  }
  if (draft.lastName.trim().length < 2) {
    errors.lastName = "Bitte gib deinen Nachnamen an.";
  }
  if (!EMAIL_PATTERN.test(draft.email.trim())) {
    errors.email = "Bitte gib eine gültige E-Mail-Adresse an.";
  }
  if (!draft.consent) {
    errors.consent = "Ohne deine Zustimmung können wir dich nicht zählen.";
  }

  return errors;
}

export interface SubmitResult {
  /** `false` = Demo-Modus, es wurde nichts übertragen. */
  delivered: boolean;
}

/**
 * Anbindungspunkt für ein späteres Backend.
 *
 * Solange `ENDPOINT` leer ist, läuft der Absende-Vorgang im Demo-Modus:
 * Es wird nichts gesendet und nichts gespeichert. Sobald ein Endpunkt
 * eingetragen wird, verschickt diese Funktion die Unterschrift als JSON —
 * die Petitions-Komponente muss dafür nicht angepasst werden.
 */
const ENDPOINT: string | null = null;

export async function submitSignature(draft: SignatureDraft): Promise<SubmitResult> {
  if (!ENDPOINT) {
    // Kurze künstliche Verzögerung, damit der Ladezustand realistisch wirkt.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { delivered: false };
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      email: draft.email.trim().toLowerCase(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Petition konnte nicht übermittelt werden (${response.status}).`);
  }

  return { delivered: true };
}
