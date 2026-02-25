import type { Context } from 'grammy';

export interface Env {
  BOT_TOKEN: string;
  BOT_SECRET: string;
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

export interface BotContext extends Context {
  env: Env;
}
