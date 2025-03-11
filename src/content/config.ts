// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/posts" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
  }),
});

const newslettersCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/newsletters" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  posts: postsCollection,
  newsletters: newslettersCollection,
};
