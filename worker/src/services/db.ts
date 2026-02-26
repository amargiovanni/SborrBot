export async function getRandomTextResponse(db: D1Database, categorySlug: string): Promise<string | null> {
  const result = await db
    .prepare(
      `SELECT tr.content FROM text_responses tr
       JOIN categories c ON c.id = tr.category_id
       WHERE c.slug = ? AND tr.is_active = 1 AND c.is_active = 1
       ORDER BY RANDOM() LIMIT 1`
    )
    .bind(categorySlug)
    .first<{ content: string }>();
  return result?.content ?? null;
}

export async function getMultipleRandomTextResponses(db: D1Database, categorySlug: string, count: number): Promise<string[]> {
  const result = await db
    .prepare(
      `SELECT tr.content FROM text_responses tr
       JOIN categories c ON c.id = tr.category_id
       WHERE c.slug = ? AND tr.is_active = 1 AND c.is_active = 1
       ORDER BY RANDOM() LIMIT ?`
    )
    .bind(categorySlug, count)
    .all<{ content: string }>();
  return result.results.map(r => r.content);
}

export async function getRandomMedia(db: D1Database, categorySlug: string): Promise<{
  r2_key: string;
  file_name: string;
  mime_type: string | null;
  telegram_file_id: string | null;
  caption: string | null;
  id: number;
} | null> {
  return db
    .prepare(
      `SELECT m.id, m.r2_key, m.file_name, m.mime_type, m.telegram_file_id, m.caption
       FROM media m
       JOIN categories c ON c.id = m.category_id
       WHERE c.slug = ? AND m.is_active = 1 AND c.is_active = 1
       ORDER BY RANDOM() LIMIT 1`
    )
    .bind(categorySlug)
    .first();
}

export async function updateTelegramFileId(db: D1Database, mediaId: number, fileId: string): Promise<void> {
  await db.prepare('UPDATE media SET telegram_file_id = ? WHERE id = ?').bind(fileId, mediaId).run();
}

export async function isGroupActive(db: D1Database, chatId: string): Promise<boolean> {
  const group = await db
    .prepare('SELECT is_active, is_banned FROM groups WHERE telegram_chat_id = ?')
    .bind(chatId)
    .first<{ is_active: number; is_banned: number }>();
  if (!group) return true; // New groups are active by default
  return group.is_active === 1 && group.is_banned === 0;
}

export async function setGroupActive(db: D1Database, chatId: string, active: boolean): Promise<void> {
  await db
    .prepare(
      `INSERT INTO groups (telegram_chat_id, is_active) VALUES (?, ?)
       ON CONFLICT(telegram_chat_id) DO UPDATE SET is_active = ?, updated_at = datetime('now')`
    )
    .bind(chatId, active ? 1 : 0, active ? 1 : 0)
    .run();
}

export async function ensureGroup(db: D1Database, chatId: string, title: string | null): Promise<void> {
  await db
    .prepare(
      `INSERT INTO groups (telegram_chat_id, title) VALUES (?, ?)
       ON CONFLICT(telegram_chat_id) DO UPDATE SET title = COALESCE(?, title), updated_at = datetime('now')`
    )
    .bind(chatId, title, title)
    .run();
}

export async function logCommand(
  db: D1Database,
  chatId: string,
  userId: string,
  username: string | null,
  commandType: string,
  command: string,
  target: string | null,
  responseType: string | null
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO command_logs (telegram_chat_id, telegram_user_id, username, command_type, command, target, response_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(chatId, userId, username, commandType, command, target, responseType)
    .run();
}

export async function getCategoryList(db: D1Database, type: string): Promise<{ slug: string; name: string }[]> {
  const result = await db
    .prepare('SELECT slug, name FROM categories WHERE type = ? AND is_active = 1 ORDER BY name')
    .bind(type)
    .all<{ slug: string; name: string }>();
  return result.results;
}
