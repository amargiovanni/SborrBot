import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const id = url.searchParams.get('id');

  if (!id) return new Response(JSON.stringify({ error: 'id obbligatorio' }), { status: 400 });

  // Look up the actual R2 key from D1 before deleting
  const media = await env.DB.prepare('SELECT r2_key FROM media WHERE id = ?').bind(id).first<{ r2_key: string }>();

  // Delete from D1
  await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();

  // Delete from R2 using the verified key
  if (media?.r2_key && env.MEDIA_BUCKET) {
    try {
      await env.MEDIA_BUCKET.delete(media.r2_key);
    } catch (e) {
      console.error('Failed to delete from R2:', e);
    }
  }

  return Response.json({ success: true });
};
