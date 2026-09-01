// Telegram legacy Markdown (parse_mode: 'Markdown') breaks with HTTP 400 when an
// interpolated value contains an unbalanced _ * ` or [. Escape values, not templates.
export function escapeMarkdown(text: string): string {
  return text.replace(/([_*`\[])/g, '\\$1');
}
