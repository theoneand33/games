# AGENTS.md - How to Change This Codebase

You change code. This doc tells you how to do it right. Keep your style concise and direct. Do not add fluff. The user overrides any preference in this doc.

## 1. Glossary

Use these names. Do not invent synonyms.

- **User** = the person who plays games on the site.
- **Slug** = kebab-case URL segment under `/games/` (example: `breaking-the-bank`). The slug is the key in `gamesMap`.
- **Game entry** = one record in `src/data/game-seo.ts` (`title`, `description`, `image`, `genre`, `year`, `isFlash`, `gamePath`, optional `guide`).
- **Flash game** = `.swf` file that runs through Ruffle.
- **HTML5 game** = standalone page with its own bundle.

## 2. What Makes This Project Special: Do Not Break

- **Static first.** Astro builds to static HTML. Do not add a server, database, or runtime API.
- **Ruffle for Flash.** All Flash games use `public/ruffle/` and `src/components/flash.astro`. Do not replace Ruffle. Do not add a second emulator.
- **No React.** The project removed `@astrojs/react`. Do not add React, Vue, or Svelte.
- **SEO is a feature.** `src/data/game-seo.ts` drives `layout.astro` meta tags and JSON-LD. Do not bypass it.
- **Performance matters.** Keep pages light. Do not add large client JS or heavy dependencies.
- **Vercel deploy.** The build runs `bun scripts/generate-llms.ts`, then `astro build`, then `bunx pagefind --site dist`. Do not add Cloudflare or other hosts.

## 3. How to Change the Codebase

### 3.1 Commands: Use `bun`, Not `npm`

| Do this         | Do not do this                 |
| --------------- | ------------------------------ |
| `bun install`   | `npm install`                  |
| `bun add <pkg>` | `npm install <pkg>`            |
| `bun run dev`   | `npm run dev`                  |
| `bun run check` | `astro check` alone            |
| `bun run lint`  | `npx prettier --check .` alone |

Gotchas:

- `bun run check` runs `git lfs pull`, then `astro check`, then `bun run build` (which regenerates `llms.txt`, builds, and runs pagefind). The command is slow. Wait for it to complete.
- `bun run lint` runs `prettier --check .`. To fix format, run `bunx prettier --write .`.
- Tailwind is v4 via `@tailwindcss/vite`. Global styles live in `src/styles/styles.css` (imported by `layout.astro`). Do not create `tailwind.config.js`. That file has no effect.

### 3.2 Verify After Every Change

1. Run `bun run check`.
2. Run `bun run lint`.
3. If a check fails, fix the error before you commit.

### 3.3 Add a New Game

Follow these steps in order.

1. Put the `.swf` in `public/flash/`. Use lowercase and no spaces. Example: `bloonstd5.swf`.
2. Put the cover image in `public/images/`. Use about 300x200. Example: `bloonstd5cover.webp`.
3. Add one entry to `gamesMap` in `src/data/game-seo.ts`. Key the entry by slug. Set `isFlash: true` and `gamePath: "/flash/<file>.swf"`.
4. Add the slug to `defaultGames` in `src/data/game-seo.ts`. Place it by popularity tier, not at the end. See tiers below.
5. Run `bun run llms` to regenerate `public/llms.txt` from `game-seo.ts`.

Use absolute asset paths. Bad: `gamePath: "flash/mygame.swf"`. Good: `gamePath: "/flash/mygame.swf"`.

If the game is HTML5 and not Flash, add a branch in `src/pages/games/[slug].astro` instead of a new page. Copy the `run-3` branch for a vendored bundle (set `<base href="...">`, load the script with `is:inline`) or the `webtris` branch for an iframe. Set `isFlash: false`. Do not use the `Flash` component.

### 3.4 How Pages Work

- `src/data/game-seo.ts` is the single source of truth. The `title` field holds the display name.
- `src/layout/layout.astro` takes `slug` and reads `gamesMap[slug]` to build `<title>`, meta tags, Open Graph, and JSON-LD. For the home page, set `isHome={true}`.
- `src/pages/games/[slug].astro` serves every slug in `gamesMap` (`getStaticPaths` maps all keys; unknown slugs return 404). The template branches on `isFlash`, with special branches for `run-3` and `webtris`. Do not create per-game pages.
- `run-3` is the vendored HTML5 exception (`public/games/run3/`, loaded with `<base href="/games/run3/">`). `webtris` stays an external iframe (`https://theoneand33.github.io/webtris/`), do not vendor it.
- `src/pages/index.astro` renders `defaultGames` via `<Gametile>`. The array order is the display order. The "Popular" links are the first `POPULAR_COUNT` entries (currently 11), keep them in sync. Game pages show a "More Games" row of `MORE_GAMES_COUNT` entries (currently 9, same-genre first) built in `layout.astro`.
- `astro.config.mjs` holds slug-variant redirects (for example `/games/run3` → `/games/run-3`). When you rename or add an alias slug, add a redirect there.

### 3.5 Popularity Tiers

Insert the slug by popularity, most popular first. Keep series entries together as a block. The array order is the display order.

## 4. Hard rules: Do Not Do These

- **Do not kill the wrong process.** Check the process list before you kill a process. Kill only the PID you started.
- **Do not file draft PRs.** Create PRs as ready for review. Create a draft only if the user asks for a draft.
- **Do not make unasked edits.** Edit only the files that the task requires. Do not reformat unrelated files. Do not rename slugs.
- **Do not scope-creep a PR.** Use one PR per task. Do not mix a game addition with a layout refactor.
- **Do not edit build output.** Do not edit `dist/`, `.astro/`, `node_modules/`, `public/ruffle/`, or `public/games/run3/`. Edit them only to update that vendored bundle.
- **Do not use colored gradients.** The only exception is the site logo (`public/images/games_logo_light.svg` and logo concept files).

## 5. Where Not to Look

Skip these to save context. They rarely need changes. `node_modules/` is dependencies. `astro.config.mjs` is static config except its `redirects` map (slug variants, see 3.4).
