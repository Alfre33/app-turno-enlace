
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import * as LocalAuth from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/constants/theme";

export default function LockScreen() {
  const { loginWithBiometrics, authError, clearError } = useAuth();
  const [trying, setTrying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const available = await LocalAuth.hasHardwareAsync();
        const enrolled = await LocalAuth.isEnrolledAsync();
        if (!available || !enrolled) {
          Alert.alert(
            "Biometría no disponible",
            "Configura tu huella o FaceID en el dispositivo."
          );
          return;
        }
        await tryUnlock();
      } catch {
      }
    })();
  }, []);

  const tryUnlock = async () => {
    if (trying) return;
    setTrying(true);
    clearError();

    try {
      await loginWithBiometrics(); 
      await SecureStore.deleteItemAsync("LOCKED").catch(() => {});
      router.replace("/(app)"); 
    } catch (e: any) {

      if (e?.code === "auth/no-session") {
        router.replace("/(auth)/login");
      }
    } finally {
      setTrying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desbloquear con biometría</Text>
      <Text style={styles.subtitle}>Usa tu huella o FaceID para continuar.</Text>

      <Pressable
        onPress={tryUnlock}
        disabled={trying}
        style={({ pressed }) => [
          styles.button,
          (pressed || trying) && { opacity: 0.9 },
        ]}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {trying ? "Verificando..." : "Intentar de nuevo"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/(auth)/login")}
        style={{ marginTop: 16 }}
      >
        <Text style={styles.link}>Usar contraseña</Text>
      </Pressable>

      {authError ? <Text style={styles.error}>{authError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 8,
    color: theme.colors.muted,
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
  },
  buttonText: {
    color: theme.colors.primaryText,
    fontWeight: "700",
    fontSize: 16,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  error: {
    marginTop: 12,
    color: "#dc2626",
    textAlign: "center",
  },
});
