import type { APIRoute } from 'astro';
import { updateBotConfig } from '../../lib/db';

export const PUT: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const { key, value } = await request.json();
  if (!key || value === undefined) {
    return new Response(JSON.stringify({ error: 'key e value sono obbligatori' }), { status: 400 });
  }

  await updateBotConfig(env.DB, key, value);
  return Response.json({ success: true });
};
