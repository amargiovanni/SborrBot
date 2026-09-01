// Telegram legacy Markdown (parse_mode: 'Markdown') breaks with HTTP 400 when an
// interpolated value contains an unbalanced _ * ` or [. Escape values, not templates.
// The backslash itself must be escaped first, otherwise a raw "\" merges with the
// next escaped character into a new escape sequence (e.g. "a\_b" -> "a\\_b", which
// Telegram reads as an escaped backslash followed by a live, unbalanced "_").
export function escapeMarkdown(text: string): string {
  return text.replace(/([\\_*`\[])/g, '\\$1');
}
