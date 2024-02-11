import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const news = await getCollection("news");
  return rss({
    title: "parda.me | News",
    description: "Typescript related news",
    site: context.site,
    items: news.map((news) => ({
      title: news.data.title,
      pubDate: news.data.pubDate,
      description: news.data.description,
      link: `/news/${news.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
