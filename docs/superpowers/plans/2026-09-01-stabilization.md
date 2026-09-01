# SborrBot Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make SborrBot production-stable: test infrastructure + tests on all pure logic, CI, and fixes for every defect found in the 2026-09-01 analysis (cron double-send, unchecked Telegram API results, Markdown injection, unbounded broadcast fan-out, migration hygiene, config-key allowlist, Cmd+K escaping, observability).

**Architecture:** No new services. Worker gets `@cloudflare/vitest-pool-workers` (unit + integration tests with real D1 via miniflare); defects are fixed by extracting pure, testable helpers (`patterns.ts`, `utils/markdown.ts`, a `callJson` wrapper in `TelegramApi`). Backoffice fixes are verified with `astro check` + build (no test harness there yet — deferred to ULTRA phase). A GitHub Actions workflow gates PRs.

**Tech Stack:** Cloudflare Workers, TypeScript strict, wrangler 4.x, vitest 3.x + @cloudflare/vitest-pool-workers, Astro 5 (backoffice), D1, R2.

**Spec:** The findings list in this plan's "Spec — defects to fix" section below (from the 2026-09-01 project analysis; the three `REPORT-20260307-*.md` files at repo root are prior audits, already resolved except two accepted LOWs).

## Global Constraints

- **Do NOT rotate the Telegram bot token** — explicit user decision (2026-09-01).
- No `npm install` beyond the packages approved for Task 1 (`vitest`, `@cloudflare/vitest-pool-workers`, worker workspace only).
- Never modify migrations 0001–0013 and 0015 (applied to production). 0014 may be edited **only** to add `IF NOT EXISTS` (semantics-preserving; required to reconcile `d1_migrations` bookkeeping — see Task 7).
- Do not renumber/rename any migration file (renaming applied migrations desyncs wrangler's `d1_migrations` table).
- Commits: `type(scope): imperative subject`, ≤72 chars, English, one logical change each, ending with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Everything landing in the repo is English (code, comments, commits). Bot content strings stay Italian — they are data, not code.
- All work on branch `feature/stabilization` (backoffice auto-deploys from `main` via Cloudflare Pages — never push these changes directly to `main`).
- After each task: `npx tsc --noEmit` (worker) and `npm run test -w worker` must pass before commit.
- Bot response content/tone is untouched — this is stabilization only.

## Spec — defects to fix

1. Cron `0 3 * * *` also runs `processScheduledMessages()` → double-send race (`worker/src/index.ts:42`).
2. `TelegramApi` never checks `res.ok` / `body.ok` → failures invisible (`worker/src/services/telegram.ts`).
3. User-controlled text interpolated into `parse_mode: 'Markdown'` without escaping → broken messages (`worker/src/commands/text.ts:165,181,206,220,234,248,262,276,304,323`).
4. Broadcast fan-out serial, unbounded, no rate-limit handling (`worker/src/index.ts:8-31`).
5. Regex trigger patterns duplicated between `bot.ts:25-31` and `text.ts:47-133`; capslock math untested (`bot.ts:110-114`).
6. Zero tests, zero CI; backoffice auto-deploys from `main` ungated.
7. Migrations: duplicate ordinal `0003_*`, `0014` not idempotent (bare `CREATE INDEX`) and applied manually (bookkeeping desync), root scripts apply only 0001+0002.
8. `/api/config` PUT accepts arbitrary keys (`backoffice/src/pages/api/config.ts`).
9. Cmd+K search escapes only `<` on Telegram-controlled strings (`backoffice/src/layouts/Layout.astro:276,287,288`).
10. No `[observability]` in `worker/wrangler.toml`.
11. Endpoints added after the March audits (`scheduler`, `bulk-import`, `search`, `categories`) never security-reviewed.

Deferred to ULTRA phase (explicitly out of scope here): wrangler version alignment in backoffice, `/mydata` full Art. 15 export, MarkdownV2 migration, self-hosting Alpine/Chart.js + CSP tightening, backoffice test harness, robots.txt disallow rules, Telegram 429 `retry_after` handling.

---

### Task 0: Branch

**Files:** none

- [ ] **Step 1: Create the working branch**

```bash
cd /Users/andreamargiovanni/dev/SborrBot
git checkout -b feature/stabilization
```

---

### Task 1: Test infrastructure (worker)

**Files:**
- Modify: `worker/package.json` (devDeps + `test` script)
- Modify: `package.json` (root `test` script)
- Create: `worker/vitest.config.ts`
- Create: `worker/test/apply-migrations.ts`
- Create: `worker/test/tsconfig.json`
- Modify: `worker/tsconfig.json` (exclude `test/` from the prod type-check surface)
- Test: `worker/test/smoke.test.ts`

**Interfaces:**
- Produces: `npm run test -w worker` runs vitest in the Workers pool with real D1 (`env.DB`) with **all 16 migrations applied**, `env.BOT_TOKEN = 'test-token'`, `env.BOT_SECRET = 'test-secret'`, and `fetchMock` available from `cloudflare:test`. All later tasks rely on this.

- [ ] **Step 1: Install approved dev dependencies (worker workspace only)**

```bash
cd /Users/andreamargiovanni/dev/SborrBot
npm install -D vitest@^3.2.0 @cloudflare/vitest-pool-workers@latest -w worker
```

If the installed pool-workers version pins a different vitest major, align vitest to the version its peerDependencies require and note it in the commit body.

- [ ] **Step 2: Create `worker/vitest.config.ts`**

```ts
import path from 'node:path';
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig(async () => {
  const migrations = await readD1Migrations(path.join(__dirname, '../migrations'));

  return {
    test: {
      setupFiles: ['./test/apply-migrations.ts'],
      poolOptions: {
        workers: {
          wrangler: { configPath: './wrangler.toml' },
          miniflare: {
            compatibilityFlags: ['nodejs_compat'],
            bindings: {
              TEST_MIGRATIONS: migrations,
              BOT_TOKEN: 'test-token',
              BOT_SECRET: 'test-secret',
              OPENWEATHERMAP_API_KEY: 'test-owm-key',
            },
          },
        },
      },
    },
  };
});
```

- [ ] **Step 3: Create `worker/test/apply-migrations.ts`**

```ts
import { applyD1Migrations, env } from 'cloudflare:test';

await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
```

- [ ] **Step 4: Create `worker/test/tsconfig.json`**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "types": ["@cloudflare/workers-types", "@cloudflare/vitest-pool-workers"]
  },
  "include": ["./**/*.ts", "../src/**/*.ts"]
}
```

- [ ] **Step 5: Keep prod type-check clean — modify `worker/tsconfig.json`**

Change `"include": ["src/**/*.ts"]` → leave as is (it already excludes `test/`). Add nothing else. Verify `npx tsc --noEmit` still passes from `worker/`.

- [ ] **Step 6: Add scripts**

`worker/package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Root `package.json` scripts, add:

```json
"test": "npm run test -w worker"
```

- [ ] **Step 7: Write the smoke test `worker/test/smoke.test.ts`**

```ts
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
```

Note: `env.DB` typing in tests — declare the env shape once in `worker/test/env.d.ts`:

```ts
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
```

- [ ] **Step 8: Run and verify**

```bash
npm run test -w worker
```

Expected: 3 tests PASS. If `readD1Migrations` chokes on the duplicate `0003_*` ordinal, it does not — it sorts by filename; both apply on a fresh DB. If `0014`'s bare `CREATE INDEX` fails here it means migrations ran twice — fix the config, not the migration (Task 7 handles 0014).

- [ ] **Step 9: Commit**

```bash
git add worker/package.json worker/vitest.config.ts worker/test/ package.json package-lock.json
git commit -m "test(worker): add vitest with workers pool and D1 migrations"
```

---

### Task 2: Shared trigger patterns + capslock helper

**Files:**
- Create: `worker/src/patterns.ts`
- Modify: `worker/src/bot.ts` (remove local constants at lines 25-31, import; replace inline capslock math at lines 110-114)
- Modify: `worker/src/commands/text.ts` (PATTERNS entries at lines 47-53, 95-99, 100-105, 121-126, 127-133, 41 reference shared constants)
- Test: `worker/test/patterns.test.ts`

**Interfaces:**
- Produces: `JUVE_PATTERN, LAMENTI_PATTERN, BESTEMMIA_PATTERN, NAPOLI_PATTERN, ROMA_PATTERN, LAZIO_PATTERN, MILAN_PATTERN, CALCIO_PATTERN, EX_PATTERN, TERAPIA_PATTERN: RegExp` and `isCapslock(text: string): boolean` exported from `worker/src/patterns.ts`.

- [ ] **Step 1: Write the failing test `worker/test/patterns.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  JUVE_PATTERN, CALCIO_PATTERN, NAPOLI_PATTERN, EX_PATTERN, isCapslock,
} from '../src/patterns';

describe('trigger patterns', () => {
  it('matches juve words on word boundaries only', () => {
    expect(JUVE_PATTERN.test('forza juve!')).toBe(true);
    expect(JUVE_PATTERN.test('la Juventus vince')).toBe(true);
    expect(JUVE_PATTERN.test('juvenilia')).toBe(false);
  });

  it('CALCIO_PATTERN covers roma, lazio and milan fans', () => {
    expect(CALCIO_PATTERN.test('sono romanista')).toBe(true);
    expect(CALCIO_PATTERN.test('i laziali')).toBe(true);
    expect(CALCIO_PATTERN.test('milanisti ovunque')).toBe(true);
    expect(CALCIO_PATTERN.test('gioco a calcio')).toBe(false);
  });

  it('NAPOLI_PATTERN matches pizza but not pizzeria', () => {
    expect(NAPOLI_PATTERN.test('mangio una pizza')).toBe(true);
    expect(NAPOLI_PATTERN.test('vado in pizzeria')).toBe(false);
  });

  it('EX_PATTERN needs the possessive context', () => {
    expect(EX_PATTERN.test('la mia ex mi ha scritto')).toBe(true);
    expect(EX_PATTERN.test('unexploit')).toBe(false);
  });
});

describe('isCapslock', () => {
  it('false for short shouting', () => {
    expect(isCapslock('CIAO A')).toBe(false); // 5 letters < 10
  });
  it('true at 10+ letters and >=70% uppercase', () => {
    expect(isCapslock('MA CHE CAZZO DICI')).toBe(true);
  });
  it('false below 70% uppercase', () => {
    expect(isCapslock('MA che cazzo dici oggi')).toBe(false);
  });
  it('ignores digits and punctuation', () => {
    expect(isCapslock('1234567890!!!')).toBe(false); // zero letters
  });
  it('handles accented uppercase', () => {
    expect(isCapslock('PERCHÉ NON RISPONDI')).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test -w worker -- patterns` — Expected: FAIL (module `../src/patterns` not found).

- [ ] **Step 3: Create `worker/src/patterns.ts`**

Move the regexes **verbatim** from `bot.ts:25-31` (JUVE, LAMENTI, BESTEMMIA, NAPOLI, EX, TERAPIA) and split CALCIO into its three components matching `text.ts:49,51,53`:

```ts
// Trigger patterns shared by auto-reactions (bot.ts) and text responses (commands/text.ts).
export const JUVE_PATTERN = /\b(?:juve|juventus|gobbi|bianconeri)\b/i;
export const LAMENTI_PATTERN = /\b(?:ho fame|sono stanco|sono stanca|che noia|mi annoio|sono triste|che palle|ho sonno|sono depresso|sono depressa|sto male|non ce la faccio|sono solo|sono sola|ho caldo|ho freddo|sono stressato|sono stressata|mi fa male|che fatica|sono esausto|sono esausta|che barba|sono a pezzi|non ne posso pi[uù]|basta tutto)\b/i;
export const BESTEMMIA_PATTERN = /\bbestemmia\b/i;
export const NAPOLI_PATTERN = /\b(?:napoli|napoletan[oiae]|vesuvio|pizza|pizzaiolo|mozzarella|sfogliatella|maradona|pulcinella|camorra|gomorra|totò|toto|pino daniele|spaccanapoli|posillipo|vomero|scampia|secondigliano|marechiaro|fuorigrotta|san gennaro|babà|baba|ragù|ragu|friarielli|cuoppo|o sole mio)\b/i;
export const ROMA_PATTERN = /\b(?:romanista|romanisti|giallorossi|as roma|lupacchiotti|trigoria)\b/i;
export const LAZIO_PATTERN = /\b(?:laziale|laziali|biancocelesti|aquilotti|ss lazio|lotito)\b/i;
export const MILAN_PATTERN = /\b(?:milanista|milanisti|rossoneri|ac milan|casciavit)\b/i;
export const CALCIO_PATTERN = new RegExp(
  [ROMA_PATTERN, LAZIO_PATTERN, MILAN_PATTERN].map((p) => p.source).join('|'),
  'i'
);
export const EX_PATTERN = /\b(?:la mia ex|il mio ex|mia ex|mio ex|ex ragazza|ex fidanzata|ex fidanzato|ex moglie|ex marito|ex morosa|ex moroso)\b/i;
export const TERAPIA_PATTERN = /\b(?:terapia|psicologo|psicologa|psichiatra|psicanalisi|psicanalista|vado dallo psicologo|seduta dallo psicologo|lo psicologo)\b/i;

// A message counts as capslock shouting when it has at least 10 letters
// and at least 70% of them are uppercase.
export function isCapslock(text: string): boolean {
  const letters = text.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  if (letters.length < 10) return false;
  const upperCount = letters.replace(/[^A-ZÀ-Ö]/g, '').length;
  return upperCount / letters.length >= 0.7;
}
```

- [ ] **Step 4: Run to verify tests pass**

Run: `npm run test -w worker -- patterns` — Expected: PASS.

- [ ] **Step 5: Refactor `bot.ts` to import**

Delete constants at `bot.ts:25-31`; add `import { JUVE_PATTERN, LAMENTI_PATTERN, BESTEMMIA_PATTERN, NAPOLI_PATTERN, CALCIO_PATTERN, EX_PATTERN, TERAPIA_PATTERN, isCapslock } from './patterns';`. Replace lines 110-113 body with:

```ts
  if (isCapslock(text)) {
    const capsResponse = await getRandomTextResponse(env.DB, 'capslock');
    if (capsResponse) {
      await api.sendMessage(chatId, capsResponse);
      await logBotCommand(env.DB, chatId, userId, username, 'keyword', 'capslock', null, 'text');
    }
  }
```

- [ ] **Step 6: Refactor `text.ts` PATTERNS entries to reference the shared constants**

Import the shared patterns; replace the inline literals in the entries for `anti-juve` (line 47 → `JUVE_PATTERN`), `anti-roma` (49 → `ROMA_PATTERN`), `anti-lazio` (51 → `LAZIO_PATTERN`), `anti-milan` (53 → `MILAN_PATTERN`), `bestemmie` (41 → `BESTEMMIA_PATTERN`), `lamenti` (96 → `LAMENTI_PATTERN`), `napoletano` (102 → `NAPOLI_PATTERN`), `ex` (122 → `EX_PATTERN`), `terapia` (129 → `TERAPIA_PATTERN`).

- [ ] **Step 7: Verify full suite + types, then commit**

```bash
cd worker && npx tsc --noEmit && cd .. && npm run test -w worker
git add worker/src/patterns.ts worker/src/bot.ts worker/src/commands/text.ts worker/test/patterns.test.ts
git commit -m "refactor(worker): extract shared trigger patterns and capslock check"
```

---

### Task 3: Markdown escaping for interpolated user input

**Files:**
- Create: `worker/src/utils/markdown.ts`
- Modify: `worker/src/commands/text.ts` (all handlers that pass `'Markdown'` with interpolated user/db-derived values: lines 165, 181, 206, 220, 234, 248, 262, 276, 304, 323)
- Test: `worker/test/markdown.test.ts`

**Interfaces:**
- Produces: `escapeMarkdown(text: string): string` from `worker/src/utils/markdown.ts` — escapes the four legacy-Markdown metacharacters `_ * \` [`.

- [ ] **Step 1: Write the failing test `worker/test/markdown.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { escapeMarkdown } from '../src/utils/markdown';

describe('escapeMarkdown', () => {
  it('escapes legacy Markdown metacharacters', () => {
    expect(escapeMarkdown('mario_rossi')).toBe('mario\\_rossi');
    expect(escapeMarkdown('*bold* `code` [link')).toBe('\\*bold\\* \\`code\\` \\[link');
  });
  it('leaves plain text untouched', () => {
    expect(escapeMarkdown('Gennaro Esposito')).toBe('Gennaro Esposito');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npm run test -w worker -- markdown` → FAIL (module not found).

- [ ] **Step 3: Create `worker/src/utils/markdown.ts`**

```ts
// Telegram legacy Markdown (parse_mode: 'Markdown') breaks with HTTP 400 when an
// interpolated value contains an unbalanced _ * ` or [. Escape values, not templates.
export function escapeMarkdown(text: string): string {
  return text.replace(/([_*`\[])/g, '\\$1');
}
```

- [ ] **Step 4: Run to verify it passes.**

- [ ] **Step 5: Apply at every interpolation site in `text.ts`**

Rule: escape **values** (match targets, usernames from `getTwoRandomGroupUsers`/`getRandomGroupUser`, `weather.cityName`), never the DB response templates (they intentionally contain `*`). Concretely:
- `handleComboInsulti` (line 181): `` `\u{1F480} *COMBO INSULTI per ${escapeMarkdown(target)}:*...` ``
- Handlers building `finalText` by substituting usernames into templates (lines 206, 220, 234, 248, 262, 276, 323): escape each username/target **before** the `.replace('{name…}', …)` substitution.
- `handleMeteo` (line 304): `escapeMarkdown(weather.cityName.toUpperCase())`.
- `handleOroscopo` (line 165): `displayName` comes from the internal `ZODIAC_NAMES` constant → no change needed; confirm and leave a one-line note in the PR description, not in code.

- [ ] **Step 6: Full verification + commit**

```bash
cd worker && npx tsc --noEmit && cd .. && npm run test -w worker
git add worker/src/utils/markdown.ts worker/src/commands/text.ts worker/test/markdown.test.ts
git commit -m "fix(worker): escape user input interpolated into Markdown messages"
```

---

### Task 4: TelegramApi result checking

**Files:**
- Modify: `worker/src/services/telegram.ts` (all methods)
- Test: `worker/test/telegram.test.ts`

**Interfaces:**
- Produces: `interface TelegramResponse { ok: boolean; description?: string; error_code?: number; result?: unknown }` exported from `telegram.ts`. Every JSON-body method routes through `private async callJson(method: string, payload: Record<string, unknown>): Promise<TelegramResponse>`; form-data methods (`sendPhoto`/`sendAudio` blob branches) route through `private async callForm(method: string, form: FormData): Promise<TelegramResponse>`. Both log `console.error` on `!res.ok || !body.ok` and **return** the body (never throw — callers already treat failures as soft).

- [ ] **Step 1: Write the failing test `worker/test/telegram.test.ts`**

```ts
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
```

- [ ] **Step 2: Run to verify it fails** — the 400/502 assertions fail against the current code (no logging, `res.json()` on plain text throws). Expected: FAIL.

- [ ] **Step 3: Rewrite `telegram.ts` around the two private helpers**

```ts
const TELEGRAM_API = 'https://api.telegram.org/bot';

export interface TelegramResponse {
  ok: boolean;
  description?: string;
  error_code?: number;
  result?: unknown;
}

export class TelegramApi {
  private baseUrl: string;

  constructor(botToken: string) {
    this.baseUrl = `${TELEGRAM_API}${botToken}`;
  }

  private async handle(method: string, res: Response): Promise<TelegramResponse> {
    let body: TelegramResponse;
    try {
      body = (await res.json()) as TelegramResponse;
    } catch {
      body = { ok: false, error_code: res.status, description: `HTTP ${res.status}: non-JSON response` };
    }
    if (!res.ok || !body.ok) {
      console.error(`Telegram API ${method} failed:`, body.description ?? `HTTP ${res.status}`);
    }
    return body;
  }

  private async callJson(method: string, payload: Record<string, unknown>): Promise<TelegramResponse> {
    const res = await fetch(`${this.baseUrl}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handle(method, res);
  }

  private async callForm(method: string, form: FormData): Promise<TelegramResponse> {
    const res = await fetch(`${this.baseUrl}/${method}`, { method: 'POST', body: form });
    return this.handle(method, res);
  }

  async sendMessage(chatId: number | string, text: string, parseMode?: string): Promise<TelegramResponse> {
    return this.callJson('sendMessage', { chat_id: chatId, text, parse_mode: parseMode });
  }

  async sendPhoto(chatId: number | string, photo: Blob | string, caption?: string): Promise<TelegramResponse> {
    if (typeof photo === 'string') {
      return this.callJson('sendPhoto', { chat_id: chatId, photo, caption });
    }
    const form = new FormData();
    form.append('chat_id', String(chatId));
    form.append('photo', photo, 'photo.jpg');
    if (caption) form.append('caption', caption);
    return this.callForm('sendPhoto', form);
  }

  async sendAudio(chatId: number | string, audio: Blob | string, filename?: string, title?: string): Promise<TelegramResponse> {
    if (typeof audio === 'string') {
      return this.callJson('sendAudio', { chat_id: chatId, audio, title });
    }
    const form = new FormData();
    form.append('chat_id', String(chatId));
    form.append('audio', audio, filename || 'audio.mp3');
    if (title) form.append('title', title);
    return this.callForm('sendAudio', form);
  }

  async sendSticker(chatId: number | string, sticker: string): Promise<TelegramResponse> {
    return this.callJson('sendSticker', { chat_id: chatId, sticker });
  }

  async setWebhook(url: string, secret: string): Promise<TelegramResponse> {
    return this.callJson('setWebhook', {
      url,
      secret_token: secret,
      allowed_updates: ['message', 'inline_query'],
    });
  }

  async deleteWebhook(): Promise<TelegramResponse> {
    const res = await fetch(`${this.baseUrl}/deleteWebhook`, { method: 'POST' });
    return this.handle('deleteWebhook', res);
  }

  async answerInlineQuery(queryId: string, results: unknown[]): Promise<TelegramResponse> {
    return this.callJson('answerInlineQuery', { inline_query_id: queryId, results, cache_time: 10 });
  }

  async setMessageReaction(chatId: number | string, messageId: number, emoji: string): Promise<void> {
    await this.callJson('setMessageReaction', {
      chat_id: chatId,
      message_id: messageId,
      reaction: [{ type: 'emoji', emoji }],
    });
  }
}
```

Callers use the results loosely (`media.ts` reads `result.result?.photo` etc. off the old `any`); fix any resulting type errors by narrowing `result` locally (`const r = res.result as { photo?: ... }`) — do not re-widen to `any`.

- [ ] **Step 4: Run to verify pass** — `npm run test -w worker -- telegram` → PASS; then `npx tsc --noEmit` in `worker/`.

- [ ] **Step 5: Commit**

```bash
git add worker/src/services/telegram.ts worker/src/commands/ worker/test/telegram.test.ts
git commit -m "fix(worker): check and log Telegram API failures"
```

---

### Task 5: Cron branching fix + bounded broadcast fan-out

**Files:**
- Modify: `worker/src/index.ts` (`scheduled()` at lines 34-46 and `processScheduledMessages` at lines 8-31; export `processScheduledMessages` for tests)
- Test: `worker/test/scheduled.test.ts`

**Interfaces:**
- Consumes: `TelegramResponse` from Task 4.
- Produces: `scheduled()` runs the purge **only** on `0 3 * * *` and the broadcast **only** on `* * * * *`. `processScheduledMessages(env: Env): Promise<number>` (exported) sends in batches of 20 via `Promise.allSettled` with a 1100 ms pause between batches, counting only `body.ok === true` sends.

- [ ] **Step 1: Write the failing test `worker/test/scheduled.test.ts`**

```ts
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
```

- [ ] **Step 2: Run to verify the second test fails** (current code broadcasts on both crons). Expected: FAIL on `does NOT broadcast on the daily purge cron`.

- [ ] **Step 3: Fix `scheduled()` and harden the fan-out in `index.ts`**

```ts
const LOG_RETENTION_DAYS = 90;
const BROADCAST_BATCH_SIZE = 20; // Telegram caps broadcasts around 30 msg/s
const BROADCAST_BATCH_PAUSE_MS = 1100;

export async function processScheduledMessages(env: Env): Promise<number> {
  const api = new TelegramApi(env.BOT_TOKEN);
  const messages = await getDueScheduledMessages(env.DB);
  let sent = 0;

  for (const msg of messages) {
    const chatIds = msg.target_group_id
      ? [msg.target_group_id]
      : await getActiveGroupChatIds(env.DB);

    for (let i = 0; i < chatIds.length; i += BROADCAST_BATCH_SIZE) {
      if (i > 0) await new Promise((r) => setTimeout(r, BROADCAST_BATCH_PAUSE_MS));
      const batch = chatIds.slice(i, i + BROADCAST_BATCH_SIZE);
      const results = await Promise.allSettled(batch.map((chatId) => api.sendMessage(chatId, msg.message_text)));
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.ok) sent++;
        else console.error(`Scheduled message ${msg.id} delivery failed:`, r.status === 'rejected' ? r.reason : r.value.description);
      }
    }

    await markScheduledMessageSent(env.DB, msg.id, msg.schedule_type === 'once');
  }

  return sent;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    if (event.cron === '0 3 * * *') {
      const deleted = await purgeOldLogs(env.DB, LOG_RETENTION_DAYS);
      console.log(`Cron: purged ${deleted} logs older than ${LOG_RETENTION_DAYS} days`);
      return;
    }

    const sent = await processScheduledMessages(env);
    if (sent > 0) {
      console.log(`Cron: sent ${sent} scheduled messages`);
    }
  },
  // fetch() unchanged
};
```

- [ ] **Step 4: Run to verify pass** — `npm run test -w worker -- scheduled` → PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add worker/src/index.ts worker/test/scheduled.test.ts
git commit -m "fix(worker): stop broadcast double-send and bound cron fan-out"
```

---

### Task 6: Weather logic tests

**Files:**
- Modify: `worker/src/services/weather.ts` (export `categorizeWeather`; no behavior change)
- Test: `worker/test/weather.test.ts`

**Interfaces:**
- Consumes: `WeatherData`, `buildWeatherMessage` (already exported).
- Produces: `categorizeWeather(weather: WeatherData): WeatherCategory` exported; `WeatherCategory` type exported.

- [ ] **Step 1: Write the failing test `worker/test/weather.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { categorizeWeather, buildWeatherMessage, WeatherData } from '../src/services/weather';

function wd(overrides: Partial<WeatherData>): WeatherData {
  return {
    conditionCode: 800, conditionMain: 'Clear', description: 'cielo sereno',
    temperature: 20, feelsLike: 20, humidity: 50, windSpeed: 3, cityName: 'Roma',
    ...overrides,
  };
}

describe('categorizeWeather', () => {
  it('temperature extremes win over condition codes', () => {
    expect(categorizeWeather(wd({ temperature: 35, conditionCode: 500 }))).toBe('caldo');
    expect(categorizeWeather(wd({ temperature: 0, conditionCode: 800 }))).toBe('freddo');
  });
  it('maps condition code ranges', () => {
    expect(categorizeWeather(wd({ conditionCode: 211 }))).toBe('temporale');
    expect(categorizeWeather(wd({ conditionCode: 501 }))).toBe('pioggia');
    expect(categorizeWeather(wd({ conditionCode: 601 }))).toBe('neve');
    expect(categorizeWeather(wd({ conditionCode: 741 }))).toBe('nebbia');
    expect(categorizeWeather(wd({ conditionCode: 800 }))).toBe('sereno');
    expect(categorizeWeather(wd({ conditionCode: 803 }))).toBe('nuvole');
  });
});

describe('buildWeatherMessage', () => {
  it('substitutes every placeholder', () => {
    for (let i = 0; i < 20; i++) {
      const msg = buildWeatherMessage(wd({ temperature: 22, windSpeed: 5 }));
      expect(msg).not.toMatch(/\{(temp|feels_like|desc|humidity|wind)\}/);
      expect(msg).toContain('22');
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL: `categorizeWeather` is not exported.

- [ ] **Step 3: Export** — in `weather.ts` change `type WeatherCategory = …` → `export type WeatherCategory = …` and `function categorizeWeather` → `export function categorizeWeather`.

- [ ] **Step 4: Run to verify pass, then commit**

```bash
git add worker/src/services/weather.ts worker/test/weather.test.ts
git commit -m "test(worker): cover weather categorization and templating"
```

---

### Task 7: Migration hygiene

**Files:**
- Modify: `migrations/0014_scheduled_messages.sql` (add `IF NOT EXISTS` to the index — the table already has it)
- Modify: `package.json` (root db scripts)
- Create: `migrations/README.md`

**Interfaces:** none (ops task). Constraint reminder: 0014 was applied to production **manually** (`d1 execute`), so it is NOT recorded in `d1_migrations`; the next `wrangler d1 migrations apply --remote` will re-run it. Making it fully idempotent is what makes that re-run a safe no-op that reconciles the bookkeeping. This is the sanctioned exception to "never modify an applied migration".

- [ ] **Step 1: Make 0014 idempotent**

In `migrations/0014_scheduled_messages.sql` change the last line to:

```sql
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_active ON scheduled_messages(is_active, scheduled_at);
```

- [ ] **Step 2: Fix root db scripts in `package.json`**

Replace the two `db:*` scripts with:

```json
"db:migrate:local": "cd worker && npx wrangler d1 migrations apply sborrbot-db --local",
"db:migrate:remote": "cd worker && npx wrangler d1 migrations apply sborrbot-db --remote"
```

- [ ] **Step 3: Create `migrations/README.md`**

```markdown
# Migrations

Applied with `npm run db:migrate:local` / `db:migrate:remote`
(`wrangler d1 migrations apply`, ordered by filename).

## Known quirks — do not "fix" these

- `0003_anti_juve.sql` and `0003_bulk_content.sql` share the ordinal `0003`.
  Both are applied in production. Do NOT renumber or rename them: wrangler
  tracks applied migrations by filename in the `d1_migrations` table, and a
  rename would make it re-run seed data.
- `0014_scheduled_messages.sql` was originally applied manually via
  `wrangler d1 execute`, so it may be missing from `d1_migrations` remotely.
  It is fully idempotent (`IF NOT EXISTS` on table and index), so
  `db:migrate:remote` re-running it is a safe no-op that reconciles the
  bookkeeping. Check state with:
  `cd worker && npx wrangler d1 migrations list sborrbot-db --remote`

## Rules for new migrations

- Next free ordinal, zero-padded to 4 digits, snake_case description.
- Idempotent DDL (`IF NOT EXISTS`) — D1 has no `down()`; idempotence is the
  rollback story.
- Never modify a migration that has reached production.
```

- [ ] **Step 4: Verify locally on a fresh DB**

```bash
cd worker
rm -rf .wrangler/state 2>/dev/null || true
npx wrangler d1 migrations apply sborrbot-db --local
```

Expected: all 16 migrations apply cleanly. Then re-run the same command: expected "no migrations to apply". Also `npm run test -w worker` still green (test pool applies the same files).

- [ ] **Step 5: Commit**

```bash
git add migrations/0014_scheduled_messages.sql migrations/README.md package.json
git commit -m "chore(db): make 0014 idempotent and fix migration scripts"
```

**Note:** do NOT run `db:migrate:remote` in this task — production reconciliation happens at release time, after the PR is merged, run by the user.

---

### Task 8: `/api/config` key allowlist

**Files:**
- Modify: `backoffice/src/pages/api/config.ts`

**Interfaces:** none new. Allowed keys are exactly the ones seeded in `migrations/0002_seed_data.sql` and rendered by `settings.astro`: `bot_name`, `rate_limit_per_minute`, `nsfw_default`, `audio_default`.

- [ ] **Step 1: Add validation to the PUT handler**

After the existing `key`/`value` presence check in `backoffice/src/pages/api/config.ts`, add:

```ts
const ALLOWED_CONFIG_KEYS = new Set(['bot_name', 'rate_limit_per_minute', 'nsfw_default', 'audio_default']);
```

(top of file, module scope) and in the handler:

```ts
  if (typeof key !== 'string' || !ALLOWED_CONFIG_KEYS.has(key)) {
    return new Response(JSON.stringify({ error: 'Chiave di configurazione non valida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (typeof value !== 'string' || value.length > 500) {
    return new Response(JSON.stringify({ error: 'Valore non valido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
```

(Error strings stay Italian: they are user-facing UI copy, same as the existing `'key e value sono obbligatori'`.)

- [ ] **Step 2: Verify**

```bash
cd backoffice && npx astro check
```

Expected: no new errors. **Deviation note (approved in plan review):** the backoffice has no test harness; this fix is gated by `astro check` + the CI build until the ULTRA phase adds one. Optionally verify by hand with `npm run dev:backoffice` and two curls (allowed key → 200, `{"key":"evil","value":"x"}` → 400).

- [ ] **Step 3: Commit**

```bash
git add backoffice/src/pages/api/config.ts
git commit -m "fix(backoffice): allowlist bot_config keys in config API"
```

---

### Task 9: Cmd+K search — full HTML escaping

**Files:**
- Modify: `backoffice/src/layouts/Layout.astro` (the `is:inline` search script, lines ~276-288)

- [ ] **Step 1: Add an `esc()` helper inside the inline script**

Near the top of the `<script is:inline>` block (after the `var typeLinks = {...}` declaration):

```js
      function esc(s) {
        return String(s)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }
```

- [ ] **Step 2: Use it at all three interpolation sites**

- Line 276: `q.replace(/</g, '&lt;')` → `esc(q)`
- Line 287: `(r.title || '-').replace(/</g, '&lt;')` → `esc(r.title || '-')`
- Line 288: `r.subtitle.replace(/</g, '&lt;')` → `esc(r.subtitle)`

- [ ] **Step 3: Verify**

```bash
cd backoffice && npx astro check && npm run build
```

Expected: build green. Same deviation note as Task 8 (no backoffice harness; inline script untestable until extracted — ULTRA phase).

- [ ] **Step 4: Commit**

```bash
git add backoffice/src/layouts/Layout.astro
git commit -m "fix(backoffice): fully escape search results in Cmd+K modal"
```

---

### Task 10: Worker observability

**Files:**
- Modify: `worker/wrangler.toml`

- [ ] **Step 1: Add the block** (after `[triggers]`):

```toml
[observability]
enabled = true
```

(The backoffice is a Pages project: its logging is enabled from the Cloudflare dashboard, not wrangler.toml — nothing to change there.)

- [ ] **Step 2: Verify config parses**

```bash
cd worker && npx wrangler deploy --dry-run
```

Expected: dry-run succeeds.

- [ ] **Step 3: Commit**

```bash
git add worker/wrangler.toml
git commit -m "chore(worker): enable workers observability logs"
```

---

### Task 11: CI — GitHub Actions

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:** consumes the `test` scripts from Task 1.

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  worker:
    name: Worker (typecheck + tests)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
        working-directory: worker
      - run: npm run test -w worker

  backoffice:
    name: Backoffice (astro check + build)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx astro check
        working-directory: backoffice
      - run: npm run build
        working-directory: backoffice
```

- [ ] **Step 2: Verify locally what CI will run**

```bash
npm ci && (cd worker && npx tsc --noEmit) && npm run test -w worker && (cd backoffice && npx astro check && npm run build)
```

Expected: all green.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add typecheck, test and build workflow"
```

**Manual follow-up for the user (dashboard, not code):** Cloudflare Pages deploys `main` on push regardless of CI. To make CI actually gate production, enable GitHub branch protection on `main` requiring the `Worker (typecheck + tests)` and `Backoffice (astro check + build)` checks.

---

### Task 12: Security review of post-March surface + PR

**Files:** none created up front; fixes (if any) get their own commits.

- [ ] **Step 1: Run the security review**

Invoke the `security-review` skill on the branch. Explicitly extend attention to the endpoints never covered by the March audits: `backoffice/src/pages/api/scheduler.ts`, `backoffice/src/pages/api/content/bulk-import.ts`, `backoffice/src/pages/api/search.ts`, `backoffice/src/pages/api/categories.ts`, and the scheduler/logs pages.

- [ ] **Step 2: Triage findings**

Per repo policy, each finding is **reported to the user** (what it is, what it exposes) before fixing. Fix confirmed findings with one commit per finding (`fix(backoffice): …`), each gated by `astro check`/tests as applicable.

- [ ] **Step 3: Final full verification**

```bash
npm ci && (cd worker && npx tsc --noEmit) && npm run test -w worker && (cd backoffice && npx astro check && npm run build)
```

Show the output. All green = done per repo definition of done.

- [ ] **Step 4: Open the PR**

```bash
git push -u origin feature/stabilization
gh pr create --base main --title "Stabilization: tests, CI, and defect fixes" --body "..."
```

PR body states: what changed (per task), why, how to test (`npm run test -w worker`, CI), breaking changes (none — behavior-preserving except the intentional cron/broadcast fixes), and the two manual follow-ups (branch protection; `npm run db:migrate:remote` at release to reconcile 0014).

---

## Self-review

- Spec coverage: findings 1→Task 5, 2→Task 4, 3→Task 3, 4→Task 5, 5→Task 2, 6→Tasks 1+11, 7→Task 7, 8→Task 8, 9→Task 9, 10→Task 10, 11→Task 12. All covered; deferred items listed explicitly.
- Placeholder scan: none — every step has concrete code/commands.
- Type consistency: `TelegramResponse` defined in Task 4 and consumed in Task 5's fan-out (`r.value.ok`, `r.value.description`); `processScheduledMessages` exported in Task 5 matching its test import; `isCapslock`/pattern names consistent between Tasks 2's test and implementation.
- Known risk: exact `@cloudflare/vitest-pool-workers` ↔ vitest version pairing may need adjustment at install time (Task 1 Step 1 covers it).
