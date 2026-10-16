import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// The classic dashboard lives under /v1 on thornode.network (the new dashboard owns /).
export default defineConfig({
  base: "/v1/",
  plugins: [react()],
  build: {
    sourcemap: false,
    assetsInlineLimit: 0,
  },
  test: {
    environment: "node",
  },
});
