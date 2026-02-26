import { Env } from '../types';
import { TelegramApi } from '../services/telegram';
import { getRandomMedia, updateTelegramFileId } from '../services/db';
import { getMediaAsArrayBuffer } from '../services/storage';

interface CommandResult {
  handled: boolean;
  command?: string;
  responseType?: string;
}

// Audio patterns
const AUDIO_PATTERNS: { pattern: RegExp; slug: string }[] = [
  { pattern: /\bgermano\s*mosconi\b/i, slug: 'germano-mosconi' },
  { pattern: /\bchristian\s*de\s*sica\b/i, slug: 'christian-de-sica' },
  { pattern: /\bhomer\s*simpson\b/i, slug: 'homer-simpson' },
  { pattern: /\b(?:i\s+)?soliti\s*idioti\b/i, slug: 'soliti-idioti' },
  { pattern: /\brichard\s*benson\b/i, slug: 'richard-benson' },
  { pattern: /\beffetti\s*sonori\b/i, slug: 'effetti-sonori' },
];

// Photo patterns
const PHOTO_PATTERNS: { pattern: RegExp; slug: string }[] = [
  { pattern: /\bfica\b/i, slug: 'fica' },
  { pattern: /\bculo\b/i, slug: 'culo' },
  { pattern: /\btette\b/i, slug: 'tette' },
  { pattern: /\bdegrado\b/i, slug: 'degrado' },
];

export async function handleMediaCommand(
  text: string,
  chatId: string,
  env: Env,
  api: TelegramApi
): Promise<CommandResult> {
  // Check audio patterns
  for (const { pattern, slug } of AUDIO_PATTERNS) {
    if (!pattern.test(text)) continue;

    const media = await getRandomMedia(env.DB, slug);
    if (!media) {
      await api.sendMessage(chatId, `Nessun audio disponibile per "${slug}". Aggiungili dal backoffice! 🔇`);
      return { handled: true, command: slug, responseType: 'audio' };
    }

    // Use cached telegram_file_id if available
    if (media.telegram_file_id) {
      await api.sendAudio(chatId, media.telegram_file_id, media.file_name, media.caption ?? undefined);
      return { handled: true, command: slug, responseType: 'audio' };
    }

    // Otherwise, fetch from R2 and send
    const buffer = await getMediaAsArrayBuffer(env.MEDIA_BUCKET, media.r2_key);
    if (!buffer) {
      await api.sendMessage(chatId, 'File non trovato su R2! 😱');
      return { handled: true, command: slug, responseType: 'audio' };
    }

    const blob = new Blob([buffer], { type: media.mime_type || 'audio/mpeg' });
    const result = await api.sendAudio(chatId, blob, media.file_name, media.caption ?? undefined);

    // Cache the telegram file_id for future use
    if (result?.result?.audio?.file_id) {
      await updateTelegramFileId(env.DB, media.id, result.result.audio.file_id);
    }

    return { handled: true, command: slug, responseType: 'audio' };
  }

  // Check photo patterns
  for (const { pattern, slug } of PHOTO_PATTERNS) {
    if (!pattern.test(text)) continue;

    const media = await getRandomMedia(env.DB, slug);
    if (!media) {
      await api.sendMessage(chatId, `Nessuna foto disponibile per "${slug}". Aggiungile dal backoffice! 📷`);
      return { handled: true, command: slug, responseType: 'photo' };
    }

    // Use cached telegram_file_id if available
    if (media.telegram_file_id) {
      await api.sendPhoto(chatId, media.telegram_file_id, media.caption ?? undefined);
      return { handled: true, command: slug, responseType: 'photo' };
    }

    // Otherwise, fetch from R2 and send
    const buffer = await getMediaAsArrayBuffer(env.MEDIA_BUCKET, media.r2_key);
    if (!buffer) {
      await api.sendMessage(chatId, 'File non trovato su R2! 😱');
      return { handled: true, command: slug, responseType: 'photo' };
    }

    const blob = new Blob([buffer], { type: media.mime_type || 'image/jpeg' });
    const result = await api.sendPhoto(chatId, blob, media.caption ?? undefined);

    // Cache the telegram file_id
    if (result?.result?.photo) {
      const largestPhoto = result.result.photo[result.result.photo.length - 1];
      if (largestPhoto?.file_id) {
        await updateTelegramFileId(env.DB, media.id, largestPhoto.file_id);
      }
    }

    return { handled: true, command: slug, responseType: 'photo' };
  }

  return { handled: false };
}
