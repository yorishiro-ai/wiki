import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { base, locales, productRepo, repo, sidebar, site } from "./wiki.config.mjs";

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: "Yorishiro Wiki",
      description: "User guide, configuration, and operations for Yorishiro (依り代).",
      defaultLocale: "root",
      locales,
      lastUpdated: true,
      editLink: { baseUrl: `${repo}/edit/main/` },
      social: [{ icon: "github", label: "GitHub", href: productRepo }],
      sidebar,
    }),
  ],
});
