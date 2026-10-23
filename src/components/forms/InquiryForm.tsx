import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { site, hasInquiryEndpoint } from "@/config/site";
import { cn } from "@/lib/cn";
import {
  emptyInquiry,
  validateInquiry,
  type FieldErrors,
  type InquiryFields,
} from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import {
  CheckboxField,
  HoneypotField,
  TextAreaField,
  TextField,
} from "@/components/forms/Fields";
import { focusFirstError, useInquiry } from "@/components/forms/useInquiry";

interface InquiryFormProps {
  className?: string;
  compact?: boolean;
}

export function InquiryForm({ className, compact = false }: InquiryFormProps) {
  const [values, setValues] = useState<InquiryFields>(emptyInquiry);
  const [errors, setErrors] = useState<FieldErrors>({});
  const { status, errorMessage, submit, honeypot, setHoneypot } =
    useInquiry("contact");

  const update = <K extends keyof InquiryFields>(field: K, value: InquiryFields[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clientErrors = validateInquiry(values, "contact");
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      focusFirstError("contact", clientErrors);
      return;
    }
    setErrors({});
    await submit(values);
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("relative", className)}
      aria-describedby={status === "error" ? "contact-form-error" : undefined}
    >
      {!hasInquiryEndpoint && (
        <StatusMessage tone="info" title="Form delivery is not connected yet" className="mb-8">
          This preview build has no inquiry endpoint configured, so submissions
          cannot be sent. Email{" "}
          <a className="link-underline text-bone" href={`mailto:${site.email.general}`}>
            {site.email.general}
          </a>{" "}
          or follow the setup guide in <code>docs/INTEGRATIONS.md</code>.
        </StatusMessage>
      )}

      <div className={cn("grid gap-7", compact ? "sm:grid-cols-1" : "sm:grid-cols-2")}>
        <TextField
          id="contact-name"
          label="Name"
          value={values.name}
          onChange={(value) => update("name", value)}
          autoComplete="name"
          placeholder="Ada Lovelace"
          error={errors.name}
          required
        />
        <TextField
          id="contact-email"
          label="Business email"
          type="email"
          inputMode="email"
          value={values.email}
          onChange={(value) => update("email", value)}
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email}
          required
        />
        {!compact && (
          <>
            <TextField
              id="contact-company"
              label="Company"
              value={values.company}
              onChange={(value) => update("company", value)}
              autoComplete="organization"
              placeholder="Company name"
              error={errors.company}
            />
            <TextField
              id="contact-phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(value) => update("phone", value)}
              autoComplete="tel"
              placeholder="Optional"
              error={errors.phone}
            />
          </>
        )}
      </div>

      <div className="mt-7">
        <TextAreaField
          id="contact-message"
          label="How can we help?"
          value={values.message}
          onChange={(value) => update("message", value)}
          placeholder="A little context is enough — what are you building, and what is the timing?"
          error={errors.message}
          rows={compact ? 4 : 5}
          required
        />
      </div>

      <div className="mt-8">
        <CheckboxField
          id="contact-consent"
          checked={values.consent}
          onChange={(checked) => update("consent", checked)}
          error={errors.consent}
          label={
            <>
              I agree that Actora LLC may use these details to respond to my
              enquiry, as described in the privacy policy.
            </>
          }
          hint={
            <>
              <Link to="/privacy" className="link-underline text-muted hover:text-bone">
                Read the privacy policy
              </Link>
            </>
          }
        />
      </div>

      <HoneypotField id="contact-website" value={honeypot} onChange={setHoneypot} />

      {status === "error" && (
        <StatusMessage
          tone="error"
          title="Your message was not sent"
          className="mt-8"
          id="contact-form-error"
        >
          <p>{errorMessage}</p>
          <p className="mt-2">
            You can also email{" "}
            <a className="link-underline text-bone" href={`mailto:${site.email.general}`}>
              {site.email.general}
            </a>{" "}
            directly. Nothing was stored by this website.
          </p>
        </StatusMessage>
      )}

      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[11px] leading-relaxed text-faint">
          We reply within two business days. We never sell enquiry data.
        </p>
        <Button
          type="submit"
          size="lg"
          showArrow={status !== "submitting"}
          loading={status === "submitting"}
          loadingLabel="Sending"
        >
          Send message
        </Button>
      </div>
    </form>
  );
}
