import Constants from "expo-constants";
import { Link } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

type WeatherResp = {
  name: string;
  sys?: { country?: string };
  weather?: Array<{ description?: string; icon?: string }>;
  main?: {
    temp?: number;
    temp_min?: number;
    temp_max?: number;
    humidity?: number;
  };
  wind?: { speed?: number };
};

const extra = (Constants.expoConfig?.extra ??
  (Constants as any)?.manifest?.extra ??
  {}) as any;

const API_KEY: string | undefined =
  (process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY as string | undefined)?.trim() ??
  (String(extra?.OPENWEATHER_API_KEY || "").trim() || undefined);

const OW_BASE = "https://api.openweathermap.org/data/2.5";

export default function HomeScreen() {
  const { user, logout, isAuthenticating } = useAuth();

  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Buenos Dias";
    if (hours < 18) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  const [city, setCity] = useState("");
  const [wLoading, setWLoading] = useState(false);
  const [wError, setWError] = useState<string | null>(null);
  const [wData, setWData] = useState<WeatherResp | null>(null);

  const fetchWeather = useCallback(async () => {
    setWError(null);
    setWData(null);

    const cityQ = city.trim();
    if (!cityQ) {
      setWError("Ingresa una ciudad.");
      return;
    }
    if (!API_KEY) {
      setWError(
        "Falta EXPO_PUBLIC_OPENWEATHER_API_KEY en tu .env o extra en app.config.ts."
      );
      return;
    }
    if (!/^[0-9a-f]{32}$/i.test(API_KEY)) {
      setWError("La API key no tiene el formato esperado (32 hex).");
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    setWLoading(true);
    try {
      const url = `${OW_BASE}/weather?q=${encodeURIComponent(
        cityQ
      )}&appid=${API_KEY}&units=metric&lang=es`;

      const res = await fetch(url, { signal: controller.signal });

      if (!res.ok) {
        if (res.status === 401) throw new Error("API key inválida (401).");
        if (res.status === 404) throw new Error("Ciudad no encontrada (404).");
        const t = await res.text().catch(() => "");
        throw new Error(t || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as WeatherResp;
      setWData(data);
    } catch (e: any) {
      if (e?.name === "AbortError") setWError("La solicitud tardó demasiado.");
      else if (e?.message?.includes?.("Network request failed"))
        setWError("Sin conexión a internet.");
      else setWError(e?.message || "No se pudo obtener el clima.");
    } finally {
      clearTimeout(timeout);
      setWLoading(false);
    }
  }, [city]);

  const iconToEmoji = (icon?: string) => {
    if (!icon) return "☁️";
    if (icon.startsWith("01")) return "☀️";
    if (icon.startsWith("02")) return "🌤️";
    if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
    if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
    if (icon.startsWith("11")) return "⛈️";
    if (icon.startsWith("13")) return "❄️";
    if (icon.startsWith("50")) return "🌫️";
    return "☁️";
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>
            {user?.displayName ?? user?.email ?? "Hola!!!"}
          </Text>
          <Text style={styles.subtitle}>
            Bienvenido a Turno Enlace. Explora tus citas y gestiona tu perfil
            fácilmente.
          </Text>

          <Link href="/(app)/profile" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Ver Perfil</Text>
            </Pressable>
          </Link>
          <Link href="/(app)/categories" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Categorias</Text>
            </Pressable>
          </Link>
          <Link href="/(app)/appointments" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Citas</Text>
            </Pressable>
          </Link>

          <Pressable
            onPress={logout}
            disabled={isAuthenticating}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.85 },
              isAuthenticating && styles.disabled,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {isAuthenticating ? "Signing out..." : "Salir"}
            </Text>
          </Pressable>
        </View>

        {/* ---- Clima rápido dentro del Home ---- */}
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>Clima rápido</Text>

          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Ciudad</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Ej. Ciudad de México"
              autoCapitalize="words"
              returnKeyType="search"
              onSubmitEditing={fetchWeather}
              style={styles.input}
            />
          </View>

          <Pressable
            onPress={fetchWeather}
            disabled={wLoading}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.9 },
              wLoading && styles.disabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {wLoading ? "Buscando..." : "Obtener clima"}
            </Text>
          </Pressable>

          {wError ? (
            <View style={styles.errBox}>
              <Text style={styles.errText}>{wError}</Text>
            </View>
          ) : null}

          {wData ? (
            <View style={styles.weatherResult}>
              <Text style={styles.weatherCity}>
                {wData.name}
                {wData.sys?.country ? `, ${wData.sys.country}` : ""}
              </Text>
              <Text style={styles.weatherTemp}>
                {iconToEmoji(wData.weather?.[0]?.icon)}{" "}
                {Math.round(wData.main?.temp ?? 0)}°C
              </Text>
              <Text style={styles.weatherDesc}>
                {wData.weather?.[0]?.description ?? "—"}
              </Text>

              <View style={styles.kvRow}>
                <Text style={styles.kv}>
                  Mín: {Math.round(wData.main?.temp_min ?? 0)}°C
                </Text>
                <Text style={styles.kv}>
                  Máx: {Math.round(wData.main?.temp_max ?? 0)}°C
                </Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.kv}>
                  Humedad: {wData.main?.humidity ?? 0}%
                </Text>
                <Text style={styles.kv}>
                  Viento: {Math.round(wData.wind?.speed ?? 0)} m/s
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: { flex: 1 },
  content: {
    padding: theme.space.xl,
    paddingBottom: theme.space.xl * 2,
    gap: theme.space.xl,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.space.xl,
    shadowColor: theme.colors.shadowColor,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  greeting: {
    fontSize: 18,
    color: theme.colors.muted,
    marginBottom: theme.space.xs,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.space.sm,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.muted,
    marginBottom: theme.space.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    marginBottom: theme.space.md,
  },
  primaryButtonText: {
    color: theme.colors.primaryText,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: { opacity: 0.6 },

  weatherCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.space.xl,
    gap: theme.space.md,
    shadowColor: theme.colors.shadowColor,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  label: { color: theme.colors.muted },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 12,
    color: theme.colors.text,
  },
  errBox: {
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: theme.radius.md,
    padding: 12,
  },
  errText: { color: "#dc2626", fontWeight: "600" },
  weatherResult: { gap: 6 },
  weatherCity: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
  weatherTemp: { fontSize: 34, fontWeight: "800", color: theme.colors.text },
  weatherDesc: { color: theme.colors.muted },
  kvRow: { flexDirection: "row", gap: 16, marginTop: 4 },
  kv: { color: theme.colors.text },
});
