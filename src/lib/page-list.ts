import type { CollectionEntry } from "astro:content";
import { base, docsDir, translatedLocales } from "../../wiki.config.mjs";

export function selectPages(
  entries: CollectionEntry<"docs">[],
  locale: string | undefined,
  currentId: string,
) {
  return entries
    .filter((entry) => entry.id !== currentId && !entry.data.draft && !entry.data.sidebar.hidden)
    .flatMap((entry) => {
      // Use the source path for grouping; an optional frontmatter slug only changes the URL.
      const source = entry.filePath?.split(`${docsDir}/`)[1];
      if (!source) return [];
      const parts = source.split("/");
      const sourceLocale = translatedLocales.includes(parts[0]) ? parts.shift() : undefined;
      if (sourceLocale !== locale || parts.length < 2) return [];
      const slug = entry.id.replace(/(?:^|\/)index$/, "");
      return [
        {
          section: parts[0],
          title: entry.data.title,
          description: entry.data.description,
          order: entry.data.sidebar.order ?? Infinity,
          href: `${base}/${slug.replace(/\/$/, "")}/`,
        },
      ];
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, locale ?? "en"));
}
