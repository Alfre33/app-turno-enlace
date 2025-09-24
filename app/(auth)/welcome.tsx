import { HeaderHero } from "@/components/common/HeaderHero";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 👈 importante

export default function Welcome() {
  const { theme, toggle } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.primaryMuted }]}
      edges={["top", "right", "left", "bottom"]}
    >
      {/* Toggle flotante para que no empuje el layout */}
      <View style={styles.toggle}>
        <Button variant="solid" size="sm" rounded="lg" onPress={toggle}>
          {theme.mode === "dark" ? "☀️ Light" : "🌙 Dark"}
        </Button>
      </View>

      {/* Contenedor que SI ocupa toda la altura */}
      <View style={styles.body}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.primaryMuted,
              borderRadius: 16,
              height: "90%",
            },
          ]}
        >
          <HeaderHero
            source={require("@/assets/images/logo-turno-enlace.png")}
            title="¡Bienvenido a Turno Enlace!"
            bg={theme.colors.primaryMuted}
          />
          <View>
            <ThemedText muted style={styles.subtitle}>
              Tu salud, simplificada. Encuentra y reserva citas médicas con
              facilidad.
            </ThemedText>
          </View>

          <Button
            fullWidth
            rounded="pill"
            onPress={() => router.push("/login")}
          >
            Comenzar
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  toggle: {
    position: "absolute",
    top: 30,
    right: 16,
    zIndex: 10,
  },
  body: { flex: 1, paddingHorizontal: 16, justifyContent: "center" },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    justifyContent: "space-around",
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "#2563EB",
  },
  title: { fontSize: 22, textAlign: "center", marginBottom: 8 },
  subtitle: { textAlign: "center", marginBottom: 24 },
});
