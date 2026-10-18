# Yorishiro Wiki

User documentation for [Yorishiro](https://github.com/yorishiro-ai/yorishiro) (依り代): installation, configuration, guides, operations, and reference.

Published at <https://yorishiro-ai.github.io/wiki/>. Developer documentation (architecture, testing, contribution) lives in the [Yorishiro repository](https://github.com/yorishiro-ai/yorishiro/tree/develop/docs).

Built with [Astro Starlight](https://starlight.astro.build/), [pnpm](https://pnpm.io/), and [Oxc](https://oxc.rs/) (`oxlint`, `oxfmt`).

## Development

Requires Node.js 24 and pnpm.

```sh
pnpm install
pnpm dev           # http://localhost:4321/wiki/
pnpm lint          # oxlint
pnpm format        # oxfmt
pnpm format:check
pnpm build         # outputs to dist/
pnpm preview
```

Pages are Markdown/MDX files under `src/content/docs/`. Each directory maps to a sidebar group configured in `astro.config.mjs`.

## Deployment

Pushes to `main` build and deploy to GitHub Pages via GitHub Actions. Pull requests run lint, format check, and build only.
