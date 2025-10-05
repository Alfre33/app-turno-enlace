// Top-level mocks (hoisted) so they are in place before modules are required
jest.mock('../src/libs/http', () => ({
  fetchJson: jest.fn(async (url: string) => ({
    name: 'Ciudad Test',
    sys: { country: 'AR' },
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    main: { temp: 20, temp_min: 15, temp_max: 22, humidity: 50 },
    wind: { speed: 3.5 },
  })),
}));

describe('openweather lib', () => {
  it('iconToEmoji maps codes to emojis', async () => {
    const { iconToEmoji } = require('../src/libs/openweather');
    expect(iconToEmoji('01d')).toBe('☀️');
    expect(iconToEmoji('02n')).toBe('🌤️');
    expect(iconToEmoji('10d')).toBe('🌧️');
    expect(iconToEmoji('50d')).toBe('🌫️');
    expect(iconToEmoji('')).toBe('☁️');
  });

  it('getCurrentWeatherByCity calls fetchJson and returns weather shape', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('expo-constants', () => ({ expoConfig: { extra: { openWeatherApiKey: 'FAKE_KEY' } } }));
      jest.doMock('../src/libs/http', () => ({
        fetchJson: jest.fn(async (url: string) => ({
          name: 'Ciudad Test',
          sys: { country: 'AR' },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
          main: { temp: 20, temp_min: 15, temp_max: 22, humidity: 50 },
          wind: { speed: 3.5 },
        })),
      }));

      const { getCurrentWeatherByCity } = require('../src/libs/openweather');
      const resp = await getCurrentWeatherByCity('Buenos Aires', 'es');
      expect(resp).toHaveProperty('name', 'Ciudad Test');
      expect(resp.weather[0].icon).toBe('01d');
    });
  });

  it('assertApiKey throws when missing', () => {
    jest.isolateModules(() => {
      jest.doMock('expo-constants', () => ({ expoConfig: { extra: {} } }));
      const mod = require('../src/libs/openweather');
      expect(() => mod.assertApiKey()).toThrow();
    });
  });
});
