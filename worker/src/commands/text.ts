import { Env } from '../types';
import { TelegramApi } from '../services/telegram';
import { getRandomTextResponse, getMultipleRandomTextResponses } from '../services/db';

interface CommandResult {
  handled: boolean;
  command?: string;
  target?: string;
}

// Zodiac signs with emoji
const ZODIAC_SIGNS: Record<string, string> = {
  ariete: '\u2648',
  toro: '\u2649',
  gemelli: '\u264A',
  cancro: '\u264B',
  leone: '\u264C',
  vergine: '\u264D',
  bilancia: '\u264E',
  scorpione: '\u264F',
  sagittario: '\u2650',
  capricorno: '\u2651',
  acquario: '\u2652',
  pesci: '\u2653',
};

const ZODIAC_NAMES = Object.keys(ZODIAC_SIGNS);

// Patterns for text commands
const PATTERNS: { pattern: RegExp; slug: string; hasTarget: boolean; useSenderName?: boolean }[] = [
  // Combo must come BEFORE normal insulta
  { pattern: /^insulta combo\s+(.+)/i, slug: 'combo-insulti', hasTarget: true },
  { pattern: /^insulta\s+(.+)/i, slug: 'insulti', hasTarget: true },
  { pattern: /^minaccia\s+(.+)/i, slug: 'minacce', hasTarget: true },
  { pattern: /\bbestemmia\b/i, slug: 'bestemmie', hasTarget: false },
  { pattern: /\bcome diceva mio nonno\b/i, slug: 'nonno', hasTarget: false },
  { pattern: /^buongiorno\b/i, slug: 'saluti', hasTarget: false },
  { pattern: /^buonanotte\b/i, slug: 'saluti', hasTarget: false },
  { pattern: /^ciao\b/i, slug: 'saluti', hasTarget: false },
  // Anti-Juve: triggers on any message containing these words
  { pattern: /\b(?:juve|juventus|gobbi|bianconeri)\b/i, slug: 'anti-juve', hasTarget: false, useSenderName: true },
  // New features
  { pattern: /^oroscopo\s*(.*)/i, slug: 'oroscopo', hasTarget: false },
  { pattern: /\b(?:frase celebre|citazione|perla di saggezza)\b/i, slug: 'frasi-celebri', hasTarget: false },
];

async function handleOroscopo(text: string, chatId: string, env: Env, api: TelegramApi): Promise<CommandResult> {
  const match = text.match(/^oroscopo\s*(.*)/i);
  if (!match) return { handled: false };

  const input = match[1]?.trim().toLowerCase() || '';

  // Determine the sign
  let signName: string;
  if (input && ZODIAC_SIGNS[input]) {
    signName = input;
  } else if (input) {
    // Try to find a partial match
    const found = ZODIAC_NAMES.find(s => s.startsWith(input));
    if (found) {
      signName = found;
    } else {
      await api.sendMessage(
        chatId,
        `Non conosco il segno "${input}"! Prova con: ${ZODIAC_NAMES.join(', ')}`,
      );
      return { handled: true, command: 'oroscopo' };
    }
  } else {
    // Random sign
    signName = ZODIAC_NAMES[Math.floor(Math.random() * ZODIAC_NAMES.length)];
  }

  const emoji = ZODIAC_SIGNS[signName];
  const response = await getRandomTextResponse(env.DB, 'oroscopo');

  if (!response) {
    await api.sendMessage(chatId, 'Le stelle sono in pausa... aggiungi contenuti dal backoffice!');
    return { handled: true, command: 'oroscopo' };
  }

  const displayName = signName.charAt(0).toUpperCase() + signName.slice(1);
  const message = `\u{1F52E} *Oroscopo di oggi \u2014 ${displayName}* ${emoji}\n\n${response}`;

  await api.sendMessage(chatId, message, 'Markdown');
  return { handled: true, command: 'oroscopo' };
}

async function handleComboInsulti(target: string, chatId: string, env: Env, api: TelegramApi): Promise<CommandResult> {
  const insults = await getMultipleRandomTextResponses(env.DB, 'insulti', 3);

  if (insults.length === 0) {
    await api.sendMessage(chatId, 'Non ho insulti in magazzino... aggiungi contenuti dal backoffice!');
    return { handled: true, command: 'combo-insulti', target };
  }

  const formatted = insults.map((insult, i) => {
    const emojis = ['\u0031\uFE0F\u20E3', '\u0032\uFE0F\u20E3', '\u0033\uFE0F\u20E3'];
    const replaced = insult.replace(/\{name\}/g, target);
    return `${emojis[i]} ${replaced}`;
  });

  const message = `\u{1F480} *COMBO INSULTI per ${target}:*\n\n${formatted.join('\n\n')}\n\n\u2620\uFE0F *FATALITY!*`;
  await api.sendMessage(chatId, message, 'Markdown');
  return { handled: true, command: 'combo-insulti', target };
}

async function handleFrasiCelebri(chatId: string, env: Env, api: TelegramApi): Promise<CommandResult> {
  const response = await getRandomTextResponse(env.DB, 'frasi-celebri');

  if (!response) {
    await api.sendMessage(chatId, 'Non ho citazioni... aggiungi contenuti dal backoffice!');
    return { handled: true, command: 'frasi-celebri' };
  }

  const message = `\u{1F4DC} *Perla di Saggezza*\n\n${response}`;
  await api.sendMessage(chatId, message, 'Markdown');
  return { handled: true, command: 'frasi-celebri' };
}

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

    // Custom handlers for new features
    if (slug === 'oroscopo') {
      return handleOroscopo(text, chatId, env, api);
    }
    if (slug === 'combo-insulti') {
      const target = match[1]?.trim();
      if (!target) continue;
      return handleComboInsulti(target, chatId, env, api);
    }
    if (slug === 'frasi-celebri') {
      return handleFrasiCelebri(chatId, env, api);
    }

    // Standard handler for existing patterns
    const target = hasTarget ? match[1]?.trim() : undefined;
    const response = await getRandomTextResponse(env.DB, slug);

    if (!response) {
      await api.sendMessage(chatId, 'Non ho niente da dire... aggiungi contenuti dal backoffice! \u{1F937}');
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
