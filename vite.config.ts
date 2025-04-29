// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";

import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [react(), reactVirtualized()],
  test: {
    environment: "jsdom",
    globals: true, // allows you to use `describe`, `it`, `expect` without importing
    setupFiles: "./src/setupTests.ts", // (optional) if you want to set up custom things like jest-dom matchers
  },
});

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
export function reactVirtualized(): Plugin {
  return {
    name: "flat:react-virtualized",
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved() {
      const require = createRequire(import.meta.url);
      const file = require
        .resolve("react-virtualized")
        .replace(
          path.join("dist", "commonjs", "index.js"),
          path.join("dist", "es", "WindowScroller", "utils", "onScroll.js")
        );
      const code = fs.readFileSync(file, "utf-8");
      const modified = code.replace(WRONG_CODE, "");
      fs.writeFileSync(file, modified);
    },
  };
}
