import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const { category_id, content } = await request.json();
  if (!category_id || !content) {
    return new Response(JSON.stringify({ error: 'category_id e content sono obbligatori' }), { status: 400 });
  }

  const result = await env.DB.prepare(
    'INSERT INTO text_responses (category_id, content) VALUES (?, ?)'
  ).bind(category_id, content).run();

  return Response.json({ id: result.meta.last_row_id });
};

export const DELETE: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'id obbligatorio' }), { status: 400 });

  await env.DB.prepare('DELETE FROM text_responses WHERE id = ?').bind(id).run();
  return Response.json({ success: true });
};
