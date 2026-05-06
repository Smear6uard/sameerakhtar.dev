import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// `nitro()` is the build engine TanStack Start uses for production output.
// On Vercel, Nitro auto-detects the environment via VERCEL=1 and emits
// `.vercel/output/` in the Build Output API v3 format. The companion
// `vercel.json` pins the framework preset to `tanstack-start` and the
// build command to `vite build`, since this project doesn't declare
// `@tanstack/router-plugin` directly (which is what Vercel's auto-detection
// keys off) and would otherwise fall through to the plain Nitro preset.
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
