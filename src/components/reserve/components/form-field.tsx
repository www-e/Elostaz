"use client";

/* ── Shared styling — single source of truth ── */

export const inputBase =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed";

export const inputError =
  "border-destructive focus:ring-destructive/30 focus:border-destructive";

export const labelClass =
  "block text-sm font-medium mb-1.5 text-foreground";

export const errorClass = "mt-1 text-xs text-destructive";

/* ── Helpers ── */

const ERROR_ID_PREFIX = "field-error-";

export function errorId(field: string): string {
  return `${ERROR_ID_PREFIX}${field}`;
}

/* ── Props ── */

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  /** Input/select id for label association. Omit for radio groups. */
  htmlFor?: string;
  /** Render as <fieldset><legend> instead of <label> (for radio groups). */
  asFieldset?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps an input element with a label and an error message.
 * - For text/select fields: pass `htmlFor` to associate <label> with <input>.
 * - For radio groups: pass `asFieldset` to render <fieldset><legend>.
 * Error messages get an id linked via aria-describedby on the input.
 */
export function FormField({
  label,
  required,
  error,
  htmlFor,
  asFieldset,
  children,
}: FormFieldProps) {
  const errId = error ? errorId(htmlFor ?? "gender") : undefined;

  if (asFieldset) {
    return (
      <fieldset>
        <legend className={labelClass}>
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </legend>
        {children}
        {error && (
          <p id={errId} className={errorClass} role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  }

  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </label>
      ) : (
        <div className={labelClass}>
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </div>
      )}
      {children}
      {error && (
        <p id={errId} className={errorClass} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
