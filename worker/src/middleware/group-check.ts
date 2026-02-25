import { isGroupActive, ensureGroup } from '../services/db';

export async function checkGroup(
  db: D1Database,
  chatId: string,
  chatType: string,
  title: string | null
): Promise<{ active: boolean }> {
  // Private chats are always active
  if (chatType === 'private') {
    return { active: true };
  }

  // Ensure group is tracked
  await ensureGroup(db, chatId, title);

  // Check if bot is active in this group
  const active = await isGroupActive(db, chatId);
  return { active };
}
