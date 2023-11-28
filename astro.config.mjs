import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://parda.me",
  integrations: [tailwind()],
  prefetch: {
    prefetchAll: true,
  },
  experimental: {
    i18n: {
      locales: ["en", "pl"],
      defaultLocale: "en",
      routingStrategy: "prefix-other-locales",
      fallback: {
        pl: "en",
      },
    },
  },
});
