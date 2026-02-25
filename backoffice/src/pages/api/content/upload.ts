import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB || !env?.MEDIA_BUCKET) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const categoryId = formData.get('category_id');
  const caption = formData.get('caption')?.toString() || null;

  if (!file || !categoryId) {
    return new Response(JSON.stringify({ error: 'File e category_id sono obbligatori' }), { status: 400 });
  }

  // Get category to determine type and slug for R2 path
  const category = await env.DB.prepare('SELECT * FROM categories WHERE id = ?')
    .bind(categoryId).first<{ slug: string; type: string }>();

  if (!category) {
    return new Response(JSON.stringify({ error: 'Categoria non trovata' }), { status: 404 });
  }

  // Build R2 key
  const prefix = category.type === 'audio' ? 'audio' : 'photos';
  const timestamp = Date.now();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const r2Key = `${prefix}/${category.slug}/${timestamp}_${safeFileName}`;

  // Upload to R2
  await env.MEDIA_BUCKET.put(r2Key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  // Insert metadata in D1
  const result = await env.DB.prepare(
    `INSERT INTO media (category_id, r2_key, file_name, mime_type, file_size, caption)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(Number(categoryId), r2Key, file.name, file.type, file.size, caption).run();

  return Response.json({ id: result.meta.last_row_id, r2_key: r2Key });
};
