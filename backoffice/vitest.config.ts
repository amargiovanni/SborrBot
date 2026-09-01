import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      // The middleware imports Astro's virtual module, which only exists
      // inside an Astro build; tests run in plain node, so stub it.
      'astro:middleware': fileURLToPath(new URL('./src/test/stubs/astro-middleware.ts', import.meta.url)),
    },
  },
  test: {
    include: ['src/test/**/*.test.ts'],
  },
});
