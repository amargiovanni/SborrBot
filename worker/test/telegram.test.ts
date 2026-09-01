import { fetchMock } from 'cloudflare:test';
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { TelegramApi } from '../src/services/telegram';

beforeAll(() => {
  fetchMock.activate();
  fetchMock.disableNetConnect();
});
afterEach(() => fetchMock.assertNoPendingInterceptors());

describe('TelegramApi', () => {
  it('returns the parsed body on success', async () => {
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: '/bottest-token/sendMessage', method: 'POST' })
      .reply(200, { ok: true, result: { message_id: 1 } });

    const api = new TelegramApi('test-token');
    const res = await api.sendMessage(123, 'ciao');
    expect(res.ok).toBe(true);
  });

  it('logs and returns the error body on Telegram 400', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: '/bottest-token/sendMessage', method: 'POST' })
      .reply(400, { ok: false, error_code: 400, description: "Bad Request: can't parse entities" });

    const api = new TelegramApi('test-token');
    const res = await api.sendMessage(123, '*rotto');
    expect(res.ok).toBe(false);
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('sendMessage'), expect.anything());
    errSpy.mockRestore();
  });

  it('retries once after a 429 whose retry_after is within the cap', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: '/bottest-token/sendMessage', method: 'POST' })
      .reply(429, { ok: false, error_code: 429, description: 'Too Many Requests', parameters: { retry_after: 1 } });
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: '/bottest-token/sendMessage', method: 'POST' })
      .reply(200, { ok: true, result: { message_id: 2 } });

    const api = new TelegramApi('test-token');
    const res = await api.sendMessage(123, 'riprova');
    expect(res.ok).toBe(true);
    expect(errSpy).not.toHaveBeenCalled();
    errSpy.mockRestore();
  }, 10_000);

  it('does not retry when retry_after exceeds the cap', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: '/bottest-token/sendMessage', method: 'POST' })
      .reply(429, { ok: false, error_code: 429, description: 'Too Many Requests', parameters: { retry_after: 30 } });

    const api = new TelegramApi('test-token');
    const res = await api.sendMessage(123, 'niente retry');
    expect(res.ok).toBe(false);
    expect(res.error_code).toBe(429);
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('sendMessage'), expect.anything());
    errSpy.mockRestore();
  });

  it('does not retry a 429 that carries no retry_after', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: '/bottest-token/sendMessage', method: 'POST' })
      .reply(429, { ok: false, error_code: 429, description: 'Too Many Requests' });

    const api = new TelegramApi('test-token');
    const res = await api.sendMessage(123, 'niente retry');
    expect(res.ok).toBe(false);
    errSpy.mockRestore();
  });

  it('survives a non-JSON response body', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock
      .get('https://api.telegram.org')
      .intercept({ path: '/bottest-token/sendSticker', method: 'POST' })
      .reply(502, 'Bad Gateway');

    const api = new TelegramApi('test-token');
    const res = await api.sendSticker(123, 'file-id');
    expect(res.ok).toBe(false);
    errSpy.mockRestore();
  });
});
