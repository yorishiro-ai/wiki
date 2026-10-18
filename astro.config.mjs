import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import starlightKbd from "starlight-kbd";
import lunaria from "@lunariajs/starlight";
import { base, locales, productRepo, repo, sidebar, site } from "./wiki.config.mjs";

export default defineConfig({
  site,
  base,
  vite: { plugins: [tailwindcss()] },
  integrations: [
    react(),
    starlight({
      title: "Yorishiro Wiki",
      description: "User guide, configuration, and operations for Yorishiro (依り代).",
      defaultLocale: "root",
      locales,
      lastUpdated: true,
      customCss: ["./src/styles/tailwind.css", "./src/styles/custom.css"],
      editLink: { baseUrl: `${repo}/edit/main/` },
      social: [{ icon: "github", label: "GitHub", href: productRepo }],
      sidebar,
      plugins: [
        starlightKbd({
          globalPicker: false,
          types: [{ id: "linux", label: "Linux", default: true }],
        }),
        ...(import.meta.env.PROD ? [lunaria({ route: "/localization" })] : []),
      ],
    }),
  ],
});
