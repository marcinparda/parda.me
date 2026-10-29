import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import rehypeMermaid from "rehype-mermaid";

export default defineConfig({
  site: "https://parda.me",
  integrations: [tailwind()],
  markdown: {
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid"] },
    rehypePlugins: [[rehypeMermaid, { strategy: "img-svg", dark: true }]],
  },
  output: "static",
  adapter: vercel(),
  image: {
    service: passthroughImageService(),
  },
});
