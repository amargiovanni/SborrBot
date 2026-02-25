const TELEGRAM_API = 'https://api.telegram.org/bot';

export class TelegramApi {
  private baseUrl: string;

  constructor(botToken: string) {
    this.baseUrl = `${TELEGRAM_API}${botToken}`;
  }

  async sendMessage(chatId: number | string, text: string, parseMode?: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });
    return res.json();
  }

  async sendPhoto(chatId: number | string, photo: Blob | string, caption?: string): Promise<any> {
    if (typeof photo === 'string') {
      // photo is a file_id
      const res = await fetch(`${this.baseUrl}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, photo, caption }),
      });
      return res.json();
    }
    const formData = new FormData();
    formData.append('chat_id', String(chatId));
    formData.append('photo', photo, 'photo.jpg');
    if (caption) formData.append('caption', caption);
    const res = await fetch(`${this.baseUrl}/sendPhoto`, { method: 'POST', body: formData });
    return res.json();
  }

  async sendAudio(chatId: number | string, audio: Blob | string, filename?: string, title?: string): Promise<any> {
    if (typeof audio === 'string') {
      const res = await fetch(`${this.baseUrl}/sendAudio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, audio, title }),
      });
      return res.json();
    }
    const formData = new FormData();
    formData.append('chat_id', String(chatId));
    formData.append('audio', audio, filename || 'audio.mp3');
    if (title) formData.append('title', title);
    const res = await fetch(`${this.baseUrl}/sendAudio`, { method: 'POST', body: formData });
    return res.json();
  }

  async sendSticker(chatId: number | string, sticker: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/sendSticker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, sticker }),
    });
    return res.json();
  }

  async setWebhook(url: string, secret: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        secret_token: secret,
        allowed_updates: ['message', 'inline_query'],
      }),
    });
    return res.json();
  }

  async deleteWebhook(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/deleteWebhook`, { method: 'POST' });
    return res.json();
  }

  async answerInlineQuery(queryId: string, results: any[]): Promise<any> {
    const res = await fetch(`${this.baseUrl}/answerInlineQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inline_query_id: queryId,
        results,
        cache_time: 10,
      }),
    });
    return res.json();
  }
}
