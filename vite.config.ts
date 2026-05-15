import { defineConfig } from "vite";
import { tanstackBuildConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

export default defineConfig({
  ...tanstackBuildConfig,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  }
});
