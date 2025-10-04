import { fetchJson } from "./http";
import { buildWeatherUrl, iconToEmoji as coreIconToEmoji } from './openweather_core';

const BASE = process.env.EXPO_PUBLIC_OPENWEATHER_URL;

function getConstantsExtra() {
  // lazy require to avoid importing expo ESM modules at test/require time
  // (Jest may choke on expo virtual modules). This keeps runtime behavior
  // identical but defers loading until a function actually needs it.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Constants = require("expo-constants");
  return Constants.expoConfig?.extra || {};
}

function getApiKeyFromConstants() {
  const extra = getConstantsExtra();
  return extra.openWeatherApiKey;
}

export type WeatherResp = {
  name: string;
  sys: { country: string };
  weather: Array<{ main: string; description: string; icon: string }>;
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  wind: { speed: number };
};

export function assertApiKey() {
  const API_KEY = getApiKeyFromConstants();
  if (!API_KEY) {
    throw {
      code: "missing_key",
      message: "Falta EXPO_PUBLIC_OPENWEATHER_API_KEY en .env",
    };
  }
}
// hice una modificasion en ApiKey para los test, si no esta la key tira error
// si no esta la key tira error
export async function getCurrentWeatherByCity(
  city: string,
  lang: "es" | "en" = "es"
): Promise<WeatherResp> {
  const API_KEY = getApiKeyFromConstants();
  if (!API_KEY) throw { code: "missing_key", message: "Falta API key" };
  const url = buildWeatherUrl(BASE || '', API_KEY, city, lang);
  return fetchJson<WeatherResp>(url);
}

export function iconToEmoji(icon?: string) {
  return coreIconToEmoji(icon);
}
