import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (describedBy: string | undefined) => ReactNode;
  className?: string;
}

function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: FieldShellProps) {
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={id}
          className="text-[0.8125rem] font-medium tracking-[-0.005em] text-bone"
        >
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="ml-1 text-ember">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
        {hint && (
          <span id={`${id}-hint`} className="text-[11px] text-faint">
            {hint}
          </span>
        )}
      </div>
      <div className="mt-2.5">{children(describedBy)}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.78rem] leading-snug text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "url";
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  inputMode?: "text" | "email" | "tel" | "url";
  className?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  hint,
  error,
  required,
  disabled,
  inputMode,
  className,
}: TextFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      {(describedBy) => (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange(event.target.value)
          }
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          disabled={disabled}
          inputMode={inputMode}
          className="field-input"
        />
      )}
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  required,
  rows = 5,
  maxLength = 5000,
  disabled,
  className,
}: TextAreaFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint ?? `${value.length}/${maxLength}`}
      error={error}
      className={className}
    >
      {(describedBy) => (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          disabled={disabled}
          className="field-input scroll-thin"
        />
      )}
    </FieldShell>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  hint,
  error,
  required,
  disabled,
  className,
}: SelectFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      {(describedBy) => (
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          disabled={disabled}
          className="field-input"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

/** Visually hidden honeypot. Real people never see or tab to this field. */
export function HoneypotField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
    >
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  hint?: ReactNode;
  disabled?: boolean;
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  error,
  hint,
  disabled,
}: CheckboxFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          className="mt-1 size-4 shrink-0 cursor-pointer rounded-xs border border-line-strong bg-transparent accent-ember"
        />
        <div className="min-w-0">
          <label
            htmlFor={id}
            className="cursor-pointer text-[0.8125rem] leading-relaxed text-muted"
          >
            {label}
          </label>
          {hint && (
            <p id={`${id}-hint`} className="mt-1.5 text-[11px] text-faint">
              {hint}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.78rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
