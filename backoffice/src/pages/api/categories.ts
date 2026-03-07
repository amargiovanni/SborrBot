import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { name, slug, type, description } = body;
  if (!name || !slug || !type) {
    return new Response(JSON.stringify({ error: 'name, slug e type sono obbligatori' }), { status: 400 });
  }

  const validTypes = ['text', 'audio', 'photo', 'sticker'];
  if (!validTypes.includes(type)) {
    return new Response(JSON.stringify({ error: 'type deve essere: text, audio, photo, sticker' }), { status: 400 });
  }

  const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!sanitizedSlug) {
    return new Response(JSON.stringify({ error: 'slug non valido' }), { status: 400 });
  }

  try {
    const result = await env.DB.prepare(
      'INSERT INTO categories (name, slug, type, description) VALUES (?, ?, ?, ?)'
    ).bind(name, sanitizedSlug, type, description || null).run();
    return Response.json({ id: result.meta.last_row_id });
  } catch (e: any) {
    if (e.message?.includes('UNIQUE')) {
      return new Response(JSON.stringify({ error: 'Slug gia esistente' }), { status: 409 });
    }
    throw e;
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { id } = body;
  if (!id) return new Response(JSON.stringify({ error: 'id obbligatorio' }), { status: 400 });

  const updates: string[] = [];
  const binds: any[] = [];

  if ('name' in body) { updates.push('name = ?'); binds.push(body.name); }
  if ('description' in body) { updates.push('description = ?'); binds.push(body.description); }
  if ('is_active' in body) { updates.push('is_active = ?'); binds.push(body.is_active ? 1 : 0); }

  if (updates.length === 0) {
    return new Response(JSON.stringify({ error: 'Nessun campo da aggiornare' }), { status: 400 });
  }

  binds.push(id);
  await env.DB.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`).bind(...binds).run();
  return Response.json({ success: true });
};

export const DELETE: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const id = url.searchParams.get('id');
  if (!id) return new Response(JSON.stringify({ error: 'id obbligatorio' }), { status: 400 });

  // Check if category has content
  const cat = await env.DB.prepare('SELECT type FROM categories WHERE id = ?').bind(id).first<{ type: string }>();
  if (!cat) return new Response(JSON.stringify({ error: 'Categoria non trovata' }), { status: 404 });

  const table = cat.type === 'text' ? 'text_responses' : 'media';
  const count = await env.DB.prepare(`SELECT COUNT(*) as c FROM ${table} WHERE category_id = ?`).bind(id).first<{ c: number }>();

  if (count && count.c > 0) {
    return new Response(JSON.stringify({ error: `Impossibile eliminare: contiene ${count.c} elementi. Svuota prima la categoria.` }), { status: 409 });
  }

  await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
  return Response.json({ success: true });
};
