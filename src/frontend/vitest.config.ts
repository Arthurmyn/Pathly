import path from "node:path";
import { defineConfig } from "vitest/config";

// The unit tests live in the repository-level tests/ folder, next to the backend tests.
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { include: ["../../tests/frontend/**/*.test.ts"], environment: "node" },
});
