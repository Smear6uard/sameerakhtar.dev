import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// `nitro()` is the build engine TanStack Start uses for production output.
// When the build runs on Vercel, Nitro auto-detects the Vercel environment
// and emits `.output/` in the format Vercel expects — no vercel.json needed.
// (Local `vercel build` / Vercel CLI also works without extra config.)
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    nitro(),
  ],
});
