import { describe, it, expect } from 'vitest';
import { escapeMarkdown } from '../src/utils/markdown';

describe('escapeMarkdown', () => {
  it('escapes legacy Markdown metacharacters', () => {
    expect(escapeMarkdown('mario_rossi')).toBe('mario\\_rossi');
    expect(escapeMarkdown('*bold* `code` [link')).toBe('\\*bold\\* \\`code\\` \\[link');
  });
  it('leaves plain text untouched', () => {
    expect(escapeMarkdown('Gennaro Esposito')).toBe('Gennaro Esposito');
  });

  it('escapes a literal backslash before it can merge with the next escape', () => {
    // Raw input:  a \ _ b            (4 chars: a, backslash, underscore, b)
    // Raw output: a \\ \_ b          (6 chars: a, backslash, backslash, backslash, underscore, b)
    // Without escaping "\" first, "a\_b" would become "a\\_b" — an escaped
    // backslash followed by a live, unbalanced "_" opener — which Telegram
    // rejects with HTTP 400.
    expect(escapeMarkdown('a\\_b')).toBe('a\\\\\\_b');
  });
});
