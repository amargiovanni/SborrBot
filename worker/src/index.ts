import { Env } from './types';
import { TelegramApi } from './services/telegram';
import { handleUpdate } from './bot';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response('SborrBot is running! 🤖');
    }

    // Register webhook
    if (url.pathname === '/register' && request.method === 'GET') {
      const api = new TelegramApi(env.BOT_TOKEN);
      const webhookUrl = `${url.origin}/webhook`;
      const result = await api.setWebhook(webhookUrl, env.BOT_SECRET);
      return Response.json(result);
    }

    // Unregister webhook
    if (url.pathname === '/unregister' && request.method === 'GET') {
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
