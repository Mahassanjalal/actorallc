import { useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { site, hasInquiryEndpoint } from "@/config/site";
import { cn } from "@/lib/cn";
import {
  BUDGET_RANGES,
  PROJECT_TYPES,
  TIMELINES,
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
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/forms/Fields";
import { focusFirstError, useInquiry } from "@/components/forms/useInquiry";

const steps = [
  { label: "Project", fields: ["projectType", "budget", "timeline"] as const },
  { label: "Brief", fields: ["company", "message"] as const },
  { label: "Contact", fields: ["name", "email", "phone", "consent"] as const },
];

const servicePrefill: Record<string, string> = {
  "brand-identity": "Brand & identity",
  "digital-product": "Digital product",
  "web-platforms": "Website or platform",
  "film-motion": "Film & motion",
};

function pickErrors(
  errors: FieldErrors,
  fields: readonly (keyof InquiryFields)[],
): FieldErrors {
  const subset: FieldErrors = {};
  for (const field of fields) {
    if (errors[field]) subset[field] = errors[field];
  }
  return subset;
}

export function ProjectInquiryForm({ className }: { className?: string }) {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") ?? "";
  const [values, setValues] = useState<InquiryFields>({
    ...emptyInquiry,
    projectType: servicePrefill[requestedService] ?? "",
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { status, errorMessage, submit, honeypot, setHoneypot } =
    useInquiry("project");

  const update = <K extends keyof InquiryFields>(field: K, value: InquiryFields[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const focusHeading = () => {
    window.requestAnimationFrame(() => headingRef.current?.focus());
  };

  const goToStep = (index: number) => {
    setStep(index);
    focusHeading();
  };

  const validateCurrentStep = (): boolean => {
    const all = validateInquiry(values, "project");
    const subset = pickErrors(all, steps[step].fields);
    setErrors((current) => ({ ...current, ...subset }));
    if (Object.keys(subset).length > 0) {
      focusFirstError("project", subset);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    goToStep(Math.min(step + 1, steps.length - 1));
  };

  const handleBack = () => {
    if (step === 0) return;
    goToStep(step - 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < steps.length - 1) {
      handleNext();
      return;
    }

    const all = validateInquiry(values, "project");
    if (Object.keys(all).length > 0) {
      setErrors(all);
      const failingStep = steps.findIndex((entry) =>
        entry.fields.some((field) => Boolean(all[field])),
      );
      if (failingStep >= 0 && failingStep !== step) {
        goToStep(failingStep);
        window.setTimeout(() => focusFirstError("project", all), 80);
      } else {
        focusFirstError("project", all);
      }
      return;
    }

    setErrors({});
    await submit(values);
  };

  const summary = [
    { label: "Project type", value: values.projectType, step: 0 },
    { label: "Budget", value: values.budget, step: 0 },
    { label: "Timeline", value: values.timeline, step: 0 },
    { label: "Company", value: values.company || "Not provided", step: 1 },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("relative", className)}>
      <div className="flex items-start justify-between gap-6 border-b border-line pb-5">
        <ol className="flex flex-1 flex-wrap gap-x-6 gap-y-3">
          {steps.map((entry, index) => (
            <li
              key={entry.label}
              aria-current={index === step ? "step" : undefined}
              className="flex items-center gap-2"
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border font-mono text-[10px]",
                  index === step
                    ? "border-ember bg-ember text-ink"
                    : index < step
                      ? "border-ember/40 text-ember-soft"
                      : "border-line-strong text-faint",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "text-[11px] uppercase tracking-[0.14em]",
                  index === step ? "text-bone" : "text-faint",
                )}
              >
                {entry.label}
              </span>
            </li>
          ))}
        </ol>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
          {step + 1} / {steps.length}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {steps.length}: {steps[step].label}
      </p>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-8 text-2xl tracking-[-0.025em] text-bone outline-none"
      >
        {step === 0 && "What are we building?"}
        {step === 1 && "Tell us about the brief."}
        {step === 2 && "Where should we send the reply?"}
      </h2>

      {!hasInquiryEndpoint && (
        <StatusMessage tone="info" title="Form delivery is not connected yet" className="mt-6">
          This preview build has no inquiry endpoint configured, so submissions
          cannot be sent. Email{" "}
          <a className="link-underline text-bone" href={`mailto:${site.email.projects}`}>
            {site.email.projects}
          </a>{" "}
          or follow the setup guide in <code>docs/INTEGRATIONS.md</code>.
        </StatusMessage>
      )}

      <div className="mt-8">
        {step === 0 && (
          <div className="space-y-8">
            <fieldset>
              <legend className="text-[0.8125rem] font-medium text-bone">
                Project type
                <span aria-hidden="true" className="ml-1 text-ember">
                  *
                </span>
                <span className="sr-only"> (required)</span>
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {PROJECT_TYPES.map((type, index) => {
                  const selected = values.projectType === type;
                  return (
                    <label
                      key={type}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3.5 text-sm transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ember",
                        selected
                          ? "border-ember/60 bg-ember/[0.07] text-bone"
                          : "border-line text-muted hover:border-line-strong hover:text-bone",
                      )}
                    >
                      {type}
                      <input
                        id={
                          index === 0 ? "project-projectType" : `project-type-${index}`
                        }
                        type="radio"
                        name="projectType"
                        value={type}
                        checked={selected}
                        onChange={() => update("projectType", type)}
                        aria-describedby={
                          errors.projectType ? "project-projectType-error" : undefined
                        }
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2 rounded-full",
                          selected ? "bg-ember" : "bg-line-strong",
                        )}
                      />
                    </label>
                  );
                })}
              </div>
              {errors.projectType && (
                <p
                  id="project-projectType-error"
                  className="mt-2 text-[0.78rem] text-danger"
                >
                  {errors.projectType}
                </p>
              )}
            </fieldset>

            <div className="grid gap-7 sm:grid-cols-2">
              <SelectField
                id="project-budget"
                label="Budget range"
                value={values.budget}
                onChange={(value) => update("budget", value)}
                options={BUDGET_RANGES}
                placeholder="Select a range"
                error={errors.budget}
                required
              />
              <SelectField
                id="project-timeline"
                label="Desired timeline"
                value={values.timeline}
                onChange={(value) => update("timeline", value)}
                options={TIMELINES}
                placeholder="Select a timeline"
                error={errors.timeline}
                required
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-7">
            <TextField
              id="project-company"
              label="Company"
              value={values.company}
              onChange={(value) => update("company", value)}
              autoComplete="organization"
              placeholder="Where do you work?"
              error={errors.company}
            />
            <TextAreaField
              id="project-message"
              label="Project description"
              value={values.message}
              onChange={(value) => update("message", value)}
              placeholder="What are you making, who is it for, and what does success look like? Links to anything relevant are welcome."
              error={errors.message}
              rows={7}
              required
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="rounded-md border border-line bg-ink-raised p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="label text-bone">Your brief so far</h3>
                <button
                  type="button"
                  onClick={() => goToStep(0)}
                  className="label inline-flex items-center gap-1.5 text-muted hover:text-bone"
                >
                  <Pencil className="size-3" aria-hidden="true" /> Edit
                </button>
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {summary.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-faint">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-bone">{item.value || "—"}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-muted">
                {values.message}
              </p>
            </div>

            <div className="grid gap-7 sm:grid-cols-2">
              <TextField
                id="project-name"
                label="Name"
                value={values.name}
                onChange={(value) => update("name", value)}
                autoComplete="name"
                placeholder="Your name"
                error={errors.name}
                required
              />
              <TextField
                id="project-email"
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
              <TextField
                id="project-phone"
                label="Phone"
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={(value) => update("phone", value)}
                autoComplete="tel"
                placeholder="Optional"
                error={errors.phone}
                className="sm:col-span-1"
              />
            </div>

            <CheckboxField
              id="project-consent"
              checked={values.consent}
              onChange={(checked) => update("consent", checked)}
              error={errors.consent}
              label="I agree that Actora LLC may use these details to respond to my enquiry, as described in the privacy policy."
              hint={
                <>
                  <Link to="/privacy" className="link-underline text-muted hover:text-bone">
                    Read the privacy policy
                  </Link>
                </>
              }
            />
          </div>
        )}
      </div>

      <HoneypotField id="project-website" value={honeypot} onChange={setHoneypot} />

      {status === "error" && (
        <StatusMessage tone="error" title="Your brief was not sent" className="mt-8">
          <p>{errorMessage}</p>
          <p className="mt-2">
            You can email{" "}
            <a className="link-underline text-bone" href={`mailto:${site.email.projects}`}>
              {site.email.projects}
            </a>{" "}
            directly. Nothing was stored by this website.
          </p>
        </StatusMessage>
      )}

      <div className="mt-10 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-bone"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </button>
        ) : (
          <p className="text-[11px] text-faint">Takes about two minutes.</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {step < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} size="lg" showArrow>
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              showArrow={status !== "submitting"}
              loading={status === "submitting"}
              loadingLabel="Sending brief"
            >
              Send brief
            </Button>
          )}
        </div>
      </div>

      <p className="mt-5 text-[11px] text-faint">
        By sending a brief you agree to our{" "}
        <Link to="/privacy" className="link-underline hover:text-bone">
          privacy policy
        </Link>
        . We reply within two business days.
      </p>
    </form>
  );
}
