import type { APIRoute } from 'astro';
import {
  getScheduledMessages,
  createScheduledMessage,
  updateScheduledMessage,
  deleteScheduledMessage,
} from '../../lib/db';

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

  const { message_text, target_group_id, schedule_type, scheduled_at, day_of_week } = body;
  if (!message_text || !schedule_type || !scheduled_at) {
    return Response.json({ error: 'message_text, schedule_type e scheduled_at sono obbligatori' }, { status: 400 });
  }
  if (!['once', 'daily', 'weekly'].includes(schedule_type)) {
    return Response.json({ error: 'schedule_type deve essere once, daily o weekly' }, { status: 400 });
  }

  await createScheduledMessage(env.DB, {
    message_text,
    target_group_id: target_group_id || null,
    schedule_type,
    scheduled_at,
    day_of_week: schedule_type === 'weekly' ? (day_of_week ?? 0) : null,
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

  const { id, message_text, target_group_id, schedule_type, scheduled_at, day_of_week, is_active } = body;
  if (!id) return Response.json({ error: 'id obbligatorio' }, { status: 400 });

  await updateScheduledMessage(env.DB, id, {
    message_text,
    target_group_id: target_group_id || null,
    schedule_type,
    scheduled_at,
    day_of_week: schedule_type === 'weekly' ? (day_of_week ?? 0) : null,
    is_active: is_active ?? 1,
  });

  return Response.json({ success: true });
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env?.DB) return new Response('Server error', { status: 500 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return Response.json({ error: 'id obbligatorio' }, { status: 400 });

  await deleteScheduledMessage(env.DB, Number(id));
  return Response.json({ success: true });
};
