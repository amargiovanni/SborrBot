const TELEGRAM_API = 'https://api.telegram.org/bot';

export interface TelegramResponse {
  ok: boolean;
  description?: string;
  error_code?: number;
  result?: unknown;
}

export class TelegramApi {
  private baseUrl: string;

  constructor(botToken: string) {
    this.baseUrl = `${TELEGRAM_API}${botToken}`;
  }

  private async handle(method: string, res: Response): Promise<TelegramResponse> {
    let body: TelegramResponse;
    try {
      body = (await res.json()) as TelegramResponse;
    } catch {
      body = { ok: false, error_code: res.status, description: `HTTP ${res.status}: non-JSON response` };
    }
    if (!res.ok || !body.ok) {
      console.error(`Telegram API ${method} failed:`, body.description ?? `HTTP ${res.status}`);
    }
    return body;
  }

  private async callJson(method: string, payload: Record<string, unknown>): Promise<TelegramResponse> {
    const res = await fetch(`${this.baseUrl}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return this.handle(method, res);
  }

  private async callForm(method: string, form: FormData): Promise<TelegramResponse> {
    const res = await fetch(`${this.baseUrl}/${method}`, { method: 'POST', body: form });
    return this.handle(method, res);
  }

  async sendMessage(chatId: number | string, text: string, parseMode?: string): Promise<TelegramResponse> {
    return this.callJson('sendMessage', { chat_id: chatId, text, parse_mode: parseMode });
  }

  async sendPhoto(chatId: number | string, photo: Blob | string, caption?: string): Promise<TelegramResponse> {
    if (typeof photo === 'string') {
      return this.callJson('sendPhoto', { chat_id: chatId, photo, caption });
    }
    const form = new FormData();
    form.append('chat_id', String(chatId));
    form.append('photo', photo, 'photo.jpg');
    if (caption) form.append('caption', caption);
    return this.callForm('sendPhoto', form);
  }

  async sendAudio(chatId: number | string, audio: Blob | string, filename?: string, title?: string): Promise<TelegramResponse> {
    if (typeof audio === 'string') {
      return this.callJson('sendAudio', { chat_id: chatId, audio, title });
    }
    const form = new FormData();
    form.append('chat_id', String(chatId));
    form.append('audio', audio, filename || 'audio.mp3');
    if (title) form.append('title', title);
    return this.callForm('sendAudio', form);
  }

  async sendSticker(chatId: number | string, sticker: string): Promise<TelegramResponse> {
    return this.callJson('sendSticker', { chat_id: chatId, sticker });
  }

  async setWebhook(url: string, secret: string): Promise<TelegramResponse> {
    return this.callJson('setWebhook', {
      url,
      secret_token: secret,
      allowed_updates: ['message', 'inline_query'],
    });
  }

  async deleteWebhook(): Promise<TelegramResponse> {
    const res = await fetch(`${this.baseUrl}/deleteWebhook`, { method: 'POST' });
    return this.handle('deleteWebhook', res);
  }

  async answerInlineQuery(queryId: string, results: unknown[]): Promise<TelegramResponse> {
    return this.callJson('answerInlineQuery', { inline_query_id: queryId, results, cache_time: 10 });
  }

  async setMessageReaction(chatId: number | string, messageId: number, emoji: string): Promise<void> {
    await this.callJson('setMessageReaction', {
      chat_id: chatId,
      message_id: messageId,
      reaction: [{ type: 'emoji', emoji }],
    });
  }
}
