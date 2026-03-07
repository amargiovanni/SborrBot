import { Env } from './types';
import { TelegramApi } from './services/telegram';
import { handleUpdate } from './bot';
import { purgeOldLogs, getDueScheduledMessages, markScheduledMessageSent, getActiveGroupChatIds } from './services/db';

const LOG_RETENTION_DAYS = 90;

async function processScheduledMessages(env: Env): Promise<number> {
  const api = new TelegramApi(env.BOT_TOKEN);
  const messages = await getDueScheduledMessages(env.DB);
  let sent = 0;

  for (const msg of messages) {
    const chatIds = msg.target_group_id
      ? [msg.target_group_id]
      : await getActiveGroupChatIds(env.DB);

    for (const chatId of chatIds) {
      try {
        await api.sendMessage(chatId, msg.message_text);
        sent++;
      } catch (e) {
        console.error(`Failed to send scheduled message ${msg.id} to ${chatId}:`, e);
      }
    }

    await markScheduledMessageSent(env.DB, msg.id, msg.schedule_type === 'once');
  }

  return sent;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Purge old logs (daily at 03:00)
    if (event.cron === '0 3 * * *') {
      const deleted = await purgeOldLogs(env.DB, LOG_RETENTION_DAYS);
      console.log(`Cron: purged ${deleted} logs older than ${LOG_RETENTION_DAYS} days`);
    }

    // Process scheduled messages (every minute)
    const sent = await processScheduledMessages(env);
    if (sent > 0) {
      console.log(`Cron: sent ${sent} scheduled messages`);
    }
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response('SborrBot is running! 🤖');
    }

    // Register webhook
    if (url.pathname === '/register' && request.method === 'GET') {
      if (request.headers.get('Authorization') !== `Bearer ${env.BOT_SECRET}`) {
        return new Response('Unauthorized', { status: 403 });
      }
      const api = new TelegramApi(env.BOT_TOKEN);
      const webhookUrl = `${url.origin}/webhook`;
      const result = await api.setWebhook(webhookUrl, env.BOT_SECRET);
      return Response.json(result);
    }

    // Unregister webhook
    if (url.pathname === '/unregister' && request.method === 'GET') {
      if (request.headers.get('Authorization') !== `Bearer ${env.BOT_SECRET}`) {
        return new Response('Unauthorized', { status: 403 });
      }
      const api = new TelegramApi(env.BOT_TOKEN);
      const result = await api.deleteWebhook();
      return Response.json(result);
    }

    // Telegram webhook
    if (url.pathname === '/webhook' && request.method === 'POST') {
      // Validate secret token
      const secretHeader = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (secretHeader !== env.BOT_SECRET) {
        return new Response('Unauthorized', { status: 403 });
      }

      try {
        const update = await request.json() as any;
        await handleUpdate(update, env);
      } catch (e) {
        console.error('Error handling update:', e);
      }

      // Always return 200 to Telegram
      return new Response('OK');
    }

    return new Response('Not Found', { status: 404 });
  },
};
