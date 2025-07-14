import { glob } from "glob";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { JSDOM } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");

// 1. Grab every .html file the build produced
const files = glob.sync("**/*.html", { cwd: DIST });

const index = [];

for (const file of files) {
  const html = readFileSync(resolve(DIST, file), "utf8");
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const url = "/" + file.replace(/index\.html$/, ""); // /about/index.html → /about/
  const title = document.title || url;
  const body = document.body?.textContent?.trim() || "";

  index.push({ url, title, body });
}

writeFileSync(
  resolve(DIST, "search-index.json"),
  JSON.stringify(index, null, 0) // minified
);

console.log(`✅  Built search index with ${index.length} pages`);