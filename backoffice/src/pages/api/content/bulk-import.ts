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

  const { category_id, items, format } = body;
  if (!category_id || !items) {
    return new Response(JSON.stringify({ error: 'category_id e items sono obbligatori' }), { status: 400 });
  }

  // Verify category exists and is text type
  const cat = await env.DB.prepare('SELECT type FROM categories WHERE id = ?').bind(category_id).first<{ type: string }>();
  if (!cat) return new Response(JSON.stringify({ error: 'Categoria non trovata' }), { status: 404 });
  if (cat.type !== 'text') {
    return new Response(JSON.stringify({ error: 'Il bulk import funziona solo per categorie di testo' }), { status: 400 });
  }

  let lines: string[] = [];

  if (format === 'json') {
    if (!Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'items deve essere un array di stringhe' }), { status: 400 });
    }
    lines = items.filter((s: any) => typeof s === 'string' && s.trim());
  } else {
    // CSV/text: one line per item
    if (typeof items !== 'string') {
      return new Response(JSON.stringify({ error: 'items deve essere una stringa (una frase per riga)' }), { status: 400 });
    }
    lines = items.split('\n').map((s: string) => s.trim()).filter(Boolean);
  }

  if (lines.length === 0) {
    return new Response(JSON.stringify({ error: 'Nessun elemento valido trovato' }), { status: 400 });
  }

  if (lines.length > 500) {
    return new Response(JSON.stringify({ error: 'Massimo 500 elementi per importazione' }), { status: 400 });
  }

  // Batch insert (D1 supports up to 100 statements per batch)
  let imported = 0;
  const batchSize = 50;

  for (let i = 0; i < lines.length; i += batchSize) {
    const batch = lines.slice(i, i + batchSize);
    const stmts = batch.map(content =>
      env.DB.prepare('INSERT INTO text_responses (category_id, content) VALUES (?, ?)').bind(category_id, content)
    );
    await env.DB.batch(stmts);
    imported += batch.length;
  }

  return Response.json({ imported });
};
