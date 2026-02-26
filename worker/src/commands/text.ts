import { Env } from '../types';
import { TelegramApi } from '../services/telegram';
import { getRandomTextResponse } from '../services/db';

interface CommandResult {
  handled: boolean;
  command?: string;
  target?: string;
}

// Patterns for text commands
const PATTERNS: { pattern: RegExp; slug: string; hasTarget: boolean; useSenderName?: boolean }[] = [
  { pattern: /^insulta\s+(.+)/i, slug: 'insulti', hasTarget: true },
  { pattern: /^minaccia\s+(.+)/i, slug: 'minacce', hasTarget: true },
  { pattern: /\bbestemmia\b/i, slug: 'bestemmie', hasTarget: false },
  { pattern: /\bcome diceva mio nonno\b/i, slug: 'nonno', hasTarget: false },
  { pattern: /^buongiorno\b/i, slug: 'saluti', hasTarget: false },
  { pattern: /^buonanotte\b/i, slug: 'saluti', hasTarget: false },
  { pattern: /^ciao\b/i, slug: 'saluti', hasTarget: false },
  // Anti-Juve: triggers on any message containing these words
  { pattern: /\b(?:juve|juventus|gobbi|bianconeri)\b/i, slug: 'anti-juve', hasTarget: false, useSenderName: true },
];

export async function handleTextCommand(
  text: string,
  chatId: string,
  env: Env,
  api: TelegramApi,
  senderName?: string
): Promise<CommandResult> {
  for (const { pattern, slug, hasTarget, useSenderName } of PATTERNS) {
    const match = text.match(pattern);
    if (!match) continue;

    const target = hasTarget ? match[1]?.trim() : undefined;
    const response = await getRandomTextResponse(env.DB, slug);

    if (!response) {
      await api.sendMessage(chatId, 'Non ho niente da dire... aggiungi contenuti dal backoffice! 🤷');
      return { handled: true, command: slug, target };
    }

    // Replace {name} placeholder with target or sender name
    let finalResponse = response;
    if (target) {
      finalResponse = response.replace(/\{name\}/g, target);
    } else if (useSenderName && senderName) {
      finalResponse = response.replace(/\{name\}/g, senderName);
    }

    await api.sendMessage(chatId, finalResponse);
    return { handled: true, command: slug, target };
  }

  return { handled: false };
}
