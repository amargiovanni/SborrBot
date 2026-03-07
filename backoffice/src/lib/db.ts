// D1 query helpers for backoffice

export async function getCategories(db: D1Database, type?: string) {
  if (type) {
    return db.prepare('SELECT * FROM categories WHERE type = ? ORDER BY name').bind(type).all();
  }
  return db.prepare('SELECT * FROM categories ORDER BY type, name').all();
}

export async function getTextResponses(db: D1Database, categoryId: number, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const items = await db.prepare(
    'SELECT * FROM text_responses WHERE category_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).bind(categoryId, limit, offset).all();
  const count = await db.prepare(
    'SELECT COUNT(*) as total FROM text_responses WHERE category_id = ?'
  ).bind(categoryId).first<{ total: number }>();
  return { items: items.results, total: count?.total ?? 0 };
}

export async function getMediaItems(db: D1Database, categoryId: number, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const items = await db.prepare(
    'SELECT * FROM media WHERE category_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).bind(categoryId, limit, offset).all();
  const count = await db.prepare(
    'SELECT COUNT(*) as total FROM media WHERE category_id = ?'
  ).bind(categoryId).first<{ total: number }>();
  return { items: items.results, total: count?.total ?? 0 };
}

export async function getGroups(db: D1Database, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const items = await db.prepare(
    'SELECT * FROM groups ORDER BY updated_at DESC LIMIT ? OFFSET ?'
  ).bind(limit, offset).all();
  const count = await db.prepare('SELECT COUNT(*) as total FROM groups').first<{ total: number }>();
  return { items: items.results, total: count?.total ?? 0 };
}

export async function getCommandLogs(db: D1Database, page = 1, limit = 50, filters?: {
  command?: string;
  chatId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM command_logs WHERE 1=1';
  const binds: any[] = [];

  if (filters?.command) {
    query += ' AND command LIKE ?';
    binds.push(`%${filters.command}%`);
  }
  if (filters?.chatId) {
    query += ' AND telegram_chat_id = ?';
    binds.push(filters.chatId);
  }
  if (filters?.dateFrom) {
    query += ' AND created_at >= ?';
    binds.push(filters.dateFrom);
  }
  if (filters?.dateTo) {
    query += ' AND created_at <= ?';
    binds.push(filters.dateTo);
  }

  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  binds.push(limit, offset);

  const items = await db.prepare(query).bind(...binds).all();
  const countBinds = binds.slice(0, -2); // remove limit/offset
  const count = await db.prepare(countQuery).bind(...countBinds).first<{ total: number }>();
  return { items: items.results, total: count?.total ?? 0 };
}

export async function getDashboardStats(db: D1Database) {
  const [
    totalCommands,
    commandsToday,
    activeGroups,
    totalGroups,
    uniqueUsers,
    totalContent,
    topCommands,
    recentActivity,
    activity30d,
    commandsByType,
    responseTypes,
    hourlyActivity,
    topGroups,
    topUsers,
    recentCommands,
  ] = await Promise.all([
    db.prepare('SELECT COUNT(*) as total FROM command_logs').first<{ total: number }>(),
    db.prepare("SELECT COUNT(*) as total FROM command_logs WHERE created_at >= datetime('now', 'start of day')").first<{ total: number }>(),
    db.prepare('SELECT COUNT(*) as total FROM groups WHERE is_active = 1').first<{ total: number }>(),
    db.prepare('SELECT COUNT(*) as total FROM groups').first<{ total: number }>(),
    db.prepare('SELECT COUNT(DISTINCT telegram_user_id) as total FROM command_logs').first<{ total: number }>(),
    db.prepare('SELECT (SELECT COUNT(*) FROM text_responses WHERE is_active = 1) + (SELECT COUNT(*) FROM media WHERE is_active = 1) as total').first<{ total: number }>(),
    db.prepare(
      `SELECT command, COUNT(*) as count FROM command_logs
       GROUP BY command ORDER BY count DESC LIMIT 10`
    ).all<{ command: string; count: number }>(),
    db.prepare(
      `SELECT DATE(created_at) as date, COUNT(*) as count FROM command_logs
       WHERE created_at >= datetime('now', '-7 days')
       GROUP BY DATE(created_at) ORDER BY date`
    ).all<{ date: string; count: number }>(),
    db.prepare(
      `SELECT DATE(created_at) as date, COUNT(*) as count FROM command_logs
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY DATE(created_at) ORDER BY date`
    ).all<{ date: string; count: number }>(),
    db.prepare(
      `SELECT command_type, COUNT(*) as count FROM command_logs
       GROUP BY command_type ORDER BY count DESC`
    ).all<{ command_type: string; count: number }>(),
    db.prepare(
      `SELECT response_type, COUNT(*) as count FROM command_logs
       WHERE response_type IS NOT NULL
       GROUP BY response_type ORDER BY count DESC`
    ).all<{ response_type: string; count: number }>(),
    db.prepare(
      `SELECT CAST(strftime('%H', created_at) AS INTEGER) as hour, COUNT(*) as count
       FROM command_logs GROUP BY hour ORDER BY hour`
    ).all<{ hour: number; count: number }>(),
    db.prepare(
      `SELECT cl.telegram_chat_id, g.title, COUNT(*) as count
       FROM command_logs cl
       LEFT JOIN groups g ON cl.telegram_chat_id = g.telegram_chat_id
       GROUP BY cl.telegram_chat_id
       ORDER BY count DESC LIMIT 5`
    ).all<{ telegram_chat_id: string; title: string | null; count: number }>(),
    db.prepare(
      `SELECT telegram_user_id, username, COUNT(*) as count
       FROM command_logs
       GROUP BY telegram_user_id
       ORDER BY count DESC LIMIT 5`
    ).all<{ telegram_user_id: string; username: string | null; count: number }>(),
    db.prepare(
      `SELECT command, username, command_type, response_type, created_at
       FROM command_logs ORDER BY created_at DESC LIMIT 10`
    ).all<{ command: string; username: string | null; command_type: string; response_type: string | null; created_at: string }>(),
  ]);

  return {
    totalCommands: totalCommands?.total ?? 0,
    commandsToday: commandsToday?.total ?? 0,
    activeGroups: activeGroups?.total ?? 0,
    totalGroups: totalGroups?.total ?? 0,
    uniqueUsers: uniqueUsers?.total ?? 0,
    totalContent: totalContent?.total ?? 0,
    topCommands: topCommands?.results ?? [],
    recentActivity: recentActivity?.results ?? [],
    activity30d: activity30d?.results ?? [],
    commandsByType: commandsByType?.results ?? [],
    responseTypes: responseTypes?.results ?? [],
    hourlyActivity: hourlyActivity?.results ?? [],
    topGroups: topGroups?.results ?? [],
    topUsers: topUsers?.results ?? [],
    recentCommands: recentCommands?.results ?? [],
  };
}

const ALLOWED_TABLES: Record<string, string> = {
  text: 'text_responses',
  photo: 'media',
  audio: 'media',
  sticker: 'media',
};

export async function getCategoriesWithCounts(db: D1Database, type: string) {
  const table = ALLOWED_TABLES[type];
  if (!table) throw new Error(`Invalid category type: ${type}`);
  return db.prepare(
    `SELECT c.*, COALESCE(cnt.count, 0) as item_count
     FROM categories c
     LEFT JOIN (SELECT category_id, COUNT(*) as count FROM ${table} GROUP BY category_id) cnt
     ON c.id = cnt.category_id
     WHERE c.type = ?
     ORDER BY c.name`
  ).bind(type).all();
}

export async function getGroupStats(db: D1Database) {
  return db.prepare(
    `SELECT
       COUNT(*) as total,
       SUM(CASE WHEN is_active = 1 AND is_banned = 0 THEN 1 ELSE 0 END) as active,
       SUM(CASE WHEN is_active = 0 AND is_banned = 0 THEN 1 ELSE 0 END) as paused,
       SUM(CASE WHEN is_banned = 1 THEN 1 ELSE 0 END) as banned
     FROM groups`
  ).first<{ total: number; active: number; paused: number; banned: number }>();
}

export async function getBotConfig(db: D1Database) {
  const result = await db.prepare('SELECT * FROM bot_config').all<{ key: string; value: string }>();
  return result.results;
}

export async function updateBotConfig(db: D1Database, key: string, value: string) {
  await db.prepare(
    'INSERT INTO bot_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
  ).bind(key, value, value).run();
}

// --- Scheduled Messages ---

export async function getScheduledMessages(db: D1Database) {
  return db.prepare(
    `SELECT sm.*, g.title as group_title
     FROM scheduled_messages sm
     LEFT JOIN groups g ON sm.target_group_id = g.telegram_chat_id
     ORDER BY sm.created_at DESC`
  ).all();
}

export async function getScheduledMessage(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM scheduled_messages WHERE id = ?').bind(id).first();
}

export async function createScheduledMessage(db: D1Database, data: {
  message_text: string;
  target_group_id: string | null;
  schedule_type: string;
  scheduled_at: string;
  day_of_week: number | null;
}) {
  return db.prepare(
    `INSERT INTO scheduled_messages (message_text, target_group_id, schedule_type, scheduled_at, day_of_week)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(data.message_text, data.target_group_id, data.schedule_type, data.scheduled_at, data.day_of_week).run();
}

export async function updateScheduledMessage(db: D1Database, id: number, data: {
  message_text: string;
  target_group_id: string | null;
  schedule_type: string;
  scheduled_at: string;
  day_of_week: number | null;
  is_active: number;
}) {
  return db.prepare(
    `UPDATE scheduled_messages
     SET message_text = ?, target_group_id = ?, schedule_type = ?, scheduled_at = ?, day_of_week = ?, is_active = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).bind(data.message_text, data.target_group_id, data.schedule_type, data.scheduled_at, data.day_of_week, data.is_active, id).run();
}

export async function deleteScheduledMessage(db: D1Database, id: number) {
  return db.prepare('DELETE FROM scheduled_messages WHERE id = ?').bind(id).run();
}

// --- Global Search ---

export async function globalSearch(db: D1Database, query: string) {
  const like = `%${query}%`;
  const [commands, texts, groups, categories] = await Promise.all([
    db.prepare(
      `SELECT 'command' as type, command as title, username as subtitle, created_at
       FROM command_logs WHERE command LIKE ? ORDER BY created_at DESC LIMIT 5`
    ).bind(like).all(),
    db.prepare(
      `SELECT 'text' as type, SUBSTR(content, 1, 80) as title, c.name as subtitle, tr.created_at
       FROM text_responses tr
       JOIN categories c ON tr.category_id = c.id
       WHERE tr.content LIKE ? ORDER BY tr.created_at DESC LIMIT 5`
    ).bind(like).all(),
    db.prepare(
      `SELECT 'group' as type, title, telegram_chat_id as subtitle, updated_at as created_at
       FROM groups WHERE title LIKE ? OR telegram_chat_id LIKE ? ORDER BY updated_at DESC LIMIT 5`
    ).bind(like, like).all(),
    db.prepare(
      `SELECT 'category' as type, name as title, type as subtitle, created_at
       FROM categories WHERE name LIKE ? OR slug LIKE ? ORDER BY name LIMIT 5`
    ).bind(like, like).all(),
  ]);

  return [
    ...(commands.results ?? []),
    ...(texts.results ?? []),
    ...(groups.results ?? []),
    ...(categories.results ?? []),
  ];
}
