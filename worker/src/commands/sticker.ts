import { Env } from '../types';
import { TelegramApi } from '../services/telegram';
import { getRandomMedia } from '../services/db';

interface CommandResult {
  handled: boolean;
  command?: string;
}

const STICKER_PATTERNS: { pattern: RegExp; slug: string }[] = [
  { pattern: /^apple$/i, slug: 'sticker-apple' },
  { pattern: /^(?:banana|minion)$/i, slug: 'sticker-minion' },
  { pattern: /^non ci sono$/i, slug: 'sticker-disapprovazione' },
];

export async function handleStickerCommand(
  text: string,
  chatId: string,
  env: Env,
  api: TelegramApi
): Promise<CommandResult> {
  for (const { pattern, slug } of STICKER_PATTERNS) {
    if (!pattern.test(text)) continue;

    const media = await getRandomMedia(env.DB, slug);
    if (!media || !media.telegram_file_id) {
      await api.sendMessage(chatId, `Nessuno sticker disponibile per "${slug}". Aggiungili dal backoffice! 🎨`);
      return { handled: true, command: slug };
    }

    await api.sendSticker(chatId, media.telegram_file_id);
    return { handled: true, command: slug };
  }

  return { handled: false };
}
