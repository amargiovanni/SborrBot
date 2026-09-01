declare module 'cloudflare:test' {
  interface ProvidedEnv {
    DB: D1Database;
    MEDIA_BUCKET: R2Bucket;
    BOT_TOKEN: string;
    BOT_SECRET: string;
    OPENWEATHERMAP_API_KEY: string;
    TEST_MIGRATIONS: import('@cloudflare/vitest-pool-workers/config').D1Migration[];
  }
}
export {};
