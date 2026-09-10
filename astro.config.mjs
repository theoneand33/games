// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: "https://unblocked-games.vercel.app",
  trailingSlash: "never",
  // Slug variants that Google still serves impressions for — consolidate to canonical slugs.
  redirects: {
    "/games/happywheels": "/games/happy-wheels",
    "/games/run3": "/games/run-3",
    "/games/gun-mayhem2": "/games/gun-mayhem-2",
    "/games/geography-game": "/games/geography-game-usa",
    "/games/tetris/": "/games/tetris",
    "/games/clicker-heroes/": "/games/clicker-heroes",
    "/games/fleeing-the-complex/": "/games/fleeing-the-complex",
    "/games/breaking-the-bank/": "/games/breaking-the-bank",
    "/games/hobo-5-space-brawls/": "/games/hobo-5-space-brawls",
    "/games/super-mario-flash/": "/games/super-mario-flash",
    "/games/strike-force-heroes/": "/games/strike-force-heroes",
  },
  integrations: [
    sitemap({
      namespaces: { news: false, xhtml: false, image: true, video: false },
    }),
  ],
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
