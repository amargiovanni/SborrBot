// MarkdownV2 treats all of _ * [ ] ( ) ~ ` > # + - = | { } . ! as syntax and
// rejects the whole message (HTTP 400) on any unescaped occurrence outside an
// entity. The backslash is escaped first via the same alternation, otherwise a
// raw "\" would merge with the next escaped character into a new escape.
export function escapeMarkdownV2(text: string): string {
  return text.replace(/([\\_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

// Inside MarkdownV2 code spans only ` and \ are syntax; escaping anything else
// there would render the backslashes literally.
export function escapeMarkdownV2Code(text: string): string {
  return text.replace(/([\\`])/g, '\\$1');
}

// A fragment already escaped for its context (e.g. a code span), to be inlined
// by mdv2 without re-escaping.
export class MarkdownV2Raw {
  constructor(readonly text: string) {}
}

export function mdv2raw(text: string): MarkdownV2Raw {
  return new MarkdownV2Raw(text);
}

// Tagged template for MarkdownV2 messages: static template text is trusted and
// must be authored pre-escaped (formatting like *bold* stays live); every
// interpolated value is treated as plain text and fully escaped, unless it is
// wrapped in mdv2raw().
export function mdv2(strings: TemplateStringsArray, ...values: (string | number | MarkdownV2Raw)[]): string {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    out += v instanceof MarkdownV2Raw ? v.text : escapeMarkdownV2(String(v));
    out += strings[i + 1];
  }
  return out;
}
