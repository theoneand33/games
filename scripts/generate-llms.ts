// ponytail: llms.txt is generated from game-seo.ts — never hand-edit it.
// Usage: bun run llms (also runs automatically in build, before astro build)
import { writeFileSync } from "node:fs";
import { gamesMap, defaultGames, POPULAR_COUNT } from "../src/data/game-seo.ts";

const site = "https://unblocked-games.vercel.app";
// ponytail: fixed date keeps builds stable; bump manually when the catalog changes
const lastUpdated = "2026-09-11";

const line = (slug: string) =>
  `- ${gamesMap[slug].title}: ${site}/games/${slug}`;

const popular = defaultGames.slice(0, POPULAR_COUNT).map(line).join("\n");

const all = Object.keys(gamesMap)
  .sort((a, b) => gamesMap[a].title.localeCompare(gamesMap[b].title))
  .map(line)
  .join("\n");

const out = `# Superfun Games - Unblocked Games for School Chromebook
> A curated collection of classic Flash games and browser games that work without Flash Player, updated for 2026. All games run directly in your browser using modern emulation (Ruffle for Flash content). Optimized for school Chromebooks.

## Site info
- Homepage: ${site}
- Language: English
- Last updated: ${lastUpdated}
- Platforms: Works on all devices including Chrome OS / Chromebook

## Popular games
${popular}

## All game pages
${all}

## About
Superfun Games provides free unblocked access to classic Flash games and browser games that are no longer playable through normal means since Adobe Flash was discontinued in 2020. All Flash games run through the Ruffle emulator, which is a WebAssembly-based Flash Player replacement that works in modern browsers without any plugins or downloads.

## Target audience
Students at school who want to play games on their school-issued Chromebooks. All games are carefully selected to work within school network restrictions and require no installations or special permissions.

## DMCA
${site}/dmca
`;

writeFileSync("public/llms.txt", out);
console.log(`llms.txt: wrote ${Object.keys(gamesMap).length} games.`);
