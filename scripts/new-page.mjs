// Creates an English page and its Japanese counterpart from templates/.
//
//   pnpm new <group>/<slug> "<English title>" "<日本語タイトル>" [--order N] [--description "<text>"]
//
// Example: pnpm new guides/backup "Back up and restore" "バックアップと復元" --order 3
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { docsDir, groups, translatedLocales } from "../wiki.config.mjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return args.splice(i, 2)[1];
};
const order = flag("order", "10");
const description = flag("description", "");
const [target, titleEn, titleJa] = args;

if (!target || !titleEn || !titleJa) {
  console.error(
    'Usage: pnpm new <group>/<slug> "<English title>" "<日本語タイトル>" [--order N] [--description "<text>"]',
  );
  console.error(`Groups: ${groups.map((g) => g.dir).join(", ")}`);
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
  tpl
    .replaceAll("{{title}}", title.replaceAll('"', '\\"'))
    .replaceAll("{{description}}", description.replaceAll('"', '\\"'))
    .replaceAll("{{order}}", order);

const targets = [
  { path: join(docsDir, group, `${slug}.mdx`), template: "templates/page.en.mdx", title: titleEn },
  ...translatedLocales.map((l) => ({
    path: join(docsDir, l, group, `${slug}.mdx`),
    template: `templates/page.${l}.mdx`,
    title: titleJa,
  })),
];

for (const t of targets) {
  if (existsSync(t.path)) {
    console.error(`Already exists: ${t.path}`);
    process.exit(1);
  }
}
for (const t of targets) {
  await mkdir(dirname(t.path), { recursive: true });
  await writeFile(t.path, fill(await readFile(t.template, "utf8"), t.title));
  console.log(`Created ${t.path}`);
}
