import { env } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('test environment', () => {
  it('has D1 with migrations applied', async () => {
    const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM categories').first<{ n: number }>();
    expect(row).not.toBeNull();
    expect(row!.n).toBeGreaterThan(0);
  });

  it('has scheduled_messages table (migration 0014)', async () => {
    const row = await env.DB
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'scheduled_messages'")
      .first();
    expect(row).not.toBeNull();
  });

  it('exposes test secrets', () => {
    expect(env.BOT_TOKEN).toBe('test-token');
  });
});
