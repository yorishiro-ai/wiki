import assert from "node:assert/strict";
import { test } from "node:test";
import { selectPages } from "../src/lib/page-list.ts";

const page = (id, data = {}, file = id) => ({
  id,
  filePath: `src/content/docs/${file}.mdx`,
  data: { title: id, description: `About ${id}`, sidebar: {}, ...data },
});

test("page lists follow locale, order, visibility and custom slugs", () => {
  const entries = [
    page("index"),
    page("guides/current"),
    page("guides/z-last"),
    page("guides/first", { sidebar: { order: 1 } }),
    page("guides/draft", { draft: true }),
    page("guides/hidden", { sidebar: { hidden: true } }),
    page("ja/guides/example"),
    page("custom", {}, "guides/custom"),
    page("configuration", {}, "configuration/index"),
  ];
  const pages = selectPages(entries, undefined, "guides/current");
  assert.deepEqual(
    pages.map((entry) => entry.href),
    ["/wiki/guides/first/", "/wiki/configuration/", "/wiki/custom/", "/wiki/guides/z-last/"],
  );
  assert.equal(pages.find((entry) => entry.href === "/wiki/custom/").section, "guides");
  assert.deepEqual(
    selectPages(entries, "ja", "ja/index").map((entry) => entry.href),
    ["/wiki/ja/guides/example/"],
  );
});
