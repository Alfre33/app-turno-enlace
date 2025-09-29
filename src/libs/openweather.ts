import Constants from "expo-constants";
import { fetchJson } from "./http";

const extra = Constants.expoConfig?.extra || {};
const API_KEY = extra.openWeatherApiKey;
const BASE = process.env.EXPO_PUBLIC_OPENWEATHER_URL;

export type WeatherResp = {
  name: string;
  sys: { country: string };
  weather: Array<{ main: string; description: string; icon: string }>;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  wind: { speed: number };
};

export function assertApiKey() {
  if (!API_KEY) {
    throw {
      code: "missing_key",
      message: "Falta EXPO_PUBLIC_OPENWEATHER_API_KEY en .env",
    };
  }
}

export async function getCurrentWeatherByCity(
  city: string,
  lang: "es" | "en" = "es"
): Promise<WeatherResp> {
  assertApiKey();
  const q = encodeURIComponent(city.trim());
  const url = `${BASE}/weather?q=${q}&appid=${API_KEY}&units=metric&lang=${lang}`;
  return fetchJson<WeatherResp>(url);
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
