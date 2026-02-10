// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: "https://unblocked-games.vercel.app/",
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
