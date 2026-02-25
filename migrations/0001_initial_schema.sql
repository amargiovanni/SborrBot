-- SborrBot D1 Schema

-- Categorie di contenuti
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Risposte testuali
CREATE TABLE IF NOT EXISTS text_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Media (audio, foto, sticker) — metadata in D1, file su R2
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  r2_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  telegram_file_id TEXT,
  caption TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Gruppi Telegram
CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_chat_id TEXT UNIQUE NOT NULL,
  title TEXT,
  is_active INTEGER DEFAULT 1,
  is_banned INTEGER DEFAULT 0,
  joined_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Impostazioni per gruppo
CREATE TABLE IF NOT EXISTS group_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value TEXT NOT NULL,
  UNIQUE(group_id, setting_key)
);

-- Log comandi
CREATE TABLE IF NOT EXISTS command_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_chat_id TEXT NOT NULL,
  telegram_user_id TEXT NOT NULL,
  username TEXT,
  command_type TEXT NOT NULL,
  command TEXT NOT NULL,
  target TEXT,
  response_type TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Configurazione globale bot
CREATE TABLE IF NOT EXISTS bot_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Sessioni per autenticazione backoffice
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_text_responses_category ON text_responses(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_groups_chat_id ON groups(telegram_chat_id);
CREATE INDEX IF NOT EXISTS idx_command_logs_created ON command_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_command_logs_chat ON command_logs(telegram_chat_id);
