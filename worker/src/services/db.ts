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

export async function getTwoRandomGroupUsers(db: D1Database, chatId: string): Promise<[string, string]> {
  const result = await db
    .prepare(
      `SELECT username FROM command_logs
       WHERE telegram_chat_id = ? AND username IS NOT NULL
       GROUP BY telegram_user_id ORDER BY RANDOM() LIMIT 2`
    )
    .bind(chatId)
    .all<{ username: string }>();
  const users = result.results.map(r => r.username);
  return [users[0] ?? 'Tizio', users[1] ?? 'Caio'];
}

export async function getRandomGroupUser(db: D1Database, chatId: string, excludeUserId: string): Promise<string | null> {
  const result = await db
    .prepare(
      `SELECT username FROM command_logs
       WHERE telegram_chat_id = ? AND username IS NOT NULL AND telegram_user_id != ?
       GROUP BY telegram_user_id ORDER BY RANDOM() LIMIT 1`
    )
    .bind(chatId, excludeUserId)
    .first<{ username: string }>();
  return result?.username ?? null;
}

export async function getCategoryList(db: D1Database, type: string): Promise<{ slug: string; name: string }[]> {
  const result = await db
    .prepare('SELECT slug, name FROM categories WHERE type = ? AND is_active = 1 ORDER BY name')
    .bind(type)
    .all<{ slug: string; name: string }>();
  return result.results;
}

export async function getUserStats(db: D1Database, userId: string): Promise<{
  totalCommands: number;
  firstSeen: string | null;
  lastSeen: string | null;
} | null> {
  const result = await db
    .prepare(
      `SELECT COUNT(*) as total_commands,
              MIN(created_at) as first_seen,
              MAX(created_at) as last_seen
       FROM command_logs WHERE telegram_user_id = ?`
    )
    .bind(userId)
    .first<{ total_commands: number; first_seen: string | null; last_seen: string | null }>();
  if (!result || result.total_commands === 0) return null;
  return {
    totalCommands: result.total_commands,
    firstSeen: result.first_seen,
    lastSeen: result.last_seen,
  };
}

export async function deleteUserData(db: D1Database, userId: string): Promise<number> {
  const result = await db
    .prepare('DELETE FROM command_logs WHERE telegram_user_id = ?')
    .bind(userId)
    .run();
  return result.meta.changes ?? 0;
}

export async function purgeOldLogs(db: D1Database, retentionDays: number): Promise<number> {
  const result = await db
    .prepare("DELETE FROM command_logs WHERE created_at <= datetime('now', ? || ' days')")
    .bind(-retentionDays)
    .run();
  return result.meta.changes ?? 0;
}

// --- Scheduled Messages ---

interface ScheduledMessage {
  id: number;
  message_text: string;
  target_group_id: string | null;
  schedule_type: string;
  scheduled_at: string;
  day_of_week: number | null;
}

export async function getDueScheduledMessages(db: D1Database): Promise<ScheduledMessage[]> {
  const now = new Date();
  const currentTime = now.toISOString().slice(11, 16); // HH:MM
  const currentDay = now.getUTCDay(); // 0-6
  const nowISO = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

  // Once: scheduled_at <= now and not yet sent
  const once = await db.prepare(
    `SELECT * FROM scheduled_messages
     WHERE is_active = 1 AND schedule_type = 'once'
     AND scheduled_at <= ? AND last_sent_at IS NULL`
  ).bind(nowISO).all<ScheduledMessage>();

  // Daily: current HH:MM matches and not sent today
  const daily = await db.prepare(
    `SELECT * FROM scheduled_messages
     WHERE is_active = 1 AND schedule_type = 'daily'
     AND scheduled_at = ?
     AND (last_sent_at IS NULL OR DATE(last_sent_at) < DATE('now'))`
  ).bind(currentTime).all<ScheduledMessage>();

  // Weekly: current day + HH:MM matches and not sent this week-day
  const weekly = await db.prepare(
    `SELECT * FROM scheduled_messages
     WHERE is_active = 1 AND schedule_type = 'weekly'
     AND day_of_week = ? AND scheduled_at = ?
     AND (last_sent_at IS NULL OR DATE(last_sent_at) < DATE('now'))`
  ).bind(currentDay, currentTime).all<ScheduledMessage>();

  return [
    ...(once.results ?? []),
    ...(daily.results ?? []),
    ...(weekly.results ?? []),
  ];
}

export async function markScheduledMessageSent(db: D1Database, id: number, deactivate: boolean): Promise<void> {
  if (deactivate) {
    await db.prepare(
      "UPDATE scheduled_messages SET last_sent_at = datetime('now'), is_active = 0 WHERE id = ?"
    ).bind(id).run();
  } else {
    await db.prepare(
      "UPDATE scheduled_messages SET last_sent_at = datetime('now') WHERE id = ?"
    ).bind(id).run();
  }
}

export async function getActiveGroupChatIds(db: D1Database): Promise<string[]> {
  const result = await db.prepare(
    'SELECT telegram_chat_id FROM groups WHERE is_active = 1 AND is_banned = 0'
  ).all<{ telegram_chat_id: string }>();
  return result.results.map(r => r.telegram_chat_id);
}
