export async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode('constant-time-comparison-key');
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const hmacA = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(a)));
  const hmacB = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(b)));
  if (hmacA.byteLength !== hmacB.byteLength) return false;
  let result = 0;
  for (let i = 0; i < hmacA.byteLength; i++) {
    result |= hmacA[i] ^ hmacB[i];
  }
  return result === 0;
}

export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

export async function createSession(db: D1Database, token: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await db.batch([
    db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')"),
    db.prepare('INSERT INTO sessions (token, expires_at) VALUES (?, ?)').bind(token, expiresAt),
  ]);
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
