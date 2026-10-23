import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return { ...actual, submitInquiry: vi.fn() };
});

import { ApiError, submitInquiry } from "@/lib/api";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ThankYou } from "@/pages/ThankYou";

const mockedSubmit = vi.mocked(submitInquiry);

function renderForm() {
  return render(
    <MemoryRouter initialEntries={["/contact"]}>
      <Routes>
        <Route path="/contact" element={<InquiryForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillValidContact() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/^Name/), "Ada Lovelace");
  await user.type(screen.getByLabelText(/Business email/), "ada@example.com");
  await user.type(
    screen.getByLabelText(/How can we help/),
    "We are launching a new platform and need a brand and product system.",
  );
  await user.click(screen.getByRole("checkbox"));
  return user;
}

describe("InquiryForm", () => {
  beforeEach(() => {
    mockedSubmit.mockReset();
    window.sessionStorage.clear();
  });

  it("shows inline validation and does not call the API with invalid data", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /Send message/ }));

    expect(await screen.findByText(/A business email is required/)).toBeVisible();
    expect(screen.getByText(/Please share your name/)).toBeVisible();
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it("only shows the confirmation after the server confirms submission", async () => {
    mockedSubmit.mockResolvedValue({ id: "ACT-TEST-1234" });
    renderForm();

    const user = await fillValidContact();
    await user.click(screen.getByRole("button", { name: /Send message/ }));

    expect(await screen.findByText(/It arrived/i)).toBeVisible();
    expect(screen.getByText(/ACT-TEST-1234/)).toBeVisible();
    expect(mockedSubmit).toHaveBeenCalledTimes(1);
    expect(mockedSubmit.mock.calls[0][0]).toMatchObject({
      kind: "contact",
      name: "Ada Lovelace",
      email: "ada@example.com",
      consent: true,
    });
  });

  it("surfaces a failure and never pretends the message was sent", async () => {
    mockedSubmit.mockRejectedValue(
      new ApiError("server", "We could not deliver your message."),
    );
    renderForm();

    const user = await fillValidContact();
    await user.click(screen.getByRole("button", { name: /Send message/ }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/Your message was not sent/i);
    expect(alert).toHaveTextContent(/We could not deliver your message/i);
    expect(screen.queryByText(/It arrived/i)).not.toBeInTheDocument();
  });

  it("preserves the typed message after a failure", async () => {
    mockedSubmit.mockRejectedValue(
      new ApiError("network", "We could not reach the form service."),
    );
    renderForm();

    const user = await fillValidContact();
    await user.click(screen.getByRole("button", { name: /Send message/ }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/How can we help/)).toHaveValue(
      "We are launching a new platform and need a brand and product system.",
    );
  });
});
