import { describe, expect, test, vi } from 'vitest';

const validateSession = vi.fn();
vi.mock('../lib/auth', () => ({
  validateSession: (...args: unknown[]) => validateSession(...args),
}));

import { onRequest } from '../middleware';

// Headers every response must carry; a subset is enough to prove application.
const REQUIRED_HEADERS = ['X-Frame-Options', 'Content-Security-Policy', 'Strict-Transport-Security'];

interface ContextOptions {
  path: string;
  sessionToken?: string;
  db?: unknown;
}

function makeContext({ path, sessionToken, db = {} }: ContextOptions) {
  return {
    request: new Request(`https://backoffice.example${path}`),
    cookies: {
      get: (name: string) => (name === 'session' && sessionToken ? { value: sessionToken } : undefined),
      delete: vi.fn(),
    },
    locals: { runtime: { env: { DB: db } } },
    redirect: (location: string) => new Response(null, { status: 302, headers: { Location: location } }),
  } as any;
}

const next = () => Promise.resolve(new Response('page'));

function expectSecurityHeaders(res: Response) {
  for (const name of REQUIRED_HEADERS) {
    expect(res.headers.get(name), `missing ${name}`).toBeTruthy();
  }
}

describe('middleware security headers', () => {
  test('adds headers to a rendered protected page', async () => {
    validateSession.mockResolvedValue(true);
    const res = await onRequest(makeContext({ path: '/dashboard', sessionToken: 'tok' }), next);
    expect(res.status).toBe(200);
    expectSecurityHeaders(res);
  });

  test('adds headers to the unauthenticated redirect to /login', async () => {
    const res = await onRequest(makeContext({ path: '/dashboard' }), next);
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/login');
    expectSecurityHeaders(res);
  });

  test('adds headers to the invalid-session redirect to /login', async () => {
    validateSession.mockResolvedValue(false);
    const ctx = makeContext({ path: '/dashboard', sessionToken: 'stale' });
    const res = await onRequest(ctx, next);
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/login');
    expect(ctx.cookies.delete).toHaveBeenCalledWith('session', { path: '/' });
    expectSecurityHeaders(res);
  });

  test('adds headers to the already-logged-in redirect from /login to /dashboard', async () => {
    validateSession.mockResolvedValue(true);
    const res = await onRequest(makeContext({ path: '/login', sessionToken: 'tok' }), next);
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/dashboard');
    expectSecurityHeaders(res);
  });
});
