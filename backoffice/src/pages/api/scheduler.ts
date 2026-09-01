import type { APIRoute } from 'astro';
import {
  getScheduledMessages,
  createScheduledMessage,
  updateScheduledMessage,
  deleteScheduledMessage,
} from '../../lib/db';

const ONCE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

interface ValidatedScheduledMessage {
  message_text: string;
  target_group_id: string | null;
  schedule_type: 'once' | 'daily' | 'weekly';
  scheduled_at: string;
  day_of_week: number | null;
  is_active: 0 | 1;
}

type ValidationResult =
  | { ok: true; data: ValidatedScheduledMessage }
  | { ok: false; error: string };

async function validateScheduledMessage(db: D1Database, body: any): Promise<ValidationResult> {
  const { message_text, target_group_id, schedule_type, scheduled_at, day_of_week, is_active } = body ?? {};

  if (!['once', 'daily', 'weekly'].includes(schedule_type)) {
    return { ok: false, error: 'schedule_type deve essere once, daily o weekly' };
  }

  if (typeof message_text !== 'string' || message_text.length === 0 || message_text.length > 4096) {
    return { ok: false, error: 'message_text deve essere una stringa non vuota di massimo 4096 caratteri' };
  }

  if (typeof scheduled_at !== 'string') {
    return { ok: false, error: 'scheduled_at obbligatorio' };
  }
  const scheduledAtPattern = schedule_type === 'once' ? ONCE_RE : TIME_RE;
  if (!scheduledAtPattern.test(scheduled_at)) {
    return {
      ok: false,
      error:
        schedule_type === 'once'
          ? 'scheduled_at deve avere il formato AAAA-MM-GGTHH:MM'
          : 'scheduled_at deve avere il formato HH:MM',
    };
  }

  let dayOfWeek: number | null = null;
  if (schedule_type === 'weekly') {
    dayOfWeek = day_of_week ?? 0;
    if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return { ok: false, error: 'day_of_week deve essere un intero tra 0 e 6' };
    }
  }

  let targetGroupId: string | null = null;
  if (target_group_id !== undefined && target_group_id !== null && target_group_id !== '') {
    if (typeof target_group_id !== 'string') {
      return { ok: false, error: 'Gruppo non valido' };
    }
    const group = await db
      .prepare('SELECT 1 FROM groups WHERE telegram_chat_id = ? AND is_banned = 0')
      .bind(target_group_id)
      .first();
    if (!group) {
      return { ok: false, error: 'Gruppo non valido' };
    }
    targetGroupId = target_group_id;
  }

  let isActive: 0 | 1 = 1;
  if (is_active !== undefined) {
    isActive = is_active ? 1 : 0;
  }

  return {
    ok: true,
    data: {
      message_text,
      target_group_id: targetGroupId,
      schedule_type,
      scheduled_at,
      day_of_week: dayOfWeek,
      is_active: isActive,
    },
  };
}

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const result = await getScheduledMessages(env.DB);
  return Response.json({ items: result.results ?? [] });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validated = await validateScheduledMessage(env.DB, body);
  if (!validated.ok) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  await createScheduledMessage(env.DB, {
    message_text: validated.data.message_text,
    target_group_id: validated.data.target_group_id,
    schedule_type: validated.data.schedule_type,
    scheduled_at: validated.data.scheduled_at,
    day_of_week: validated.data.day_of_week,
  });

  return Response.json({ success: true });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const id = Number(body?.id);
  if (!body?.id || Number.isNaN(id)) {
    return Response.json({ error: 'id obbligatorio' }, { status: 400 });
  }

  const existing = await env.DB.prepare('SELECT 1 FROM scheduled_messages WHERE id = ?').bind(id).first();
  if (!existing) {
    return Response.json({ error: 'Messaggio pianificato non trovato' }, { status: 404 });
  }

  const validated = await validateScheduledMessage(env.DB, body);
  if (!validated.ok) {
    return Response.json({ error: validated.error }, { status: 400 });
  }

  await updateScheduledMessage(env.DB, id, validated.data);

  return Response.json({ success: true });
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const url = new URL(request.url);
  const idParam = url.searchParams.get('id');
  const id = Number(idParam);
  if (!idParam || Number.isNaN(id)) {
    return Response.json({ error: 'id obbligatorio' }, { status: 400 });
  }

  await deleteScheduledMessage(env.DB, id);
  return Response.json({ success: true });
};
