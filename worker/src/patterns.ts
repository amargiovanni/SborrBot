// Trigger patterns shared by auto-reactions (bot.ts) and text responses (commands/text.ts).
export const JUVE_PATTERN = /\b(?:juve|juventus|gobbi|bianconeri)\b/i;
export const LAMENTI_PATTERN = /\b(?:ho fame|sono stanco|sono stanca|che noia|mi annoio|sono triste|che palle|ho sonno|sono depresso|sono depressa|sto male|non ce la faccio|sono solo|sono sola|ho caldo|ho freddo|sono stressato|sono stressata|mi fa male|che fatica|sono esausto|sono esausta|che barba|sono a pezzi|non ne posso pi[uù]|basta tutto)\b/i;
export const BESTEMMIA_PATTERN = /\bbestemmia\b/i;
export const NAPOLI_PATTERN = /\b(?:napoli|napoletan[oiae]|vesuvio|pizza|pizzaiolo|mozzarella|sfogliatella|maradona|pulcinella|camorra|gomorra|totò|toto|pino daniele|spaccanapoli|posillipo|vomero|scampia|secondigliano|marechiaro|fuorigrotta|san gennaro|babà|baba|ragù|ragu|friarielli|cuoppo|o sole mio)\b/i;
export const ROMA_PATTERN = /\b(?:romanista|romanisti|giallorossi|as roma|lupacchiotti|trigoria)\b/i;
export const LAZIO_PATTERN = /\b(?:laziale|laziali|biancocelesti|aquilotti|ss lazio|lotito)\b/i;
export const MILAN_PATTERN = /\b(?:milanista|milanisti|rossoneri|ac milan|casciavit)\b/i;
export const CALCIO_PATTERN = new RegExp(
  [ROMA_PATTERN, LAZIO_PATTERN, MILAN_PATTERN].map((p) => p.source).join('|'),
  'i'
);
export const EX_PATTERN = /\b(?:la mia ex|il mio ex|mia ex|mio ex|ex ragazza|ex fidanzata|ex fidanzato|ex moglie|ex marito|ex morosa|ex moroso)\b/i;
export const TERAPIA_PATTERN = /\b(?:terapia|psicologo|psicologa|psichiatra|psicanalisi|psicanalista|vado dallo psicologo|seduta dallo psicologo|lo psicologo)\b/i;

// A message counts as capslock shouting when it has at least 10 letters
// and at least 70% of them are uppercase.
export function isCapslock(text: string): boolean {
  const letters = text.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  if (letters.length < 10) return false;
  const upperCount = letters.replace(/[^A-ZÀ-Ö]/g, '').length;
  return upperCount / letters.length >= 0.7;
}
