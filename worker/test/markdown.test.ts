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
});
