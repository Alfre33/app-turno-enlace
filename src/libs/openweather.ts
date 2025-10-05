import Constants from "expo-constants";

const BASE = "https://api.openweathermap.org/data/2.5";

export type WeatherResp = {
  name: string;
  sys: { country: string };
  weather: Array<{ main: string; description: string; icon: string }>;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  wind: { speed: number };
};

function resolveApiKey(override?: string): string | undefined {
  if (override?.trim()) return override.trim();

  const extra = (Constants.expoConfig?.extra ??
    (Constants as any)?.manifest?.extra ??
    {}) as any;

  const raw =
    (process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY as string | undefined) ??
    (extra?.OPENWEATHER_API_KEY as string | undefined);

  const key = raw?.trim();
  return key && key.length > 0 ? key : undefined;
}

function makeError(message: string, code: string, status?: number, cause?: any): Error {
  const err = new Error(message);
  (err as any).code = code;
  if (status !== undefined) (err as any).status = status;
  if (cause !== undefined) (err as any).cause = cause;
  return err;
}

export function assertApiKey(override?: string) {
  const key = resolveApiKey(override);
  if (!key) {
    throw makeError(
      "Falta EXPO_PUBLIC_OPENWEATHER_API_KEY en .env o extra en app.config.ts",
      "missing_key"
    );
  }
}

export async function getWeather(
  city: string,
  apiKey?: string,
  lang: "es" | "en" = "es"
): Promise<WeatherResp> {
  const key = resolveApiKey(apiKey);
  if (!key) {
    throw makeError(
      "Falta EXPO_PUBLIC_OPENWEATHER_API_KEY en .env o extra en app.config.ts",
      "missing_key"
    );
  }
  return getWeatherInternal(city, key, lang);
}

export async function getCurrentWeatherByCity(
  city: string,
  lang: "es" | "en" = "es"
): Promise<WeatherResp> {
  const key = resolveApiKey();
  if (!key) {
    throw makeError(
      "Falta EXPO_PUBLIC_OPENWEATHER_API_KEY en .env o extra en app.config.ts",
      "missing_key"
    );
  }
  return getWeatherInternal(city, key, lang);
}

async function getWeatherInternal(
  city: string,
  key: string,
  lang: "es" | "en"
): Promise<WeatherResp> {
  const q = city?.trim();
  if (!q) {
    throw makeError("Ingresa una ciudad.", "missing_city");
  }

  const url = `${BASE}/weather?q=${encodeURIComponent(q)}&appid=${key}&units=metric&lang=${lang}`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch (e: any) {
    const msg = String(e?.message || "");
    if (/Network request failed/i.test(msg)) {
      throw makeError("Sin conexión a internet.", "network", undefined, e);
    }
    throw makeError("No se pudo obtener el clima.", "unknown", undefined, e);
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw makeError("API key inválida (401).", "api_key_invalid", 401);
    }
    if (res.status === 404) {
      throw makeError("Ciudad no encontrada (404).", "city_not_found", 404);
    }
    throw makeError(`HTTP ${res.status}`, "http_error", res.status);
  }

  try {
    const data = (await res.json()) as WeatherResp;
    return data;
  } catch (e) {
    throw makeError("Respuesta inválida de la API.", "parse_error", undefined, e);
  }
}

export function iconToEmoji(icon?: string) {
  if (!icon) return "☁️";
  if (icon.startsWith("01")) return "☀️";
  if (icon.startsWith("02")) return "🌤️";
  if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
  if (icon.startsWith("11")) return "⛈️";
  if (icon.startsWith("13")) return "❄️";
  if (icon.startsWith("50")) return "🌫️";
  return "☁️";
}
