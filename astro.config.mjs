import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://yorishiro-ai.github.io",
  base: "/wiki",
  integrations: [
    starlight({
      title: "Yorishiro Wiki",
      description: "User guide, configuration, and operations for Yorishiro (依り代).",
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        ja: { label: "日本語", lang: "ja" },
      },
      lastUpdated: true,
      editLink: {
        baseUrl: "https://github.com/yorishiro-ai/wiki/edit/main/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/yorishiro-ai/yorishiro",
        },
      ],
      sidebar: [
        {
          label: "Installation",
          translations: { ja: "インストール" },
          items: [{ autogenerate: { directory: "installation" } }],
        },
        {
          label: "Configuration",
          translations: { ja: "設定" },
          items: [{ autogenerate: { directory: "configuration" } }],
        },
        {
          label: "Guides",
          translations: { ja: "ガイド" },
          items: [{ autogenerate: { directory: "guides" } }],
        },
        {
          label: "Operations",
          translations: { ja: "運用" },
          items: [{ autogenerate: { directory: "operations" } }],
        },
        {
          label: "Reference",
          translations: { ja: "リファレンス" },
          items: [{ autogenerate: { directory: "reference" } }],
        },
      ],
    }),
  ],
});
