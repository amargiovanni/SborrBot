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

export async function getBotConfig(db: D1Database) {
  const result = await db.prepare('SELECT * FROM bot_config').all<{ key: string; value: string }>();
  return result.results;
}

export async function updateBotConfig(db: D1Database, key: string, value: string) {
  await db.prepare(
    'INSERT INTO bot_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?'
  ).bind(key, value, value).run();
}
