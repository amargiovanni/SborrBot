import { describe, it, expect } from 'vitest';
import { categorizeWeather, buildWeatherMessage, WeatherData } from '../src/services/weather';

function wd(overrides: Partial<WeatherData>): WeatherData {
  return {
    conditionCode: 800, conditionMain: 'Clear', description: 'cielo sereno',
    temperature: 20, feelsLike: 20, humidity: 50, windSpeed: 3, cityName: 'Roma',
    ...overrides,
  };
}

describe('categorizeWeather', () => {
  it('temperature extremes win over condition codes', () => {
    expect(categorizeWeather(wd({ temperature: 35, conditionCode: 500 }))).toBe('caldo');
    expect(categorizeWeather(wd({ temperature: 0, conditionCode: 800 }))).toBe('freddo');
  });
  it('maps condition code ranges', () => {
    expect(categorizeWeather(wd({ conditionCode: 211 }))).toBe('temporale');
    expect(categorizeWeather(wd({ conditionCode: 501 }))).toBe('pioggia');
    expect(categorizeWeather(wd({ conditionCode: 601 }))).toBe('neve');
    expect(categorizeWeather(wd({ conditionCode: 741 }))).toBe('nebbia');
    expect(categorizeWeather(wd({ conditionCode: 800 }))).toBe('sereno');
    expect(categorizeWeather(wd({ conditionCode: 803 }))).toBe('nuvole');
  });
});

describe('buildWeatherMessage', () => {
  it('substitutes every placeholder', () => {
    for (let i = 0; i < 20; i++) {
      const msg = buildWeatherMessage(wd({ temperature: 22, windSpeed: 5 }));
      expect(msg).not.toMatch(/\{(temp|feels_like|desc|humidity|wind)\}/);
      expect(msg).toContain('22');
    }
  });
});
