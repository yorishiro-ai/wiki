// Verifies page structure. Fails when:
//   - a page has no `title` or `description`
//   - a page sits outside a known group (except each locale's index)
//   - an English page has no translation for a locale, or a translation has no English page
//   - a page still contains the "TODO:" placeholder from the template
//   - lunaria.config.json disagrees with the locales in wiki.config.mjs
//
//   pnpm check:pages
import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { defaultLocale, docsDir, groups, translatedLocales } from "../wiki.config.mjs";
import { walk } from "./lib/files.mjs";

const errors = [];
const files = (await walk(docsDir, /\.mdx?$/)).map((p) => relative(docsDir, p));
const pages = new Map(); // "<locale>|<path>" -> content
for (const f of files) {
  const first = f.split("/")[0];
  const locale = translatedLocales.includes(first) ? first : "root";
  const path = locale === "root" ? f : f.slice(first.length + 1);
  pages.set(`${locale}|${path}`, await readFile(join(docsDir, f), "utf8"));
}

for (const [key, text] of pages) {
  const [locale, path] = key.split("|");
  const where = `${locale === "root" ? "" : `${locale}/`}${path}`;
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  if (!/^title:\s*\S/m.test(fm)) errors.push(`${where}: missing title`);
  if (!/^description:\s*\S/m.test(fm)) errors.push(`${where}: missing description`);
  if (/^TODO:/m.test(text)) errors.push(`${where}: still has the TODO placeholder`);
  const isIndex = /^index\.mdx?$/.test(path);
  if (!isIndex && !groups.some((g) => path.startsWith(`${g.dir}/`))) {
    errors.push(`${where}: not inside a known group (${groups.map((g) => g.dir).join(", ")})`);
  }
}

const stem = (p) => p.replace(/\.mdx?$/, "");
const root = new Set(
  [...pages.keys()].filter((k) => k.startsWith("root|")).map((k) => stem(k.slice(5))),
);
for (const locale of translatedLocales) {
  const own = new Set(
    [...pages.keys()]
      .filter((k) => k.startsWith(`${locale}|`))
      .map((k) => stem(k.slice(locale.length + 1))),
  );
  for (const p of root) if (!own.has(p)) errors.push(`${locale}: missing translation of ${p}`);
  for (const p of own) if (!root.has(p)) errors.push(`${locale}/${p}: no English page`);
}

const lunaria = JSON.parse(await readFile("lunaria.config.json", "utf8"));
if (lunaria.defaultLocale?.lang !== defaultLocale) {
  errors.push(`lunaria.config.json: defaultLocale must be "${defaultLocale}"`);
}
const lunariaLocales = (lunaria.locales ?? [])
  .map((l) => l.lang)
  .sort()
  .join(",");
if (lunariaLocales !== [...translatedLocales].sort().join(",")) {
  errors.push(
    `lunaria.config.json: locales (${lunariaLocales}) must match translatedLocales (${translatedLocales})`,
  );
}

if (errors.length) {
  console.error(errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log(`OK: ${root.size} pages in ${1 + translatedLocales.length} locales.`);
