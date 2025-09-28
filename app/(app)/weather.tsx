import React, { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokens } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/Button";
import { getCurrentWeatherByCity, iconToEmoji, WeatherResp } from "@/src/libs/openweather";

export default function WeatherScreen() {
  const { theme: t } = useTheme();
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<WeatherResp | null>(null);

  const onFetch = useCallback(async () => {
    setErr(null);
    setData(null);
    if (!city.trim()) {
      setErr("Ingresa una ciudad.");
      return;
    }
    setLoading(true);
    try {
      const res = await getCurrentWeatherByCity(city.trim(), "es");
      setData(res);
    } catch (e: any) {
   
      if (e?.code === "missing_key") setErr("Configura EXPO_PUBLIC_OPENWEATHER_API_KEY en .env");
      else if (e?.code === "offline") setErr("Sin conexión. Intenta de nuevo cuando tengas internet.");
      else if (e?.code === "timeout") setErr("La API tardó demasiado en responder.");
      else if (e?.status === 401) setErr("API key inválida o faltante (401).");
      else if (e?.status === 404) setErr("Ciudad no encontrada (404).");
      else setErr(e?.message || "No se pudo obtener el clima.");
    } finally {
      setLoading(false);
    }
  }, [city]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: t.colors.text }]}>Clima por ciudad</Text>

          <View style={{ gap: 8 }}>
            <Text style={{ color: t.colors.text }}>Ciudad</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Ej. Ciudad de México"
              autoCapitalize="words"
              returnKeyType="search"
              onSubmitEditing={onFetch}
              style={[
                styles.input,
                { borderColor: err ? t.colors.danger : "#ccc", color: t.colors.text },
              ]}
            />
          </View>

          <Button fullWidth onPress={onFetch} disabled={loading}>
            {loading ? "Buscando..." : "Obtener clima"}
          </Button>

          {err ? (
            <View style={[styles.errorBox, { borderColor: t.colors.danger }]}>
              <Text style={{ color: t.colors.danger, fontWeight: "600" }}>{err}</Text>
            </View>
          ) : null}

          {data ? (
            <View style={[styles.card, { backgroundColor: t.colors.card }]}>
              <Text style={[styles.city, { color: t.colors.text }]}>
                {data.name}, {data.sys?.country}
              </Text>

              <Text style={[styles.temp, { color: t.colors.text }]}>
                {iconToEmoji(data.weather?.[0]?.icon)} {Math.round(data.main.temp)}°C
              </Text>

              <Text style={{ color: t.colors.text, opacity: 0.85 }}>
                {data.weather?.[0]?.description ?? "—"}
              </Text>

              <View style={styles.row}>
                <Text style={[styles.kv, { color: t.colors.text }]}>
                  Mín: {Math.round(data.main.temp_min)}°C
                </Text>
                <Text style={[styles.kv, { color: t.colors.text }]}>
                  Máx: {Math.round(data.main.temp_max)}°C
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.kv, { color: t.colors.text }]}>
                  Humedad: {data.main.humidity}%
                </Text>
                <Text style={[styles.kv, { color: t.colors.text }]}>
                  Viento: {Math.round(data.wind.speed)} m/s
                </Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    padding: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
  title: { fontSize: 22, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  city: { fontSize: 18, fontWeight: "600" },
  temp: { fontSize: 36, fontWeight: "800" },
  row: { flexDirection: "row", gap: 16, marginTop: 4 },
  kv: { fontSize: 14 },
});
