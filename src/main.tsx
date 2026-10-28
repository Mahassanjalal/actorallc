import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/instrument-sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@/styles/index.css";
import { App } from "@/App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root is missing from index.html.");
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const tree = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Hydrate prerendered routes; fall back to a client render in dev.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
