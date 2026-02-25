import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const { category_id, telegram_file_id, caption } = await request.json();
  if (!category_id || !telegram_file_id) {
    return new Response(JSON.stringify({ error: 'category_id e telegram_file_id sono obbligatori' }), { status: 400 });
  }

  // For stickers we store the file_id in both r2_key (as identifier) and telegram_file_id
  const result = await env.DB.prepare(
    `INSERT INTO media (category_id, r2_key, file_name, telegram_file_id, caption)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(category_id, `sticker_${telegram_file_id}`, 'sticker', telegram_file_id, caption).run();

  return Response.json({ id: result.meta.last_row_id });
};
