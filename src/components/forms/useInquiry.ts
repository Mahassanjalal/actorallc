import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, submitInquiry, type InquiryKind } from "@/lib/api";
import {
  hasErrors,
  validateInquiry,
  type FieldErrors,
  type InquiryFields,
} from "@/lib/validation";

export type SubmitStatus = "idle" | "submitting" | "error";

export interface SubmitOutcome {
  ok: boolean;
  errors: FieldErrors;
}

/**
 * Shared submission logic. The success screen is only reached after the API
 * confirms the submission; failures surface inline and never look like success.
 */
export function useInquiry(kind: InquiryKind) {
  const navigate = useNavigate();
  const startedAt = useRef(0);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(values: InquiryFields): Promise<SubmitOutcome> {
    const errors = validateInquiry(values, kind);
    if (hasErrors(errors)) {
      return { ok: false, errors };
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const receipt = await submitInquiry({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
        kind,
        website: honeypot,
        elapsedMs: Math.max(0, Date.now() - startedAt.current),
        page:
          typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : "/",
      });

      navigate("/thank-you", {
        replace: true,
        state: {
          kind,
          name: values.name.trim().split(/\s+/)[0],
          id: receipt.id,
        },
      });
      return { ok: true, errors: {} };
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Something unexpected happened. Please email us directly.",
      );
      return { ok: false, errors: {} };
    }
  }

  function reset() {
    setStatus("idle");
    setErrorMessage("");
  }

  return {
    status,
    errorMessage,
    submit,
    reset,
    honeypot,
    setHoneypot,
  };
}

/** Moves focus to the first invalid control after a failed validation pass. */
export function focusFirstError(prefix: string, errors: FieldErrors): void {
  const order: Array<keyof InquiryFields> = [
    "name",
    "email",
    "company",
    "phone",
    "projectType",
    "budget",
    "timeline",
    "message",
    "consent",
  ];
  const first = order.find((field) => Boolean(errors[field]));
  if (!first) return;
  const element = document.getElementById(`${prefix}-${first}`);
  if (element instanceof HTMLElement) {
    element.focus({ preventScroll: false });
    element.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

