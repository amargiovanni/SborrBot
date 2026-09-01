import type { APIRoute } from 'astro';
import { updateBotConfig } from '../../lib/db';

const ALLOWED_CONFIG_KEYS = new Set(['bot_name', 'rate_limit_per_minute', 'nsfw_default', 'audio_default']);

export const PUT: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const { key, value } = body;
  if (!key || value === undefined) {
    return new Response(JSON.stringify({ error: 'key e value sono obbligatori' }), { status: 400 });
  }
  if (typeof key !== 'string' || !ALLOWED_CONFIG_KEYS.has(key)) {
    return new Response(JSON.stringify({ error: 'Chiave di configurazione non valida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (typeof value !== 'string' || value.length > 500) {
    return new Response(JSON.stringify({ error: 'Valore non valido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await updateBotConfig(env.DB, key, value);
  return Response.json({ success: true });
};
