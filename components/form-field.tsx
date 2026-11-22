import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const controlClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/40";

interface BaseProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

function Wrapper({ id, label, error, hint, children }: BaseProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function FormField({ id, label, error, hint, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${controlClass} ${error ? "border-danger" : "border-border"}`}
        {...props}
      />
    </Wrapper>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        name={id}
        rows={4}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${controlClass} ${error ? "border-danger" : "border-border"}`}
        {...props}
      />
    </Wrapper>
  );
}
