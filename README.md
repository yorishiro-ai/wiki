# Yorishiro Wiki

User documentation for [Yorishiro](https://github.com/yorishiro-ai/yorishiro) (依り代): installation, configuration, guides, operations, and reference. Available in English and Japanese.

Published at <https://yorishiro-ai.github.io/wiki/>. Developer documentation (architecture, testing, contribution) lives in the [Yorishiro repository](https://github.com/yorishiro-ai/yorishiro/tree/develop/docs).

Built with [Astro Starlight](https://starlight.astro.build/), [pnpm](https://pnpm.io/), and [Oxc](https://oxc.rs/) (`oxlint`, `oxfmt`).

## Development

Requires Node.js 24 and pnpm.

In VS Code, install the recommended extensions (Astro and Oxc). Format on save uses `oxfmt`, and **Run > Start Debugging** starts the dev server.

```sh
pnpm install
pnpm dev           # http://localhost:4321/wiki/
pnpm format        # oxfmt
pnpm check         # lint, format check, page structure and en/ja parity, types
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
3. Run `pnpm check:pages`. It fails on a missing title or description, a page outside a known section, a missing translation, or a leftover `TODO:`.

The page appears in the sidebar automatically, ordered by `sidebar.order` and then by name. Use relative links between pages (for example `../docker/`). In Japanese pages, link anchors use the Japanese heading text.

## Add a section

Add one entry to `groups` in `wiki.config.mjs` (folder name, English label, Japanese label), and create the folder. Locales, the sidebar, and site URLs are all defined in that file.

## MCP tool reference

`reference/mcp-tools` is generated from the tool inventory that the Yorishiro server tests produce (`docs/en/mcp-tools.md` in the Yorishiro repository). Do not edit it by hand:

```sh
pnpm generate:mcp                              # reads the inventory from the develop branch
pnpm generate:mcp -- ../yorishiro/docs/en/mcp-tools.md   # or from a local checkout
```

## Deployment

Pushes to `main` build and deploy to GitHub Pages through GitHub Actions. Pull requests run `pnpm check`, build, and link checks only.
