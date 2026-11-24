// ponytail: vercel.json stays the source for redirects and headers; this writes the
// Cloudflare Workers equivalents into dist so both hosts behave the same
import { readFileSync, writeFileSync } from "node:fs";

const { redirects, headers } = JSON.parse(readFileSync("vercel.json", "utf8"));

// Vercel ":path*" / "(.*)" wildcards become Cloudflare "*" and ":splat"
const toSource = (s: string) => s.replace(":path*", "*").replace("(.*)", "*");
for (const { source } of [...redirects, ...headers])
  if (/[:(]/.test(toSource(source)))
    throw new Error(`cloudflare-assets: unsupported pattern ${source}`);

writeFileSync(
  "dist/_redirects",
  redirects
    .map(
      (r: { source: string; destination: string; statusCode: number }) =>
        `${toSource(r.source)} ${r.destination.replace(":path*", ":splat")} ${r.statusCode}`,
    )
    .join("\n") + "\n",
);
writeFileSync(
  "dist/_headers",
  headers
    .map(
      (h: { source: string; headers: { key: string; value: string }[] }) =>
        `${toSource(h.source)}\n` +
        h.headers.map(({ key, value }) => `  ${key}: ${value}`).join("\n"),
    )
    .join("\n") + "\n",
);
console.log(
  `cloudflare-assets: ${redirects.length} redirects, ${headers.length} header rules.`,
);
