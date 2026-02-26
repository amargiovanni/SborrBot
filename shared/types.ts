// Shared types between worker and backoffice

export interface Category {
  id: number;
  slug: string;
  name: string;
  type: 'text' | 'audio' | 'photo' | 'sticker';
  description: string | null;
  is_active: number;
  created_at: string;
}

export interface TextResponse {
  id: number;
  category_id: number;
  content: string;
  is_active: number;
  created_at: string;
}

export interface Media {
  id: number;
  category_id: number;
  r2_key: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  telegram_file_id: string | null;
  caption: string | null;
  is_active: number;
  created_at: string;
}

export interface Group {
  id: number;
  telegram_chat_id: string;
  title: string | null;
  is_active: number;
  is_banned: number;
  joined_at: string;
  updated_at: string;
}

export interface GroupSetting {
  id: number;
  group_id: number;
  setting_key: string;
  setting_value: string;
}

export interface CommandLog {
  id: number;
  telegram_chat_id: string;
  telegram_user_id: string;
  username: string | null;
  command_type: string;
  command: string;
  target: string | null;
  response_type: string | null;
  created_at: string;
}

export interface BotConfig {
  key: string;
  value: string;
}

export type ContentType = 'text' | 'audio' | 'photo' | 'sticker';

export const CATEGORY_SLUGS = {
  // Text
  INSULTI: 'insulti',
  MINACCE: 'minacce',
  BESTEMMIE: 'bestemmie',
  NONNO: 'nonno',
  SALUTI: 'saluti',
  ANTI_JUVE: 'anti-juve',
  // Audio
  GERMANO_MOSCONI: 'germano-mosconi',
  CHRISTIAN_DE_SICA: 'christian-de-sica',
  HOMER_SIMPSON: 'homer-simpson',
  SOLITI_IDIOTI: 'soliti-idioti',
  RICHARD_BENSON: 'richard-benson',
  EFFETTI_SONORI: 'effetti-sonori',
  AUDIO_VARI: 'audio-vari',
  // Photo
  FICA: 'fica',
  CULO: 'culo',
  TETTE: 'tette',
  // Sticker
  STICKER_APPLE: 'sticker-apple',
  STICKER_MINION: 'sticker-minion',
  STICKER_DISAPPROVAZIONE: 'sticker-disapprovazione',
} as const;
