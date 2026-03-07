-- Scheduled messages for broadcast to groups
CREATE TABLE IF NOT EXISTS scheduled_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_text TEXT NOT NULL,
  target_group_id TEXT,              -- NULL = all active groups, or specific telegram_chat_id
  schedule_type TEXT NOT NULL DEFAULT 'once',  -- 'once', 'daily', 'weekly'
  scheduled_at TEXT NOT NULL,        -- ISO datetime for 'once', or HH:MM for recurring
  day_of_week INTEGER,              -- 0-6 (Sun-Sat) for 'weekly'
  is_active INTEGER DEFAULT 1,
  last_sent_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_scheduled_messages_active ON scheduled_messages(is_active, scheduled_at);
