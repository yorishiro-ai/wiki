import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const script = fileURLToPath(new URL("./new-page.mjs", import.meta.url));

test("page generation preserves YAML values, order, and existing pages", async (t) => {
  const cwd = await mkdtemp(join(tmpdir(), "wiki-page-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await cp(new URL("../templates", import.meta.url), join(cwd, "templates"), { recursive: true });
  const run = (...args) =>
    spawnSync(process.execPath, [script, ...args], { cwd, encoding: "utf8" });
  const title = 'A "quoted" title with \\ and {{order}}';
  const description = "Line one\nLine two";
  const args = ["guides/demo", title, "Demo", "--order", "3", "--description", description];
  assert.equal(run(...args).status, 0);
  const path = join(cwd, "src/content/docs/guides/demo.mdx");
  const page = await readFile(path, "utf8");
  assert.ok(page.includes(`title: ${JSON.stringify(title)}`));
  assert.ok(page.includes(`description: ${JSON.stringify(description)}`));
  assert.ok(page.includes("order: 3\n"));
  assert.ok(
    (await readFile(join(cwd, "src/content/docs/ja/guides/demo.mdx"), "utf8")).includes(
      "order: 3\n",
    ),
  );
  assert.notEqual(run(...args).status, 0);
  assert.equal(await readFile(path, "utf8"), page);
  for (const options of [["--order", "-1"], ["--order", "oops"], ["--order"], ["--unknown"]]) {
    assert.notEqual(run("guides/invalid", "Demo", "Demo", ...options).status, 0);
  }
});

test("missing translation template creates no English page", async (t) => {
  const cwd = await mkdtemp(join(tmpdir(), "wiki-page-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await cp(new URL("../templates", import.meta.url), join(cwd, "templates"), { recursive: true });
  await rm(join(cwd, "templates/page.ja.mdx"));
  const result = spawnSync(process.execPath, [script, "guides/demo", "Demo", "Demo"], { cwd });
  assert.notEqual(result.status, 0);
  await assert.rejects(readFile(join(cwd, "src/content/docs/guides/demo.mdx")), { code: "ENOENT" });
});
