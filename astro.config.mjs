import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://yorishiro-ai.github.io",
  base: "/wiki",
  integrations: [
    starlight({
      title: "Yorishiro Wiki",
      description: "User guide, configuration, and operations for Yorishiro (依り代).",
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
        { label: "Installation", items: [{ autogenerate: { directory: "installation" } }] },
        { label: "Configuration", items: [{ autogenerate: { directory: "configuration" } }] },
        { label: "Guides", items: [{ autogenerate: { directory: "guides" } }] },
        { label: "Operations", items: [{ autogenerate: { directory: "operations" } }] },
        { label: "Reference", items: [{ autogenerate: { directory: "reference" } }] },
      ],
    }),
  ],
});
