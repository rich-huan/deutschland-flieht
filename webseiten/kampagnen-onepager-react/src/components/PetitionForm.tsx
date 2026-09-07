import { type FormEvent, useRef, useState } from "react";
import { petition } from "../content/site";
import {
  type FieldErrors,
  type SignatureDraft,
  type SignatureField,
  emptySignature,
  submitSignature,
  validateSignature,
} from "../lib/petition";
import { Field } from "./Field";
import styles from "./PetitionForm.module.css";

type Status = "idle" | "submitting" | "done" | "error";
type TextField = Extract<SignatureField, "firstName" | "lastName" | "email">;

export function PetitionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<SignatureDraft>(emptySignature);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  /** Eine Korrektur soll die Fehlermeldung des Feldes sofort entfernen. */
  const clearError = (field: SignatureField) => {
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const updateText = (field: TextField) => (value: string) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
    clearError(field);
  };

  const updateConsent = (value: boolean) => {
    setDraft((previous) => ({ ...previous, consent: value }));
    clearError("consent");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const found = validateSignature(draft);
    setErrors(found);

    const [firstInvalid] = Object.keys(found) as SignatureField[];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setSubmitError(null);

    try {
      await submitSignature(draft);
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setSubmitError(
        error instanceof Error ? error.message : "Es ist ein unbekannter Fehler aufgetreten.",
      );
    }
  };

  if (status === "done") {
    return (
      <div className={styles.success} role="status">
        <svg className={styles.check} viewBox="0 0 32 32" aria-hidden="true">
          <circle className={styles.checkRing} cx="16" cy="16" r="15" />
          <path className={styles.checkMark} d="M9.5 16.5 L14 21 L22.5 11" />
        </svg>
        <p className={styles.successTitle}>{petition.successTitle}</p>
        <p className={styles.successBody}>{petition.successBody}</p>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <Field
          id="petition-firstname"
          name="firstName"
          label="Vorname"
          value={draft.firstName}
          autoComplete="given-name"
          error={errors.firstName}
          disabled={busy}
          onChange={updateText("firstName")}
        />
        <Field
          id="petition-lastname"
          name="lastName"
          label="Nachname"
          value={draft.lastName}
          autoComplete="family-name"
          error={errors.lastName}
          disabled={busy}
          onChange={updateText("lastName")}
        />
      </div>

      <Field
        id="petition-email"
        name="email"
        label="E-Mail"
        type="email"
        value={draft.email}
        autoComplete="email"
        error={errors.email}
        disabled={busy}
        onChange={updateText("email")}
      />

      <p className={styles.consent} data-invalid={errors.consent ? "" : undefined}>
        <label className={styles.consentLabel}>
          <input
            type="checkbox"
            name="consent"
            className={styles.checkbox}
            checked={draft.consent}
            disabled={busy}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "petition-consent-error" : undefined}
            onChange={(event) => updateConsent(event.target.checked)}
          />
          <span className={styles.box} aria-hidden="true" />
          <span>{petition.consentLabel}</span>
        </label>
        {errors.consent && (
          <span id="petition-consent-error" className={styles.error} role="alert">
            {errors.consent}
          </span>
        )}
      </p>

      <button type="submit" className={styles.submit} disabled={busy}>
        <span>{busy ? "Wird gesendet …" : petition.submitLabel}</span>
      </button>

      {submitError && (
        <p className={styles.error} role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
