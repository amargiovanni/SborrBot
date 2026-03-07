import type { APIRoute } from 'astro';
import { globalSearch } from '../../lib/db';

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return Response.json({ results: [] });
  }

  const results = await globalSearch(env.DB, q);
  return Response.json({ results });
};
