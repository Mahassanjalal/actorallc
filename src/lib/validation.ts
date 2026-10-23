import type { InquiryKind } from "@/lib/api";

export const PROJECT_TYPES = [
  "Brand & identity",
  "Digital product",
  "Website or platform",
  "Film & motion",
  "Something else",
] as const;

export const BUDGET_RANGES = [
  "Not sure yet",
  "Under $15,000",
  "$15,000 – $40,000",
  "$40,000 – $80,000",
  "$80,000 – $150,000",
  "$150,000+",
] as const;

export const TIMELINES = [
  "As soon as possible",
  "Within 1–2 months",
  "Within 3–4 months",
  "Later this year",
  "Still exploring",
] as const;

export interface InquiryFields {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  consent: boolean;
}

export interface InquirySubmission extends InquiryFields {
  kind: InquiryKind;
  /** Honeypot — must stay empty. */
  website: string;
  /** Milliseconds since the form mounted; the server rejects instant posts. */
  elapsedMs: number;
  page: string;
}

export type FieldErrors = Partial<Record<keyof InquiryFields, string>>;

export const emptyInquiry: InquiryFields = {
  name: "",
  email: "",
  company: "",
  phone: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  consent: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiry(
  values: Partial<InquiryFields>,
  kind: InquiryKind,
): FieldErrors {
  const errors: FieldErrors = {};
  const name = (values.name ?? "").trim();
  const email = (values.email ?? "").trim();
  const company = (values.company ?? "").trim();
  const phone = (values.phone ?? "").trim();
  const message = (values.message ?? "").trim();

  if (name.length < 2) {
    errors.name = "Please share your name (at least 2 characters).";
  } else if (name.length > 120) {
    errors.name = "Please keep your name under 120 characters.";
  }

  if (!email) {
    errors.email = "A business email is required.";
  } else if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address, for example name@company.com.";
  }

  if (company.length > 160) {
    errors.company = "Please keep the company name under 160 characters.";
  }

  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 20) {
      errors.phone = "Enter a phone number with 7–20 digits, or leave it blank.";
    }
  }

  if (message.length < 10) {
    errors.message = "Tell us a little more — at least 10 characters.";
  } else if (message.length > 5000) {
    errors.message = "Please keep the description under 5,000 characters.";
  }

  if (kind === "project") {
    if (message.length < 20) {
      errors.message = "Please describe the project in at least 20 characters.";
    }
    if (!values.projectType) {
      errors.projectType = "Choose the closest project type.";
    }
    if (!values.budget) {
      errors.budget = "Choose a budget range, even if it is approximate.";
    }
    if (!values.timeline) {
      errors.timeline = "Let us know roughly when you would like to start.";
    }
  }

  if (!values.consent) {
    errors.consent = "Please confirm you agree to the privacy policy.";
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function firstErrorField(errors: FieldErrors): keyof InquiryFields | null {
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
  return order.find((field) => Boolean(errors[field])) ?? null;
}
