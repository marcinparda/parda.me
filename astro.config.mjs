import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://parda.me",
  integrations: [tailwind()],
  output: "static",
  adapter: vercel(),
  image: {
    service: passthroughImageService(),
  },
});
