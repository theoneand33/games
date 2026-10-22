// ponytail: fail the build if a game page was replaced by a redirect or is missing
import { existsSync, readFileSync } from "node:fs";
import { gamesMap } from "../src/data/game-seo.ts";

const broken = Object.keys(gamesMap).filter((slug) => {
  const file = `dist/games/${slug}/index.html`;
  return (
    !existsSync(file) || readFileSync(file, "utf8").includes("Redirecting to")
  );
});

if (broken.length) {
  console.error(
    `check-pages: ${broken.length} game page(s) missing or redirected: ${broken.join(", ")}`,
  );
  process.exit(1);
}
console.log(`check-pages: ${Object.keys(gamesMap).length} game pages ok.`);
