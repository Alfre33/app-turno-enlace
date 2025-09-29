import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoginFormValues, loginSchema } from "@/constants/schemas/login";
import { tokens } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

import { HeaderHero } from "@/components/common/HeaderHero";
import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; // <- quitamos para evitar problemas de ref

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const { theme: t } = useTheme();
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { login, isAuthenticating, authError, clearError, refresh } = useAuth();

  const onSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        await login(values); 
      } catch {
        
      }
    },
    [login]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    clearError();
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [clearError, refresh]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <HeaderHero source={require("@/assets/images/logo-turno-enlace.png")} />

          {/* Error banner */}
          {authError ? (
            <Pressable
              style={[
                styles.errorBanner,
                {
                  borderColor: t.colors.danger,
                  backgroundColor: t.colors.danger + "22",
                },
              ]}
              onPress={clearError}
            >
              <Text style={[styles.errorText, { color: t.colors.danger }]}>
                {authError}
              </Text>
              <Text style={[styles.errorHint, { color: t.colors.danger }]}>
                Toca para cerrar
              </Text>
            </Pressable>
          ) : null}

          {/* Card */}
          <View style={[styles.card, { backgroundColor: t.colors.bg }]}>
            <View style={{ gap: 16 }}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: t.colors.text }]}>
                  Iniciar sesión
                </Text>
              </View>

              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View style={{ gap: 6 }}>
                    <Text style={{ color: t.colors.text }}>Correo electrónico</Text>
                    <TextInput
                      ref={emailRef}
                      placeholder="tucorreo@dominio.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      value={value}
                      onChangeText={(v) => {
                        if (authError) clearError();
                        onChange(v);
                      }}
                      style={[
                        styles.input,
                        {
                          borderColor: errors.email ? t.colors.danger : "#ccc",
                          color: t.colors.text,
                        },
                      ]}
                    />
                    {!!errors.email?.message && (
                      <Text style={{ color: t.colors.danger }}>
                        {errors.email.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View style={{ gap: 6 }}>
                    <Text style={{ color: t.colors.text }}>Contraseña</Text>
                    <TextInput
                      ref={passwordRef}
                      placeholder="••••••••"
                      secureTextEntry={secureTextEntry}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                      value={value}
                      onChangeText={(v) => {
                        if (authError) clearError();
                        onChange(v);
                      }}
                      style={[
                        styles.input,
                        {
                          borderColor: errors.password ? t.colors.danger : "#ccc",
                          color: t.colors.text,
                        },
                      ]}
                    />
                    <Pressable
                      onPress={() => setSecureTextEntry((s) => !s)}
                      style={{ alignSelf: "flex-end", paddingVertical: 4 }}
                    >
                      <Text style={{ color: t.colors.text, opacity: 0.8 }}>
                        {secureTextEntry ? "Mostrar" : "Ocultar"} contraseña
                      </Text>
                    </Pressable>
                    {!!errors.password?.message && (
                      <Text style={{ color: t.colors.danger }}>
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Submit */}
              <Button
                fullWidth
                disabled={isAuthenticating || isSubmitting}
                onPress={handleSubmit(onSubmit)}
              >
                {isAuthenticating || isSubmitting ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: t.colors.text }]} />
              <Text style={[styles.subTitle, { color: t.colors.text }]}>O</Text>
              <View style={[styles.divider, { backgroundColor: t.colors.text }]} />
            </View>

            <View style={{ gap: 16 }}>
              {/* Google */}
              <Button
                fullWidth
                variant="outline"
                rounded="sm"
                left={<Text>🟦</Text>}
                onPress={() => {
                  /* TODO: login con Google */
                }}
              >
                Continuar con Google
              </Button>

              {/* Crear cuenta */}
              <Button
                fullWidth
                variant="tonal"
                rounded="sm"
                onPress={() => router.push("/(auth)/register")}
              >
                Crear cuenta
              </Button>
            </View>
          </View>
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
    justifyContent: "flex-start",
    gap: tokens.spacing.md,
  },
  header: { alignItems: "flex-start" },
  title: { fontSize: 22, fontWeight: "700" },
  subTitle: { fontSize: 16, fontWeight: "400" },
  card: {
    paddingHorizontal: tokens.spacing.sm,
    gap: tokens.spacing.sm,
    minHeight: "60%",
    justifyContent: "space-around",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: tokens.spacing.sm,
  },
  divider: {
    width: "45%",
    height: 2,
    borderRadius: 2,
    marginVertical: 8,
  },
  errorBanner: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    gap: 4,
  },
  errorText: { fontWeight: "600" },
  errorHint: { opacity: 0.8, fontSize: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
});
