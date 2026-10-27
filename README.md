# Yorishiro Wiki

User documentation for [Yorishiro](https://github.com/yorishiro-ai/yorishiro) (依り代): installation, configuration, guides, operations, and reference. Available in English and Japanese.

Published at <https://yorishiro-ai.github.io/wiki/>. This wiki covers using and operating Yorishiro; it follows product `develop`. Contributor information lives in the [Yorishiro contributing guide](https://github.com/yorishiro-ai/yorishiro/blob/develop/CONTRIBUTING.md).

Built with [Astro Starlight](https://starlight.astro.build/), [pnpm](https://pnpm.io/), and [Oxc](https://oxc.rs/) (`oxlint`, `oxfmt`).

## Development

Requires Node.js 24 and pnpm.

In VS Code, install the recommended extensions (Astro and Oxc). Format on save uses `oxfmt`, and **Run > Start Debugging** starts the dev server.

```sh
pnpm install
pnpm dev           # http://localhost:4321/wiki/
pnpm format        # oxfmt
pnpm check         # lint, format check, script tests, page structure and en/ja parity, types
pnpm build         # outputs to dist/
pnpm check:links   # links and anchors in dist/ (run after build)
pnpm verify        # check, build, and check:links, as CI does
pnpm preview
```

## Add a page

1. Create the English and Japanese pages from the templates:

   ```sh
   pnpm new guides/backup "Back up and restore" "バックアップと復元" --order 3 --description "How to back up and restore Yorishiro."
   ```

   This writes `src/content/docs/guides/backup.mdx` and `src/content/docs/ja/guides/backup.mdx`.

2. Replace the `TODO:` text in both files. Pages are MDX, so write `{` and a bare `<` in prose as `&#123;` and `&lt;`, or put them in backticks. Write the English page first; the Japanese page mirrors its structure.
3. Run `pnpm check`. Astro's content schema validates titles, descriptions, and page-list settings. The page structure check catches unknown sections, missing translations, and leftover `TODO:` text.

The page appears in the sidebar, home page directory, and search index automatically. No route registration or link list needs updating. Add matching English and Japanese MDX files under an existing section; `pnpm new` is optional. A page only needs `title`, `description`, and its body:

```mdx
---
title: Back up and restore
description: How to back up and restore Yorishiro.
---

Write the instructions here.
```

Set `sidebar.order` to control ordering; otherwise the lists sort by title after explicitly ordered pages. Use relative links between pages (for example `../docker/`). In Japanese pages, link anchors use the Japanese heading text.

### Automatic Page Lists

`src/components/PageList.astro` renders cards from each page's `title` and `description`, filtered to the current language. Starlight's shared Markdown wrapper adds the list after the page body when `pageList` is set in frontmatter:

```yaml
title: Guides
description: Instructions for everyday tasks.
pageList: guides
```

Use `pageList: all` to list all configured sections, as the home pages do. Omit `pageList` for no list. Values are validated against `groups` in `wiki.config.mjs`; no component imports or locale-specific paths are needed. The list excludes the current page, drafts, and pages with `sidebar.hidden: true`. Grouping follows the source directory, and links respect custom `slug` values. The component uses Starlight's existing cards and needs no client-side JavaScript.

## Add a section

Add one entry to `groups` in `wiki.config.mjs` (folder name, English label, Japanese label), and add MDX pages in that folder for both languages. The sidebar and home page directory pick up the section automatically; an `index.mdx` landing page is optional. Locales, the sidebar, and site URLs are all defined in that file.

UI translation overrides live in `src/content/i18n/<language>.json`. The English and Japanese files are intentionally empty: Starlight supplies the standard translations. Add keys only when a site-specific override is needed.

## MCP tool reference

`reference/mcp-tools` is generated from the tool inventory that the Yorishiro server tests produce (`tests/fixtures/mcp-inventory.md` in the Yorishiro repository). Do not edit it by hand:

```sh
pnpm generate:mcp                              # reads the inventory from the develop branch
pnpm generate:mcp -- ../yorishiro/tests/fixtures/mcp-inventory.md   # or from a local checkout
```

## Deployment

Pushes to `main` build and deploy to GitHub Pages through GitHub Actions. Pull requests run `pnpm check`, build, and link checks only.
