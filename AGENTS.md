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

## Project structure — detailed

```
├── src/
│   ├── components/            Reusable Astro components
│   │   ├── gametile.astro     Homepage game tile card (link + cover image + name)
│   │   └── flash.astro        Ruffle Flash emulator embed (polling-based loader)
│   ├── data/
│   │   └── game-seo.ts        Central registry: all games with SEO metadata + lookup helper
│   ├── layout/
│   │   └── layout.astro       Main layout — used by BOTH home page and game pages (behaves differently based on isHome / Game props)
│   ├── pages/
│   │   ├── index.astro        Home page — lists all games via <Gametile> components
│   │   ├── dmca.astro         DMCA takedown notice page
│   │   └── games/             One .astro file per game (50+ game pages)
│   └── styles/
│       └── styles.css         Global CSS + Tailwind v4 import + .games-grid/.game-tile
├── public/
│   ├── flash/                 All .swf files for Flash games (51 files)
│   ├── games/run3/            HTML5 game bundle for Run 3 (index.html, JS, assets)
│   ├── images/                Cover art (JPEG/PNG/AVIF/WEBP), logos, favicon
│   ├── ruffle/                Ruffle WebAssembly Flash emulator (ruffle.js + .wasm)
│   ├── robots.txt             Blocks /flash/ from crawlers, links to llms.txt + sitemap
│   ├── llms.txt               AI-friendly site summary (llmstxt.org format)
│   └── *.txt                  Domain verification file for search consoles
├── astro.config.mjs           Astro v6 config (prefetch, sitemap, Tailwind v4 via Vite)
├── tsconfig.json              TypeScript strict mode (extends astro/tsconfigs/strict)
├── wrangler.jsonc             Cloudflare Workers config (serves dist/ as static assets)
└── package.json               Dependencies: astro, tailwindcss v4, vercel analytics, etc.
```

## Where to look / what matters

### Game pages: the main pattern

Every game has an `.astro` page under `src/pages/games/`. There are **two patterns**:

**Pattern A — Flash games (90% of games):**

```astro
---
const Game = "Happy Wheels";
import Layout from "../../layout/layout.astro";
import Flash from "../../components/flash.astro";
const gamePath = "/flash/happywheels.swf";
---
<Layout Game={Game}>
  <div style="text-align: center">
    <div id="container" style="border: #ccc 0px solid; height: 100%; width: 100%; min-height: 96vh;">
    </div>
    <Flash gamePath={gamePath} />
  </div>
</Layout>
```

The `Flash` component handles Ruffle loading (polling loop). The layout auto-reads SEO from `game-seo.ts` via `Game` prop.

**Pattern B — HTML5 games (Run 3 only currently):**

```astro
---
const Game = "Run 3";
import Layout from "../../layout/layout.astro";
---
<Layout Game={Game}>
  <base href="/games/run3/" />
  <div id="run3-wrapper">...</div>
  <script src="/games/run3/Run3.js" is:inline></script>
</Layout>
```

These directly load their own JS. No `Flash` component. No `.swf` file needed.

**The only non-Flash HTML5 game in the project is Run 3.** All others use the Flash pattern.

### How to add a new game

1. **Get the `.swf` file** — place it in `public/flash/` (named like `gamename.swf`)
2. **Get a cover image** — place it in `public/images/` (ideally 300x200-ish, any format)
3. **Register in `src/data/game-seo.ts`** — add entry to `gamesMap` with full SEO metadata, including `isFlash: true/false`
4. **Create the game page** — `src/pages/games/game-slug.astro` using the Flash pattern above (or HTML5 pattern if applicable)
5. **Add to homepage** — add entry to the `games` array in `src/pages/index.astro`
6. **Update `public/llms.txt`** — add the game URL to the list

### The SEO system (how layout.astro + game-seo.ts work together)

- `game-seo.ts` exports `gamesMap: Record<string, GameSEO>` — one entry per game keyed by full display name (e.g., `"Happy Wheels"`).
- `layout.astro` receives a `Game` prop (string), calls `getGameSEO(Game)` to look up SEO data.
- The layout then generates: `<title>`, `<meta description/keywords>`, Open Graph tags, Twitter Card tags, JSON-LD structured data (BreadcrumbList + VideoGame for game pages, WebSite + CollectionPage + Organization for home).
- There is also `layout-home.astro` which is a now-duplicate of parts of `layout.astro`. **Do NOT use `layout-home.astro` for anything new** — use `layout.astro` with `isHome={true}` instead. `layout-home.astro` exists only for legacy reasons and should eventually be removed.

### Home page mechanics

`src/pages/index.astro`:

- Uses `Layout` with `isHome={true}` and `pageTitle`.
- Iterates over a `games` array and renders `<Gametile>` for each.
- Each `Gametile` takes `Game` (display name), `Path` (slug), `Image` (cover path).
- The `games` array order determines display order on the page.
- Has inline "Popular" links hardcoded. If you add a game, add it to the array here.

### File naming conventions

| Artifact                 | Convention                                          | Example                                     |
| ------------------------ | --------------------------------------------------- | ------------------------------------------- |
| Game page .astro         | `kebab-case.astro`                                  | `happywheels.astro`, `super-mario-63.astro` |
| .swf in public/flash/    | Lowercase, no spaces, match page slug               | `happywheels.swf`, `super-mario-63.swf`     |
| Cover image              | Match game name, any format                         | `happywheelscover.jpeg`, `sm63-cover.png`   |
| slug in index.astro Path | Must match actual .astro filename (minus extension) | `/games/happywheels`                        |
| game-seo.ts key          | Exact display name (title case)                     | `"Super Mario 63"`                          |

There are some historical inconsistencies in naming that should be fixed (e.g., `bloonstd5` instead of `bloons-td-5`). Follow existing patterns when adding new games.

### Git commits

When committing, always load and follow the **git-commit** skill from `~/.agents/skills/git-commit/SKILL.md`. It handles conventional commit messages, intelligent staging, and message generation from the diff.

## Where NOT to look (save tokens)

These directories and files are **generated / boilerplate / irrelevant** for most tasks:

| Path                 | Why skip                                                                 |
| -------------------- | ------------------------------------------------------------------------ |
| `dist/`              | Build output — never manually inspect or edit                            |
| `.astro/`            | Generated TypeScript types — never edit                                  |
| `node_modules/`      | Dependencies — never relevant                                            |
| `public/ruffle/`     | Vendored WASM binary — never modify don't read, read ruffle docs instead |
| `public/games/run3/` | Vendored HTML5 game bundle — never modify (unless updating Run 3 itself) |
| `wrangler.jsonc`     | Static config (Cloudflare Workers) — rarely changes                      |
| `astro.config.mjs`   | Static Astro config — rarely changes                                     |
| `tsconfig.json`      | Standard strict TS config — rarely changes                               |
| `.gitignore`         | Standard ignores — rarely changes                                        |

## Quick reference — key files by task

| Task                        | File(s) to edit                                                                                      |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Add a new game              | `src/data/game-seo.ts` + new `src/pages/games/*.astro` + `src/pages/index.astro` + `public/llms.txt` |
| Fix SEO for a game          | `src/data/game-seo.ts`                                                                               |
| Change homepage layout      | `src/pages/index.astro`                                                                              |
| Change global layout/SEO    | `src/layout/layout.astro` (NOT layout-home.astro)                                                    |
| Change game tile appearance | `src/components/gametile.astro`                                                                      |
| Change Flash/Ruffle loading | `src/components/flash.astro`                                                                         |
| Change global styles        | `src/styles/styles.css`                                                                              |
| Change deployment           | `wrangler.jsonc` or `package.json` scripts                                                           |
| Add/edit dependency         | `bun add <package>` (not npm)                                                                        |

## Technology stack

- **Astro v6** — static site generator; pages are `.astro` files under `src/pages/`
- **Tailwind CSS v4** — utility-first CSS (via `@tailwindcss/vite` plugin in `astro.config.mjs`)
- **Ruffle** — Flash emulator running in-browser via WebAssembly (ships `ruffle.js` + `.wasm` under `public/ruffle/`)
- **Vercel Analytics & Speed Insights** — tracking and performance monitoring (injected in layout)
- **Cloudflare Workers** — deployment target (serves `dist/` as static assets via `wrangler.jsonc`) - not really being used
- **No React** — `@astrojs/react` was removed; zero React components exist
- **Astro prefetch** — enabled globally for faster page transitions (uses `data-astro-prefetch` on links)
- **Vercel** — also configured in `package.json` - being used
