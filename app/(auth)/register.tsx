import { zodResolver } from "@hookform/resolvers/zod";
import ExpoCheckbox from "expo-checkbox";
import { Link } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  RegisterFormValues,
  registerSchema,
} from "@/constants/schemas/register";
import { tokens } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

import { HeaderHero } from "@/components/common/HeaderHero";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onBlur",
  });

  const { theme: t } = useTheme();
  const {
    register: registerUser,
    isAuthenticating,
    authError,
    clearError,
  } = useAuth();

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = useCallback(
    async (values: RegisterFormValues) => {
      try {
        console.log("Login with", values);

      } catch {}
    },
    [registerUser]
  );

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
        >
          <HeaderHero
            source={require("@/assets/images/logo-turno-enlace.png")}
          />
          <View style={styles.header}>
            <Text style={[styles.title, { color: t.colors.text }]}>
              Crea tu cuenta
            </Text>
          </View>

          {authError ? (
            <View
              style={[
                styles.errorBanner,
                {
                  borderColor: t.colors.danger,
                  backgroundColor: t.colors.danger,
                },
              ]}
            >
              <Text style={[styles.errorText, { color: t.colors.danger }]}>
                {authError}
              </Text>
            </View>
          ) : null}

          <View style={[styles.card, { backgroundColor: t.colors.bg }]}>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nombre completo"
                  placeholder="Juan Pérez"
                  value={value}
                  onChangeText={onChange}
                  error={errors.fullName?.message}
                />
              )}
            />

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
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Contraseña"
                  placeholder="Crea una contraseña"
                  secureTextEntry={!showPass}
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirmar contraseña"
                  placeholder="Repite la contraseña"
                  secureTextEntry={!showConfirm}
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="acceptTerms"
              render={({ field: { value, onChange } }) => (
                <>
                  <Pressable
                    style={styles.termsRow}
                    onPress={() => onChange(!value)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: value }}
                  >
                    <ExpoCheckbox
                      value={value}
                      color={value ? t.colors.primary : undefined}
                    />
                    <Text style={{ color: t.colors.text, marginLeft: 8 }}>
                      Acepto los{" "}
                      <Text
                        style={{ color: t.colors.primary, fontWeight: "600" }}
                      >
                        Términos
                      </Text>{" "}
                      y la{" "}
                      <Text
                        style={{ color: t.colors.primary, fontWeight: "600" }}
                      >
                        Política de Privacidad
                      </Text>
                    </Text>
                  </Pressable>
                  {errors.acceptTerms?.message ? (
                    <Text style={{ color: t.colors.danger, fontSize: 12 }}>
                      {errors.acceptTerms.message}
                    </Text>
                  ) : null}
                </>
              )}
            />

            <Button fullWidth onPress={handleSubmit(onSubmit)}>
              {isAuthenticating ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </View>

          <View style={styles.footer}>
            <Text style={{ color: t.colors.textMuted }}>
              ¿Ya tienes cuenta?
            </Text>
            <Link
              href="/login"
              style={{
                color: t.colors.primary,
                fontWeight: "600",
                marginLeft: 6,
              }}
            >
              Inicia sesión
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: tokens.spacing.xl},
  header: { marginVertical: tokens.spacing.md },
  title: { fontSize: 22, fontWeight: "700" },
  card: {
    paddingHorizontal: tokens.spacing.sm,
    gap: tokens.spacing.md,
    height: "65%",
    justifyContent: "flex-start",
  },
  termsRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: tokens.spacing.xl,
  },
  errorBanner: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    marginBottom: tokens.spacing.md,
  },
  errorText: { fontWeight: "600" },
});
