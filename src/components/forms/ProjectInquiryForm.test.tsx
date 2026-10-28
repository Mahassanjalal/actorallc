import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return { ...actual, submitInquiry: vi.fn() };
});

import { submitInquiry } from "@/lib/api";
import { ProjectInquiryForm } from "@/components/forms/ProjectInquiryForm";
import { ThankYou } from "@/pages/ThankYou";

const mockedSubmit = vi.mocked(submitInquiry);

function renderWizard(url = "/start-a-project?service=brand-identity") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/start-a-project" element={<ProjectInquiryForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProjectInquiryForm", () => {
  beforeEach(() => {
    mockedSubmit.mockReset();
  });

  it("prefills the project type from the requested service", () => {
    renderWizard();
    expect(
      screen.getByRole("radio", { name: /Brand & identity/ }),
    ).toBeChecked();
  });

  it("blocks progress until required fields on the current step are valid", async () => {
    const user = userEvent.setup();
    renderWizard();

    await user.click(screen.getByRole("button", { name: /Continue/ }));

    expect(await screen.findByText(/Choose a budget range/)).toBeVisible();
    expect(screen.getByText(/when you would like to start/)).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /What are we building/ }),
    ).toBeInTheDocument();
  });

  it("validates the brief before allowing contact details", async () => {
    const user = userEvent.setup();
    renderWizard();

    await user.selectOptions(screen.getByLabelText(/Budget range/), "$40,000 – $80,000");
    await user.selectOptions(screen.getByLabelText(/Desired timeline/), "Within 3–4 months");
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    expect(
      await screen.findByRole("heading", { name: /Tell us about the brief/ }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect(
      await screen.findByText(/at least 20 characters/),
    ).toBeVisible();
  });

  it("submits a complete brief and confirms only after the API responds", async () => {
    mockedSubmit.mockResolvedValue({ id: "ACT-PROJECT-01" });
    const user = userEvent.setup();
    renderWizard("/start-a-project");

    await user.click(screen.getByRole("radio", { name: "Website or platform" }));
    await user.selectOptions(screen.getByLabelText(/Budget range/), "$80,000 – $150,000");
    await user.selectOptions(screen.getByLabelText(/Desired timeline/), "Within 1–2 months");
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    await user.type(screen.getByLabelText(/^Company/), "Northlight Labs");
    await user.type(
      screen.getByLabelText(/Project description/),
      "We need a new marketing site and a design system for our platform launch.",
    );
    await user.click(screen.getByRole("button", { name: /Continue/ }));

    await user.type(screen.getByLabelText(/^Name/), "Grace Hopper");
    await user.type(screen.getByLabelText(/Business email/), "grace@example.com");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /Send brief/ }));

    expect(await screen.findByText(/It arrived/i)).toBeVisible();
    expect(mockedSubmit).toHaveBeenCalledTimes(1);
    expect(mockedSubmit.mock.calls[0][0]).toMatchObject({
      kind: "project",
      projectType: "Website or platform",
      budget: "$80,000 – $150,000",
      timeline: "Within 1–2 months",
      company: "Northlight Labs",
      name: "Grace Hopper",
      email: "grace@example.com",
      consent: true,
    });
  });

  it("returns to the step with an error when contact details are missing", async () => {
    const user = userEvent.setup();
    renderWizard("/start-a-project");

    await user.click(screen.getByRole("radio", { name: "Brand & identity" }));
    await user.selectOptions(screen.getByLabelText(/Budget range/), "Not sure yet");
    await user.selectOptions(screen.getByLabelText(/Desired timeline/), "Still exploring");
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await user.type(
      screen.getByLabelText(/Project description/),
      "A complete rebrand for a company preparing to launch a new product.",
    );
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await user.click(screen.getByRole("button", { name: /Send brief/ }));

    expect(await screen.findByText(/Please share your name/)).toBeVisible();
    expect(mockedSubmit).not.toHaveBeenCalled();
  });
});
