import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercelAdapter from "@astrojs/vercel";

export default defineConfig({
  site: "https://parda.me",
  integrations: [tailwind()],
  output: "server",
  adapter: vercelAdapter(),
});
