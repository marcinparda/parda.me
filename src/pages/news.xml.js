import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const newsletters = await getCollection("newsletters");
  return rss({
    title: "parda.me | News",
    description: "Typescript related news",
    site: context.site,
    items: newsletters.map((newsletter) => ({
      title: newsletter.data.title,
      pubDate: newsletter.data.pubDate,
      description: newsletter.data.description,
      link: `/newsletters/${newsletter.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
