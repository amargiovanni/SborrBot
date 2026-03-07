import type { APIRoute } from 'astro';
import { updateBotConfig } from '../../lib/db';

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

  await updateBotConfig(env.DB, key, value);
  return Response.json({ success: true });
};
