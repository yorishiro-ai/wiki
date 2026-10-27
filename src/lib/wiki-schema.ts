import { z } from "astro/zod";
import { groups } from "../../wiki.config.mjs";

export const wikiSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  pageList: z.enum(["all", ...groups.map((group) => group.dir)]).optional(),
});
