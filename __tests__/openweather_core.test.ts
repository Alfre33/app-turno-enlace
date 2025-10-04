import { iconToEmoji, buildWeatherUrl } from '../src/libs/openweather_core';

describe('openweather_core', () => {
  it('iconToEmoji maps codes', () => {
    expect(iconToEmoji('01d')).toBe('☀️');
    expect(iconToEmoji('02n')).toBe('🌤️');
    expect(iconToEmoji('09d')).toBe('🌧️');
    expect(iconToEmoji('50d')).toBe('🌫️');
    expect(iconToEmoji(undefined)).toBe('☁️');
  });

  it('buildWeatherUrl composes url', () => {
    const url = buildWeatherUrl('http://api.test', 'KEY', 'Mi Ciudad', 'es');
    expect(url).toContain('http://api.test/weather');
    expect(url).toContain('appid=KEY');
    expect(url).toContain('q=Mi%20Ciudad');
  });
});
