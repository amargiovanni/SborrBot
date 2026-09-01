import { describe, it, expect, vi } from 'vitest';
import { handleTextCommand } from '../src/commands/text';
import { handleSlashCommand } from '../src/commands/slash';

// vitest-pool-workers 0.12 does not support vi.mock module mocking, so the DB
// is faked at the D1 boundary instead: one row shape serves every query the
// exercised handlers run.
function makeDb(rows: Record<string, unknown>[]) {
  const stmt = {
    bind: () => stmt,
    first: async () => rows[0] ?? null,
    all: async () => ({ results: rows }),
  };
  return { prepare: () => stmt } as any;
}

function makeApi() {
  const sent: { text: string; parseMode?: string }[] = [];
  const api = {
    sendMessage: vi.fn(async (_chatId: unknown, text: string, parseMode?: string) => {
      sent.push({ text, parseMode });
      return { ok: true };
    }),
  } as any;
  return { api, sent };
}

// Every unescaped occurrence of a V2 special outside an intentional entity is
// an HTTP 400. Strip valid escapes, then require that none of the
// hard-breaking characters survive bare.
function assertV2Safe(text: string) {
  const withoutEscapes = text.replace(/\\[_*\[\]()~`>#+\-=|{}.!\\]/g, '');
  expect(withoutEscapes, `unescaped V2 specials in: ${text}`).not.toMatch(/[\].!(){}>#+=|~-]/);
}

describe('MarkdownV2 migration', () => {
  it('sends /start as valid MarkdownV2', async () => {
    const { api, sent } = makeApi();
    await handleSlashCommand('/start', 'chat', 'user', { DB: makeDb([]) } as any, api);
    expect(sent[0].parseMode).toBe('MarkdownV2');
    assertV2Safe(sent[0].text);
  });

  it('sends /help as valid MarkdownV2', async () => {
    const { api, sent } = makeApi();
    await handleSlashCommand('/help', 'chat', 'user', { DB: makeDb([]) } as any, api);
    expect(sent[0].parseMode).toBe('MarkdownV2');
  });

  it('escapes category names but not code-span slugs in /testo', async () => {
    const { api, sent } = makeApi();
    const env = { DB: makeDb([{ name: 'Insulti (base)', slug: 'combo-insulti' }]) } as any;
    await handleSlashCommand('/testo', 'chat', 'user', env, api);
    expect(sent[0].parseMode).toBe('MarkdownV2');
    expect(sent[0].text).toContain('*Insulti \\(base\\)*');
    expect(sent[0].text).toContain('`combo-insulti`');
  });

  it('fully escapes DB content, which is plain text with V2 specials', async () => {
    const env = { DB: makeDb([{ content: 'Chi dorme non piglia pesci... forse!' }]) } as any;
    const { api, sent } = makeApi();
    await handleTextCommand('frase celebre', 'chat', 'user', env, api);
    expect(sent[0].parseMode).toBe('MarkdownV2');
    expect(sent[0].text).toContain('pesci\\.\\.\\. forse\\!');
  });

  it('escapes a target name containing V2 specials in combo insulti', async () => {
    const env = { DB: makeDb([{ content: '{name} sei un disastro.' }]) } as any;
    const { api, sent } = makeApi();
    await handleTextCommand('insulta combo mario.rossi!', 'chat', 'user', env, api);
    expect(sent[0].parseMode).toBe('MarkdownV2');
    expect(sent[0].text).toContain('mario\\.rossi\\!');
    assertV2Safe(sent[0].text.replace(/\*/g, ''));
  });
});
