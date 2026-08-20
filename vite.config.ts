import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({ prerender: { enabled: true } }),
    viteReact(),
  ],
  resolve: { tsconfigPaths: true },
});

export default config;
