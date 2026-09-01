import { describe, it, expect } from 'vitest';
import {
  JUVE_PATTERN, CALCIO_PATTERN, NAPOLI_PATTERN, EX_PATTERN, isCapslock,
} from '../src/patterns';

describe('trigger patterns', () => {
  it('matches juve words on word boundaries only', () => {
    expect(JUVE_PATTERN.test('forza juve!')).toBe(true);
    expect(JUVE_PATTERN.test('la Juventus vince')).toBe(true);
    expect(JUVE_PATTERN.test('juvenilia')).toBe(false);
  });

  it('CALCIO_PATTERN covers roma, lazio and milan fans', () => {
    expect(CALCIO_PATTERN.test('sono romanista')).toBe(true);
    expect(CALCIO_PATTERN.test('i laziali')).toBe(true);
    expect(CALCIO_PATTERN.test('milanisti ovunque')).toBe(true);
    expect(CALCIO_PATTERN.test('gioco a calcio')).toBe(false);
  });

  it('NAPOLI_PATTERN matches pizza but not pizzeria', () => {
    expect(NAPOLI_PATTERN.test('mangio una pizza')).toBe(true);
    expect(NAPOLI_PATTERN.test('vado in pizzeria')).toBe(false);
  });

  it('EX_PATTERN needs the possessive context', () => {
    expect(EX_PATTERN.test('la mia ex mi ha scritto')).toBe(true);
    expect(EX_PATTERN.test('unexploit')).toBe(false);
  });
});

describe('isCapslock', () => {
  it('false for short shouting', () => {
    expect(isCapslock('CIAO A')).toBe(false); // 5 letters < 10
  });
  it('true at 10+ letters and >=70% uppercase', () => {
    expect(isCapslock('MA CHE CAZZO DICI')).toBe(true);
  });
  it('false below 70% uppercase', () => {
    expect(isCapslock('MA che cazzo dici oggi')).toBe(false);
  });
  it('ignores digits and punctuation', () => {
    expect(isCapslock('1234567890!!!')).toBe(false); // zero letters
  });
  it('handles accented uppercase', () => {
    expect(isCapslock('PERCHÉ NON RISPONDI')).toBe(true);
  });
});
