// Checks every internal link and #anchor in the built site.
//
//   pnpm build && pnpm check:links
import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { base } from "../wiki.config.mjs";
import { walk } from "./lib/files.mjs";

const dist = "dist";
const html = new Map(); // URL path -> { text, ids }

for (const p of await walk(dist, /\.html$/)) {
  const rel = relative(dist, p)
    .replace(/index\.html$/, "")
    .replace(/\.html$/, "");
  const url = `${base}/${rel}`.replace(/\/*$/, "/");
  const text = await readFile(p, "utf8");
  html.set(url, { text, ids: new Set([...text.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) });
}

const errors = [];
for (const [from, { text }] of html) {
  for (const [, href] of text.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(href)) continue;
    const resolved = new URL(href, `https://x${from}`);
    const target = resolved.pathname.endsWith("/") ? resolved.pathname : `${resolved.pathname}/`;
    if (!resolved.pathname.startsWith(`${base}/`)) {
      errors.push(`${from}: link leaves the site base: ${href}`);
      continue;
    }
    const page = html.get(target);
    if (!page) {
      const asset = await readFile(join(dist, resolved.pathname.slice(base.length))).catch(
        () => null,
      );
      if (!asset) errors.push(`${from}: broken link ${href}`);
      continue;
    }
    const hash = decodeURIComponent(resolved.hash.slice(1));
    if (hash && hash !== "_top" && !page.ids.has(hash))
      errors.push(`${from}: missing anchor ${href}`);
  }
}

if (errors.length) {
  console.error([...new Set(errors)].map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log(`OK: links and anchors in ${html.size} pages.`);
