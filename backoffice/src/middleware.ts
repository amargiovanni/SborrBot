import { defineMiddleware } from 'astro:middleware';
import { validateSession } from './lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/api/auth/login', '/api/auth/logout'];

export const onRequest = defineMiddleware(async (context, next) => {
  const path = new URL(context.request.url).pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => path === p || path.startsWith(p + '/'))) {
    // If already logged in and visiting /login, redirect to dashboard
    if (path === '/login') {
      const token = context.cookies.get('session')?.value;
      const env = (context.locals as any).runtime?.env;
      if (token && env?.DB) {
        const valid = await validateSession(env.DB, token);
        if (valid) {
          return context.redirect('/dashboard');
        }
      }
    }
    return next();
  }

  // Check auth for all other routes
  const token = context.cookies.get('session')?.value;
  const env = (context.locals as any).runtime?.env;

  if (!token || !env?.DB) {
    return context.redirect('/login');
  }

  const valid = await validateSession(env.DB, token);
  if (!valid) {
    context.cookies.delete('session', { path: '/' });
    return context.redirect('/login');
  }

  return next();
});
