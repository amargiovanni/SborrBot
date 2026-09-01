import { describe, it, expect } from 'vitest';
import { escapeMarkdownV2, escapeMarkdownV2Code, mdv2, mdv2raw } from '../src/utils/markdown';

describe('escapeMarkdownV2', () => {
  it('escapes every MarkdownV2 special character', () => {
    expect(escapeMarkdownV2('a_b*c[d]e(f)g~h`i>j#k+l-m=n|o{p}q.r!s')).toBe(
      'a\\_b\\*c\\[d\\]e\\(f\\)g\\~h\\`i\\>j\\#k\\+l\\-m\\=n\\|o\\{p\\}q\\.r\\!s'
    );
  });

  it('escapes the backslash itself first', () => {
    expect(escapeMarkdownV2('a\\.b')).toBe('a\\\\\\.b');
  });

  it('leaves plain text and emoji untouched', () => {
    expect(escapeMarkdownV2('Gennaro Esposito \u{1F480}')).toBe('Gennaro Esposito \u{1F480}');
  });
});

describe('escapeMarkdownV2Code', () => {
  it('escapes only backslash and backtick inside code spans', () => {
    expect(escapeMarkdownV2Code('combo-insulti.v2!')).toBe('combo-insulti.v2!');
    expect(escapeMarkdownV2Code('a`b\\c')).toBe('a\\`b\\\\c');
  });
});

describe('mdv2 tagged template', () => {
  it('escapes interpolated values but not the static template text', () => {
    const name = 'mario.rossi!';
    expect(mdv2`*Ciao* ${name}\\!`).toBe('*Ciao* mario\\.rossi\\!\\!');
  });

  it('inlines mdv2raw fragments untouched', () => {
    const slug = mdv2raw(escapeMarkdownV2Code('combo-insulti'));
    expect(mdv2`\`${slug}\``).toBe('`combo-insulti`');
  });

  it('stringifies non-string interpolations before escaping', () => {
    expect(mdv2`count: ${3}`).toBe('count: 3');
  });
});
