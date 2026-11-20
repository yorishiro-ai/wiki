// Single place that defines the wiki structure, used by astro.config.mjs and scripts/.
// To add a section, add one entry to `groups`.

export const title = "Yorishiro Wiki";
export const description = "User guide, configuration, and operations for Yorishiro (依り代).";
export const site = "https://yorishiro-ai.github.io";
export const base = "/wiki";
export const repo = "https://github.com/yorishiro-ai/wiki";
export const productRepo = "https://github.com/yorishiro-ai/yorishiro";
export const productVersion = "20261120-1";
export const docsDir = "src/content/docs";

// The root locale is served without a URL prefix. Every other locale lives under `/<code>/`.
export const defaultLocale = "en";
export const locales = {
  root: { label: "English", lang: "en" },
  ja: { label: "日本語", lang: "ja" },
};
export const translatedLocales = Object.keys(locales).filter((l) => l !== "root");

// Sidebar sections, in display order. `dir` is the folder under src/content/docs.
// Pages inside are listed by `sidebar.order` in their frontmatter, then by name.
export const groups = [
  { dir: "installation", label: "Installation", translations: { ja: "インストール" } },
  { dir: "configuration", label: "Configuration", translations: { ja: "設定" } },
  { dir: "guides", label: "Guides", translations: { ja: "ガイド" } },
  { dir: "operations", label: "Operations", translations: { ja: "運用" } },
  { dir: "reference", label: "Reference", translations: { ja: "リファレンス" } },
];

export const sidebar = groups.map((g) => ({
  label: g.label,
  translations: g.translations,
  items: [{ autogenerate: { directory: g.dir } }],
}));
