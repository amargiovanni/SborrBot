import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const id = url.searchParams.get('id');
  const r2key = url.searchParams.get('r2key');

  if (!id) return new Response(JSON.stringify({ error: 'id obbligatorio' }), { status: 400 });

  // Delete from D1
  await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();

  // Delete from R2 if key provided
  if (r2key && env.MEDIA_BUCKET) {
    try {
      await env.MEDIA_BUCKET.delete(r2key);
    } catch (e) {
      console.error('Failed to delete from R2:', e);
    }
  }

  return Response.json({ success: true });
};
