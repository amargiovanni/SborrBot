import { defineMiddleware } from 'astro:middleware';
import { validateSession } from '../lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Allow access to login page and auth API
  if (url.pathname === '/login' || url.pathname.startsWith('/api/auth/')) {
    return next();
  }

  // Check session cookie
  const sessionToken = context.cookies.get('session')?.value;
  if (!sessionToken) {
    return context.redirect('/login');
  }

  // Validate session in D1
  const env = (context.locals as any).runtime?.env;
  if (!env?.DB) {
    return context.redirect('/login');
  }

  const valid = await validateSession(env.DB, sessionToken);
  if (!valid) {
    context.cookies.delete('session', { path: '/' });
    return context.redirect('/login');
  }

  return next();
});
