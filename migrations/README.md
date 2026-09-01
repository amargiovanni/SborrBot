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
