import { Env } from './types';
import { TelegramApi } from './services/telegram';
import { checkGroup } from './middleware/group-check';
import { logBotCommand } from './middleware/logger';
import { handleSlashCommand } from './commands/slash';
import { handleTextCommand } from './commands/text';
import { handleMediaCommand } from './commands/media';
import { handleStickerCommand } from './commands/sticker';
import { handleControlCommand } from './commands/control';

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  inline_query?: any;
}

interface TelegramMessage {
  message_id: number;
  from?: { id: number; username?: string; first_name?: string };
  chat: { id: number; type: string; title?: string };
  text?: string;
}

export async function handleUpdate(update: TelegramUpdate, env: Env): Promise<void> {
  const message = update.message;
  if (!message?.text) return;

  const chatId = String(message.chat.id);
  const userId = String(message.from?.id ?? 0);
  const username = message.from?.username ?? null;
  const text = message.text.trim();
  const chatType = message.chat.type;
  const chatTitle = message.chat.title ?? null;

  const api = new TelegramApi(env.BOT_TOKEN);

  // Control commands work even when paused
  const controlResult = await handleControlCommand(text, chatId, env, api);
  if (controlResult.handled) {
    await logBotCommand(env.DB, chatId, userId, username, 'control', controlResult.command!, null, 'text');
    return;
  }

  // Check if bot is active in this group
  const { active } = await checkGroup(env.DB, chatId, chatType, chatTitle);
  if (!active) return;

  // Slash commands
  if (text.startsWith('/')) {
    const result = await handleSlashCommand(text, chatId, env, api);
    if (result.handled) {
      await logBotCommand(env.DB, chatId, userId, username, 'slash', result.command!, null, 'text');
    }
    return;
  }

  // Text commands (insulta, minaccia, bestemmia, nonno, saluti, anti-juve)
  const senderName = message.from?.first_name ?? message.from?.username ?? 'Tizio';
  const textResult = await handleTextCommand(text, chatId, env, api, senderName);
  if (textResult.handled) {
    await logBotCommand(env.DB, chatId, userId, username, 'keyword', textResult.command!, textResult.target ?? null, 'text');
    return;
  }

  // Media commands (audio, foto)
  const mediaResult = await handleMediaCommand(text, chatId, env, api);
  if (mediaResult.handled) {
    await logBotCommand(env.DB, chatId, userId, username, 'keyword', mediaResult.command!, null, mediaResult.responseType!);
    return;
  }

  // Sticker commands
  const stickerResult = await handleStickerCommand(text, chatId, env, api);
  if (stickerResult.handled) {
    await logBotCommand(env.DB, chatId, userId, username, 'keyword', stickerResult.command!, null, 'sticker');
    return;
  }
}
