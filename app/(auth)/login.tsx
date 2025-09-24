import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
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
import { Input } from "@/components/ui/Input";

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
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
        // await login(values);
        console.log("Login with", values);
      } catch {}
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
          <HeaderHero
            source={require("@/assets/images/logo-turno-enlace.png")}
          />

          {/* Error banner */}
          {authError ? (
            <Pressable
              style={[
                styles.errorBanner,
                {
                  borderColor: t.colors.danger,
                  backgroundColor: t.colors.danger,
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
            <View
              style={{
                gap: 16,
              }}
            >
              <View style={styles.header}>
                <Text style={[styles.title, { color: t.colors.text }]}>
                  Iniciar sesión
                </Text>
              </View>
              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Correo electrónico"
                    placeholder="tucorreo@dominio.com"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                    error={errors.email?.message}
                    helperText={undefined}
                  />
                )}
              />

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Contraseña"
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={secureTextEntry}
                    error={errors.password?.message}
                  />
                )}
              />

              {/* Submit */}
              <Button fullWidth onPress={handleSubmit(onSubmit)}>
                {isAuthenticating ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </View>

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
              }}
            >
              <View
                style={{
                  width: "45%",
                  height: 2,
                  borderRadius: 4,
                  backgroundColor: t.colors.text,
                  marginVertical: 8,
                }}
              />
              <Text style={[styles.subTitle, { color: t.colors.text }]}>O</Text>
              <View
                style={{
                  width: "45%",
                  height: 2,
                  borderRadius: 2,
                  backgroundColor: t.colors.text,
                  marginVertical: 8,
                }}
              />
            </View>
            <View
              style={{
                gap: 16,
              }}
            >
              {/* Google */}
              <Button
                fullWidth
                variant="outline"
                rounded="sm"
                left={<Text>🟦</Text>}
                onPress={() => {
                  /* TODO google */
                }}
              >
                Continuar con Google
              </Button>

              {/* Crear cuenta */}
              <Button
                fullWidth
                variant="tonal"
                rounded="sm"
                onPress={() => router.push("/register")}
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
  },
  header: { alignItems: "flex-start" },
  title: { fontSize: 22, fontWeight: "700" },
  subTitle: { fontSize: 16, fontWeight: "400" },
  card: {
    paddingHorizontal: tokens.spacing.sm,
    gap: tokens.spacing.sm,
    height: "65%",
    justifyContent: "space-around",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  errorBanner: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    gap: 4,
  },
  errorText: { fontWeight: "600" },
  errorHint: { opacity: 0.7, fontSize: 12 },
});
