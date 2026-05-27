# Instructions for agents

## Package manager

This project uses **bun** as its package manager. Always use `bun` instead of `npm`, `yarn`, or `pnpm` for any package-related commands.

- `bun install` — install dependencies
- `bun run <script>` — run a script from package.json (e.g., `bun run dev`, `bun run build`)
- `bun add <package>` — add a dependency
- `bun add -d <package>` — add a dev dependency
- `bun remove <package>` — remove a dependency
- `bun update` — update dependencies
- `bun <script>` — shorthand for running scripts

## Project structure

```
├── src/
│   ├── components/       Reusable Astro components (e.g., gametile)
│   ├── layout/           Page layouts (base layout (used for game pages) and home layout mostly)
│   ├── pages/            Route pages (index, game pages, DMCA)
│   │   └── games/        Individual game pages (one .astro per game)
│   └── styles/           Global CSS (Tailwind v4)
├── public/
│   ├── flash/            .swf files for Flash games
│   ├── images/           Cover art and logo assets
│   └── ruffle/           Ruffle WebAssembly Flash emulator
├── scripts/              Build helper scripts (fix-viewtransitions)
├── astro.config.mjs      Astro config (prefetch, sitemap, React, Tailwind)
├── tailwind.config.cjs   Tailwind v3 config
├── postcss.config.cjs    PostCSS config for Tailwind
├── tsconfig.json         TypeScript config (strict, JSX for React)
├── wrangler.jsonc        Cloudflare Workers config (static assets from dist/)
└── package.json          Dependencies and scripts
```

- **Astro** — static site generator; pages are `.astro` files under `src/pages/`
- **Tailwind CSS v4** — utility-first CSS (via `@tailwindcss/vite`)
- **React** — used via `@astrojs/react` integration
- **Ruffle** — Flash emulator running in-browser via WebAssembly (serves `.swf` files)
- **Vercel Analytics & Speed Insights** — tracking and performance monitoring
- **Cloudflare Workers** — deployment target (via `wrangler.jsonc`)
