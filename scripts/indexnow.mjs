// ponytail: no-op without INDEXNOW_KEY; run manually after Bing Webmaster setup
// Usage: INDEXNOW_KEY=<key> bun run indexnow
// Setup: 1. Generate key at Bing Webmaster Tools > IndexNow.
//        2. Put key in .env as INDEXNOW_KEY and place <key>.txt in public/.
//        3. Run this script after each deploy with new/updated URLs.
import { readFileSync } from "node:fs";

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.log("IndexNow: INDEXNOW_KEY not set, skipping.");
  process.exit(0);
}

const host = "unblocked-games.vercel.app";
let urls = [];
try {
  const xml = readFileSync("dist/sitemap.xml", "utf8");
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .slice(0, 10000);
} catch {
  console.log("IndexNow: dist/sitemap.xml not found, run build first.");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow.json", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  }),
});
console.log(`IndexNow: submitted ${urls.length} URLs, status ${res.status}`);
process.exit(res.ok ? 0 : 1);
