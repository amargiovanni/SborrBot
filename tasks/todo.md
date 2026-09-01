# ULTRA batch 1 — 2026-09-01 — DONE (PRs #8, #9, #10) + extras

Design approved in chat (bounded path): 3 separate PRs, order 1→2→3.
Decisions: vitest installed in backoffice (npm-install permission granted);
429 policy = single retry, only when retry_after ≤ 5s; MarkdownV2 via `mdv2`
tagged template escaping interpolations, static text authored pre-escaped.

- [x] PR 1 (#8) `fix(backoffice)`: wrapped the 3 direct `context.redirect()` calls in
      `withSecurityHeaders()`; vitest harness added to backoffice + 4 middleware tests (TDD)
- [x] PR 2 (#9) `feat(worker)`: TelegramApi retries once on 429 when
      `parameters.retry_after` ≤ 5s; 3 tests with fetchMock
- [x] PR 3 (#10) `feat(worker)`: parse_mode Markdown → MarkdownV2 across text.ts/slash.ts
      via `mdv2` tagged template; legacy escapeMarkdown removed; 11 new tests; verified
      locally via wrangler dev + webhook POST (real-group smoke test after deploy pending)
- [x] Extra (#11) `feat(landing)`: conversion overhaul of backoffice/src/pages/index.astro
      (nav CTA to startgroup link, faster hero CTA, fake-chat demo section, mid CTA,
      sticky mobile CTA, reassurance bullets)
- [ ] Extra: `docs(readme)` deep update (testing/CI section, MarkdownV2+429, npm migrate
      scripts, updated numbers) — PR open

# Stabilization — 2026-09-01 — DONE (PR #6)

Full plan: `docs/superpowers/plans/2026-09-01-stabilization.md`
PR: https://github.com/amargiovanni/SborrBot/pull/6 (feature/stabilization → main, 21 commits)

Constraint honored: Telegram bot token NOT rotated (user decision).

- [x] Task 0: branch `feature/stabilization`
- [x] Task 1: vitest + @cloudflare/vitest-pool-workers (pinned 0.12.21), D1 migrations in tests, smoke test
- [x] Task 2: shared patterns + `isCapslock()` extracted and tested
- [x] Task 3: `escapeMarkdown()` + applied at all Markdown interpolation sites in text.ts
- [x] Task 4: TelegramApi checks/logs failures, typed `TelegramResponse`
- [x] Task 5: cron branching fix + batched fan-out (then atomic claim in final wave)
- [x] Task 6: weather tests
- [x] Task 7: 0014 idempotent, migration scripts fixed, migrations/README.md
- [x] Task 8: /api/config allowlist (+ settings unrecognized keys read-only)
- [x] Task 9: Cmd+K full HTML escaping
- [x] Task 10: worker observability
- [x] Task 11: CI (worker tsc + tsc -p test + vitest; backoffice build; token read-only)
- [x] Task 12: security review (11 findings + slash.ts) — all fixed except parked F10; final whole-branch review "Ready to merge: Yes"

Release follow-ups:
- [x] Branch protection on main requiring `Worker (typecheck + tests)` + `Backoffice (build)` (enabled via API, 2026-09-01)
- [x] Reconcile remote `d1_migrations` bookkeeping — backfill completed 2026-09-01 (15 rows inserted; `migrations list --remote` reports "No migrations to apply"). `db:migrate:remote` is now safe for future migrations. Procedure documented in `migrations/README.md` (PR #7).

ULTRA-phase backlog (deferred by ruling):
- middleware direct `context.redirect()` calls bypass security headers (first fast-follow)
- install `@astrojs/check` (needs npm-install permission) → restore astro check in CI
- backoffice test harness
- pool-workers 0.22 + vitest 4 upgrade; wrangler 4.72→4.127; dev-tooling npm audit triage
- worker constant-time secret compares (parked, accepted in 2 audits)
- Telegram 429 retry_after handling; MarkdownV2; self-host Alpine/Chart.js + CSP tightening; /mydata Art.15 export
- answerInlineQuery dead code (+ setWebhook subscribes to inline_query nothing handles)
