// Creates an English page and its Japanese counterpart from templates/.
//
//   pnpm new <group>/<slug> "<English title>" "<日本語タイトル>" [--order N] [--description "<text>"]
//
// Example: pnpm new guides/backup "Back up and restore" "バックアップと復元" --order 3
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";
import { docsDir, groups, translatedLocales } from "../wiki.config.mjs";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    order: { type: "string", default: "10" },
    description: { type: "string", default: "" },
  },
});
const { order, description } = values;
const [target, titleEn, titleJa] = positionals;

if (positionals.length !== 3 || !target || !titleEn || !titleJa) {
  console.error(
    'Usage: pnpm new <group>/<slug> "<English title>" "<日本語タイトル>" [--order N] [--description "<text>"]',
  );
  console.error(`Groups: ${groups.map((g) => g.dir).join(", ")}`);
  process.exit(1);
}

if (!/^\d+$/.test(order) || !Number.isSafeInteger(Number(order))) {
  console.error("--order must be a non-negative safe integer.");
  process.exit(1);
}

const [group, ...rest] = target.split("/");
const slug = rest.join("/");
if (!groups.some((g) => g.dir === group) || !/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(slug)) {
  console.error(
    `"${target}" must be <group>/<slug> with a known group (${groups.map((g) => g.dir).join(", ")}) and a lowercase-hyphen slug.`,
  );
  process.exit(1);
}

const fill = (tpl, title) =>
  tpl.replace(/"\{\{(title|description|order)\}\}"/g, (_, key) =>
    JSON.stringify({ title, description, order: Number(order) }[key]),
  );

const targets = [
  { path: join(docsDir, group, `${slug}.mdx`), template: "templates/page.en.mdx", title: titleEn },
  ...translatedLocales.map((l) => ({
    path: join(docsDir, l, group, `${slug}.mdx`),
    template: `templates/page.${l}.mdx`,
    title: titleJa,
  })),
];

for (const t of targets) {
  if (existsSync(t.path) || existsSync(t.path.replace(/\.mdx$/, ".md"))) {
    console.error(`Already exists: ${t.path}`);
    process.exit(1);
  }
}
// Read every template before creating files, so a missing translation cannot leave half a pair.
const contents = await Promise.all(
  targets.map(async (t) => fill(await readFile(t.template, "utf8"), t.title)),
);
for (const [i, t] of targets.entries()) {
  await mkdir(dirname(t.path), { recursive: true });
  await writeFile(t.path, contents[i], { flag: "wx" });
  console.log(`Created ${t.path}`);
}
