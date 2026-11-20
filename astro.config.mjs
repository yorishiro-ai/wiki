import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightKbd from "starlight-kbd";
import lunaria from "@lunariajs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import starlightGroupPages from "starlight-group-pages";
import {
  base,
  description,
  locales,
  productRepo,
  repo,
  sidebar,
  site,
  title,
} from "./wiki.config.mjs";

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title,
      description,
      defaultLocale: "root",
      locales,
      lastUpdated: true,
      customCss: ["./src/styles/custom.css"],
      editLink: { baseUrl: `${repo}/edit/main/` },
      social: [{ icon: "github", label: "GitHub", href: productRepo }],
      sidebar,
      plugins: [
        starlightGroupPages(),
        starlightLinksValidator(),
        starlightKbd({
          globalPicker: false,
          types: [{ id: "linux", label: "Linux", default: true }],
        }),
        ...(import.meta.env.PROD ? [lunaria({ route: "/localization" })] : []),
      ],
    }),
  ],
});
