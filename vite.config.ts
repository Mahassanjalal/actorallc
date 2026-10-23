import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // GitHub Pages project sites are served from /<repository>/.
  // Set VITE_BASE_PATH=/repo-name/ in CI, or "/" for a custom domain.
  const base = env.VITE_BASE_PATH || "/";

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
    },
    build: {
      target: "es2022",
      sourcemap: false,
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: false,
      restoreMocks: true,
    },
  };
});
