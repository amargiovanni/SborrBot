import type { APIRoute } from 'astro';

export const PUT: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const body = await request.json();
  const { id } = body;

  if (!id) return new Response(JSON.stringify({ error: 'id obbligatorio' }), { status: 400 });

  const updates: string[] = [];
  const binds: any[] = [];

  if ('is_active' in body) {
    updates.push('is_active = ?');
    binds.push(body.is_active);
  }
  if ('is_banned' in body) {
    updates.push('is_banned = ?');
    binds.push(body.is_banned);
  }

  if (updates.length === 0) {
    return new Response(JSON.stringify({ error: 'Nessun campo da aggiornare' }), { status: 400 });
  }

  updates.push("updated_at = datetime('now')");
  binds.push(id);

  await env.DB.prepare(
    `UPDATE groups SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...binds).run();

  return Response.json({ success: true });
};
