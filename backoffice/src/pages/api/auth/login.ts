import type { APIRoute } from 'astro';
import { generateSessionToken, createSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }

  const formData = await request.formData();
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();
  const turnstileToken = formData.get('cf-turnstile-response')?.toString();

  if (env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Verifica CAPTCHA richiesta' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: turnstileToken }),
    });
    const verifyData = await verifyRes.json<{ success: boolean }>();
    if (!verifyData.success) {
      return new Response(JSON.stringify({ error: 'Verifica CAPTCHA fallita' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Credenziali non valide' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = generateSessionToken();
  await createSession(env.DB, token);

  cookies.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
