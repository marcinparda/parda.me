import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [preact()],
  prefetch: {
    prefetchAll: true,
  },
  experimental: {
    i18n: {
      locales: ['en', 'pl'],
      defaultLocale: 'en',
      routingStrategy: 'prefix-other-locales',
      fallback: {
        pl: 'en',
      },
    },
  },
});
