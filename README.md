# Yorishiro Wiki

User documentation for [Yorishiro](https://github.com/yorishiro-ai/yorishiro) (依り代): installation, configuration, guides, operations, and reference. Available in English and Japanese.

Published at <https://yorishiro-ai.github.io/wiki/>. This wiki covers using and operating Yorishiro; it follows product release `20261120-1` (set as `productVersion` in `wiki.config.mjs`). Contributor information lives in the [Yorishiro contributing guide](https://github.com/yorishiro-ai/yorishiro/blob/develop/CONTRIBUTING.md).

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
pnpm verify        # check and build (including link validation), as CI does
pnpm preview
```

## Add a page

Add matching English and Japanese MDX files under an existing section (for example `src/content/docs/guides/backup.mdx` and `src/content/docs/ja/guides/backup.mdx`). A page needs `title`, `description`, and its body; set `sidebar.order` to control ordering. Pages are MDX, so write `{` and a bare `<` in prose as `&#123;` and `&lt;`, or put them in backticks. Use relative links between pages. Japanese pages use Japanese heading text in anchors.

The sidebar, search, section overview pages (`starlight-group-pages`), and the translation dashboard (`/localization`, Lunaria) pick the page up automatically. `pnpm build` validates internal links and anchors (`starlight-links-validator`).

## Add a section

Add one entry to `groups` in `wiki.config.mjs` (folder name, English label, Japanese label) and add pages in that folder for both languages. UI translation overrides live in `src/content/i18n/<language>.json`; they are empty because Starlight supplies the standard translations.

## MCP tool reference

`reference/mcp-tools` renders `src/components/McpTools.astro`, which fetches the tool inventory (`tests/fixtures/mcp-inventory.md`) from the `productVersion` tag at build time. Nothing is generated or committed; change `productVersion` in `wiki.config.mjs` to update it.

`<ProductFile path="…" />` (`src/components/ProductFile.astro`) shows a file from the `productVersion` tag, fetched at build time. It is used for `config/production.yaml` and the systemd units, so those pages follow the product without manual copying.

## Deployment

Pushes to `main` build and deploy to GitHub Pages through GitHub Actions. Pull requests run `pnpm check`, build, and link validation only.
