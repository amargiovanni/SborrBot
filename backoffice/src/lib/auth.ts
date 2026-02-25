export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(db: D1Database, token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await db.prepare(
    `INSERT INTO sessions (token, expires_at) VALUES (?, ?)`
  ).bind(token, expiresAt).run();
}

export async function validateSession(db: D1Database, token: string): Promise<boolean> {
  const session = await db.prepare(
    `SELECT token FROM sessions WHERE token = ? AND expires_at > datetime('now')`
  ).bind(token).first();
  return !!session;
}

export async function deleteSession(db: D1Database, token: string): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}
