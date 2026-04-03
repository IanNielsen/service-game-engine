import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "node20",
    outDir: "dist",
    ssr: "src/server.ts",
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
});
