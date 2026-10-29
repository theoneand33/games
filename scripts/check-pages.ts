// ponytail: fail the build if a game page is missing, redirected, lacks its assets,
// or is shadowed by a vercel.json redirect
import { existsSync, readFileSync } from "node:fs";
import { gamesMap, defaultGames } from "../src/data/game-seo.ts";
import { SITE } from "../src/data/site.ts";

// non-Flash slugs need a hand-written branch in games/[slug].astro
const HTML5_BRANCHES = ["run-3", "webtris"];
const problems: string[] = [];

for (const [slug, game] of Object.entries(gamesMap)) {
  const page = `dist/games/${slug}/index.html`;
  if (
    !existsSync(page) ||
    readFileSync(page, "utf8").includes("Redirecting to")
  )
    problems.push(`${slug}: page missing or redirected`);
  if (!existsSync(`public${game.image}`))
    problems.push(`${slug}: missing cover ${game.image}`);
  if (game.gamePath && !existsSync(`public${game.gamePath}`))
    problems.push(`${slug}: missing game file ${game.gamePath}`);
  if (!game.isFlash && !HTML5_BRANCHES.includes(slug))
    problems.push(
      `${slug}: non-Flash game needs a branch in games/[slug].astro and an entry in HTML5_BRANCHES`,
    );
}

// the home-page order and the page registry must stay in sync, or games go missing
for (const slug of defaultGames) {
  if (!gamesMap[slug])
    problems.push(`${slug}: in defaultGames but not gamesMap`);
}
for (const slug of Object.keys(gamesMap)) {
  if (!defaultGames.includes(slug))
    problems.push(`${slug}: in gamesMap but not defaultGames`);
}
if (new Set(defaultGames).size !== defaultGames.length)
  problems.push("defaultGames: duplicate slug");

// host redirects run before static files, so a source that is also a slug kills that game
const { redirects = [] } = JSON.parse(readFileSync("vercel.json", "utf8"));
for (const { source } of redirects) {
  if (gamesMap[source.replace(/^\/games\//, "")])
    problems.push(`${source}: redirect shadows a game page`);
}

const sitemapUrl = `${SITE}/sitemap-index.xml`;
if (
  !readFileSync("public/robots.txt", "utf8").includes(`Sitemap: ${sitemapUrl}`)
)
  problems.push(`robots.txt: missing "Sitemap: ${sitemapUrl}"`);
if (!existsSync("dist/sitemap-index.xml"))
  problems.push("dist/sitemap-index.xml missing");

if (problems.length) {
  console.error(
    `check-pages: ${problems.length} problem(s):\n- ${problems.join("\n- ")}`,
  );
  process.exit(1);
}
console.log(`check-pages: ${Object.keys(gamesMap).length} game pages ok.`);
