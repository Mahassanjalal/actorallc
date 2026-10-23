import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render as renderServer } from "@/entry-server";
import { App } from "@/App";

let root: Root | null = null;

describe("hydration", () => {
  afterEach(async () => {
    await act(async () => {
      root?.unmount();
    });
    root = null;
    document.body.innerHTML = "";
  });

  it("hydrates the prerendered homepage without mismatch errors", async () => {
    window.history.replaceState({}, "", "/");
    const container = document.createElement("div");
    container.innerHTML = renderServer("/");
    document.body.appendChild(container);

    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
      errors.push(args);
    });

    await act(async () => {
      root = hydrateRoot(
        container,
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve, 60));
    });

    const hydrationErrors = errors.filter((entry) =>
      JSON.stringify(entry).toLowerCase().includes("hydration"),
    );
    spy.mockRestore();

    expect(hydrationErrors).toEqual([]);
    expect(container.textContent).toContain("We design what");
    expect(document.title).toBe(
      "Actora — Design and technology studio in Austin, Texas",
    );
  });

  it("hydrates an article route with matching markup", async () => {
    window.history.replaceState({}, "", "/insights/restraint-is-a-feature");
    const container = document.createElement("div");
    container.innerHTML = renderServer("/insights/restraint-is-a-feature");
    document.body.appendChild(container);

    const errors: unknown[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
      errors.push(args);
    });

    await act(async () => {
      root = hydrateRoot(
        container,
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>,
      );
      await new Promise((resolve) => setTimeout(resolve, 60));
    });

    const hydrationErrors = errors.filter((entry) =>
      JSON.stringify(entry).toLowerCase().includes("hydration"),
    );
    spy.mockRestore();

    expect(hydrationErrors).toEqual([]);
    expect(container.textContent).toContain("Restraint is a feature");
  });
});
