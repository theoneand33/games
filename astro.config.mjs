// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/data/site.ts";

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: "never",
  // Slug variants live in vercel.json as real 301s; a redirect here would ship a
  // meta-refresh page that the host never serves. check-pages guards both.
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
