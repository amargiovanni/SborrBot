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
- [ ] Reconcile remote `d1_migrations` bookkeeping — **NOT the "safe no-op" the PR #6 body claimed**: remote table records only 0001; 0002–0015 were applied via `d1 execute`. Follow the backfill procedure in `migrations/README.md` (blocked on 2026-09-01 by intermittent D1 API 7500 errors; retry when healthy). Do NOT run `db:migrate:remote` before the backfill.

ULTRA-phase backlog (deferred by ruling):
- middleware direct `context.redirect()` calls bypass security headers (first fast-follow)
- install `@astrojs/check` (needs npm-install permission) → restore astro check in CI
- backoffice test harness
- pool-workers 0.22 + vitest 4 upgrade; wrangler 4.72→4.127; dev-tooling npm audit triage
- worker constant-time secret compares (parked, accepted in 2 audits)
- Telegram 429 retry_after handling; MarkdownV2; self-host Alpine/Chart.js + CSP tightening; /mydata Art.15 export
- answerInlineQuery dead code (+ setWebhook subscribes to inline_query nothing handles)
