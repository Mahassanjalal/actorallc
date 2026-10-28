import { describe, expect, it } from "vitest";
import {
  emptyInquiry,
  firstErrorField,
  hasErrors,
  validateInquiry,
} from "@/lib/validation";

const valid = {
  ...emptyInquiry,
  name: "Ada Lovelace",
  email: "ada@analytical.engine",
  message: "We need a brand and product system for a new platform launch.",
  consent: true,
};

describe("validateInquiry", () => {
  it("accepts a valid contact inquiry", () => {
    expect(validateInquiry(valid, "contact")).toEqual({});
  });

  it("requires name, email, message and consent", () => {
    const errors = validateInquiry({}, "contact");
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.message).toBeTruthy();
    expect(errors.consent).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
  });

  it("rejects malformed emails and overly short messages", () => {
    const errors = validateInquiry(
      { ...valid, email: "not-an-email", message: "Hi" },
      "contact",
    );
    expect(errors.email).toContain("valid email");
    expect(errors.message).toContain("at least 10");
  });

  it("allows an empty optional phone but validates a supplied one", () => {
    expect(validateInquiry({ ...valid, phone: "" }, "contact")).toEqual({});
    expect(
      validateInquiry({ ...valid, phone: "123" }, "contact").phone,
    ).toBeTruthy();
    expect(
      validateInquiry({ ...valid, phone: "+1 (512) 555-0142" }, "contact"),
    ).toEqual({});
  });

  it("requires project type, budget and timeline for project briefs", () => {
    const errors = validateInquiry(valid, "project");
    expect(errors.projectType).toBeTruthy();
    expect(errors.budget).toBeTruthy();
    expect(errors.timeline).toBeTruthy();
    expect(errors.message).toBeUndefined();
  });

  it("accepts a complete project brief", () => {
    const errors = validateInquiry(
      {
        ...valid,
        projectType: "Website or platform",
        budget: "$40,000 – $80,000",
        timeline: "Within 3–4 months",
      },
      "project",
    );
    expect(errors).toEqual({});
  });

  it("enforces maximum lengths", () => {
    const errors = validateInquiry(
      { ...valid, name: "a".repeat(121), company: "b".repeat(161) },
      "contact",
    );
    expect(errors.name).toContain("120");
    expect(errors.company).toContain("160");
  });

  it("reports the first field to focus in visual order", () => {
    expect(firstErrorField({ message: "x", email: "y" })).toBe("email");
    expect(firstErrorField({})).toBeNull();
  });
});
