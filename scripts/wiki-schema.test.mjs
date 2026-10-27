import assert from "node:assert/strict";
import { test } from "node:test";
import { wikiSchema } from "../src/lib/wiki-schema.ts";
import { groups } from "../wiki.config.mjs";

test("wiki frontmatter requires meaningful metadata and a known page list", () => {
  const metadata = { title: "Example", description: "About this page" };
  assert.equal(wikiSchema.safeParse(metadata).success, true);
  for (const key of ["title", "description"]) {
    for (const value of [undefined, "", "  ", 42]) {
      assert.equal(wikiSchema.safeParse({ ...metadata, [key]: value }).success, false);
    }
  }
  for (const pageList of ["all", ...groups.map((group) => group.dir)]) {
    assert.equal(wikiSchema.safeParse({ ...metadata, pageList }).success, true);
  }
  assert.equal(wikiSchema.safeParse({ ...metadata, pageList: "typo" }).success, false);
});
