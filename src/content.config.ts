import { defineCollection } from "astro:content";
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { wikiSchema } from "./lib/wiki-schema";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema({ extend: wikiSchema }) }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
