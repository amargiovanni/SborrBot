import { Env } from '../types';
import { TelegramApi } from '../services/telegram';
import { setGroupActive } from '../services/db';

interface CommandResult {
  handled: boolean;
  command?: string;
}

export async function handleControlCommand(
  text: string,
  chatId: string,
  env: Env,
  api: TelegramApi
): Promise<CommandResult> {
  // Mute bot in group
  if (/^zitto\s+sborrbot$/i.test(text)) {
    await setGroupActive(env.DB, chatId, false);
    await api.sendMessage(chatId, '😴 Ok, sto zitto... Scrivi "sveglia sborrbot" per riatttivarmi!');
    return { handled: true, command: 'zitto' };
  }

  // Unmute bot in group
  if (/^sveglia\s+sborrbot$/i.test(text)) {
    await setGroupActive(env.DB, chatId, true);
    await api.sendMessage(chatId, '🔥 SborrBot è tornato! Pronti a sborrare? 💦');
    return { handled: true, command: 'sveglia' };
  }

  return { handled: false };
}
