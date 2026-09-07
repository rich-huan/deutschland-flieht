import styles from "./PetitionForm.module.css";

interface FieldProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email";
  value: string;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

/** Einzelnes Formularfeld: Beschriftung, Eingabe, Fehlermeldung. */
export function Field({
  id,
  name,
  label,
  type = "text",
  value,
  autoComplete,
  error,
  disabled,
  onChange,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <p className={styles.field} data-invalid={error ? "" : undefined}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className={styles.input}
        value={value}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </p>
  );
}
