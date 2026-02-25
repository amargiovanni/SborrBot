import type { APIRoute } from 'astro';
import { deleteSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies, locals, redirect }) => {
  const token = cookies.get('session')?.value;
  const env = (locals as any).runtime?.env;

  if (token && env?.DB) {
    await deleteSession(env.DB, token);
  }

  cookies.delete('session', { path: '/' });
  return redirect('/login');
};
