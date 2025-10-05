/**
 * @jest-environment node
 */

import { getWeather } from "@/src/libs/openweather";

let originalFetch: any;

beforeAll(() => {
  originalFetch = (globalThis as any).fetch;
});

afterEach(() => {
  if (originalFetch) {
    (globalThis as any).fetch = originalFetch;
  } else {
    delete (globalThis as any).fetch;
  }
  jest.resetAllMocks();
});

function mockFetch(status: number, body: any) {
  (globalThis as any).fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

test("devuelve datos cuando la API responde 200", async () => {
  mockFetch(200, {
    name: "Guadalajara",
    sys: { country: "MX" },
    weather: [{ description: "cielo claro", icon: "01d", main: "Clear" }],
    main: { temp: 25, temp_min: 22, temp_max: 27, humidity: 50 },
    wind: { speed: 2 },
  });

  const data = await getWeather("Guadalajara", "FAKE_KEY_123456789012345678901234567890");
  expect(data.name).toBe("Guadalajara");
  expect(data.main?.temp).toBe(25);
});

test("lanza error claro si API key inválida (401)", async () => {
  mockFetch(401, {});
  await expect(getWeather("CDMX", "mala")).rejects.toThrow("API key inválida (401).");
});

test("lanza error claro si ciudad no existe (404)", async () => {
  mockFetch(404, {});
  await expect(getWeather("Xyz123", "ok")).rejects.toThrow("Ciudad no encontrada (404).");
});
