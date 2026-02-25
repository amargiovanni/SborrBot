import { logCommand } from '../services/db';

export async function logBotCommand(
  db: D1Database,
  chatId: string,
  userId: string,
  username: string | null,
  commandType: string,
  command: string,
  target: string | null,
  responseType: string | null
): Promise<void> {
  try {
    await logCommand(db, chatId, userId, username, commandType, command, target, responseType);
  } catch (e) {
    console.error('Failed to log command:', e);
  }
}
