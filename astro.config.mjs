// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Add your site URL here - replace with your actual domain
  site: "https://unblocked-games.vercel.app/",
  webAnalytics: {
    enabled: true, // set to false when using @vercel/analytics@1.4.0
  },
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
