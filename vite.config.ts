import { defineConfig } from "vite";
import { tanstackBuildConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";

export default defineConfig({
  ...tanstackBuildConfig,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
