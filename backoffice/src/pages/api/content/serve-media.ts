import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB || !env?.MEDIA_BUCKET) return new Response('Server error', { status: 500 });

  const id = url.searchParams.get('id');
  if (!id) return new Response('id obbligatorio', { status: 400 });

  // Look up the R2 key from D1
  const media = await env.DB.prepare('SELECT r2_key, mime_type, file_name FROM media WHERE id = ?')
    .bind(id).first<{ r2_key: string; mime_type: string | null; file_name: string }>();

  if (!media) return new Response('Not found', { status: 404 });

  const object = await env.MEDIA_BUCKET.get(media.r2_key);
  if (!object) return new Response('File not found in R2', { status: 404 });

  const headers = new Headers();
  headers.set('Content-Type', media.mime_type || 'application/octet-stream');
  headers.set('Cache-Control', 'private, max-age=3600');

  return new Response(object.body, { headers });
};
