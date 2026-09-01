# Migrations

Applied with `npm run db:migrate:local` / `db:migrate:remote`
(`wrangler d1 migrations apply`, ordered by filename).

## Known quirks — do not "fix" these

- `0003_anti_juve.sql` and `0003_bulk_content.sql` share the ordinal `0003`.
  Both are applied in production. Do NOT renumber or rename them: wrangler
  tracks applied migrations by filename in the `d1_migrations` table, and a
  rename would make it re-run seed data.
- **Do NOT run `npm run db:migrate:remote` until the bookkeeping below is
  backfilled.** Verified on 2026-09-01: the remote `d1_migrations` table
  records ONLY `0001_initial_schema.sql` — migrations `0002`–`0015` were all
  applied manually via `wrangler d1 execute`. Running `migrations apply
  --remote` in this state would re-execute fourteen files, duplicating seed
  content or failing on UNIQUE constraints mid-sequence.

  Reconciliation (one-time, against the production DB):

  1. Verify the current state (expect a single `0001` row):
     `cd worker && npx wrangler d1 execute sborrbot-db --remote --command "SELECT name FROM d1_migrations ORDER BY id"`
  2. Backfill the bookkeeping (records the files as applied — runs no DDL):
     ```sql
     INSERT INTO d1_migrations (name) VALUES
       ('0002_seed_data.sql'),('0003_anti_juve.sql'),('0003_bulk_content.sql'),
       ('0004_extra_dirty_content.sql'),('0005_new_features.sql'),
       ('0006_media_uploads.sql'),('0007_new_features_2.sql'),
       ('0008_new_features_3.sql'),('0009_extreme_features.sql'),
       ('0010_napoletano.sql'),('0011_new_triggers.sql'),
       ('0012_tinder_profezia.sql'),('0013_bollettino_capslock.sql'),
       ('0014_scheduled_messages.sql'),('0015_televendita_asta_esorcismo.sql');
     ```
     (Skip any name already present if step 1 showed more than `0001`.)
  3. Confirm: `npx wrangler d1 migrations list sborrbot-db --remote` must
     report no unapplied migrations. From then on `db:migrate:remote` is safe.

  Note 2026-09-01: the D1 HTTP API was intermittently returning
  `internal error [code: 7500]` on schema-introspection queries
  (`sqlite_schema`, `PRAGMA`) and some counts; if that happens, wait and
  retry rather than assuming state.

## Rules for new migrations

- Next free ordinal, zero-padded to 4 digits, snake_case description.
- Idempotent DDL (`IF NOT EXISTS`) — D1 has no `down()`; idempotence is the
  rollback story.
- Never modify a migration that has reached production.
