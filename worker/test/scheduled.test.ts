import { env, fetchMock, createScheduledController, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import worker from '../src/index';

beforeAll(() => {
  fetchMock.activate();
  fetchMock.disableNetConnect();
});
afterEach(() => fetchMock.assertNoPendingInterceptors());

beforeEach(async () => {
  await env.DB.prepare('DELETE FROM scheduled_messages').run();
  await env.DB.prepare('DELETE FROM groups').run();
});

function currentHHMM(): string {
  return new Date().toISOString().slice(11, 16);
}

describe('scheduled()', () => {
  it('broadcasts a due daily message once per active group on the minute cron', async () => {
    await env.DB.prepare(
      "INSERT INTO groups (telegram_chat_id, is_active, is_banned) VALUES ('-100', 1, 0), ('-200', 1, 0), ('-300', 0, 0)"
    ).run();
    await env.DB.prepare(
      "INSERT INTO scheduled_messages (message_text, target_group_id, schedule_type, scheduled_at) VALUES ('buongiorno stronzi', NULL, 'daily', ?)"
    ).bind(currentHHMM()).run();

    // Exactly two active groups → exactly two sendMessage calls.
    for (let i = 0; i < 2; i++) {
      fetchMock
        .get('https://api.telegram.org')
        .intercept({ path: '/bottest-token/sendMessage', method: 'POST' })
        .reply(200, { ok: true, result: {} });
    }

    const ctrl = createScheduledController({ cron: '* * * * *' });
    const ctx = createExecutionContext();
    await worker.scheduled(ctrl, env, ctx);
    await waitOnExecutionContext(ctx);

    const row = await env.DB.prepare('SELECT last_sent_at FROM scheduled_messages').first<{ last_sent_at: string | null }>();
    expect(row!.last_sent_at).not.toBeNull();
    // assertNoPendingInterceptors in afterEach proves exactly 2 calls happened.
  });

  it('does NOT broadcast on the daily purge cron', async () => {
    await env.DB.prepare(
      "INSERT INTO groups (telegram_chat_id, is_active, is_banned) VALUES ('-100', 1, 0)"
    ).run();
    await env.DB.prepare(
      "INSERT INTO scheduled_messages (message_text, target_group_id, schedule_type, scheduled_at) VALUES ('doppione', NULL, 'daily', ?)"
    ).bind(currentHHMM()).run();

    // No interceptor registered: any telegram call would throw (disableNetConnect).
    const ctrl = createScheduledController({ cron: '0 3 * * *' });
    const ctx = createExecutionContext();
    await worker.scheduled(ctrl, env, ctx);
    await waitOnExecutionContext(ctx);

    const row = await env.DB.prepare('SELECT last_sent_at FROM scheduled_messages').first<{ last_sent_at: string | null }>();
    expect(row!.last_sent_at).toBeNull();
  });
});
