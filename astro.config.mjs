// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Add your site URL here - replace with your actual domain
  site: "https://unblocked-games.vercel.app/",

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
