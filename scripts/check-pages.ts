// ponytail: fail the build if a game page is missing, redirected, lacks its assets,
// or is shadowed by a vercel.json redirect
import { existsSync, readFileSync } from "node:fs";
import { gamesMap } from "../src/data/game-seo.ts";
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
    problems.push(`${slug}: no HTML5 branch in games/[slug].astro`);
}

// host redirects run before static files, so a source that is also a slug kills that game
const { redirects = [] } = JSON.parse(readFileSync("vercel.json", "utf8"));
for (const { source } of redirects) {
  if (gamesMap[source.replace(/^\/games\//, "")])
    problems.push(`${source}: redirect shadows a game page`);
}

if (!readFileSync("public/robots.txt", "utf8").includes(`${SITE}/sitemap.xml`))
  problems.push("robots.txt: sitemap URL does not match the site origin");

if (problems.length) {
  console.error(
    `check-pages: ${problems.length} problem(s):\n- ${problems.join("\n- ")}`,
  );
  process.exit(1);
}
console.log(`check-pages: ${Object.keys(gamesMap).length} game pages ok.`);
