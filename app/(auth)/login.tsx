import { loginFormValues, loginSchema } from "@/constants/schemas/login";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import CheckboxField from "../../components/ui/CheckboxField";
import Divider from "../../components/ui/Divider";
import ControlledInput from "../../components/ui/Input";

export default function LoginScreen() {
  const { control, handleSubmit, setValue, watch } = useForm<loginFormValues>({
    defaultValues: { email: "", password: "", remember: false },
    resolver: zodResolver(loginSchema),
  });

  const remember = watch("remember");

  const onSubmit = (data: loginFormValues) => {
    // TODO: conecta con tu API/Firebase
    console.log("login:", data);
    // router.replace("/(tabs)/home"); // ejemplo
  };

  const onGoogle = () => {
    // TODO: integra expo-auth-session (placeholder)
    console.log("Google Sign-In");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card>
          <Text style={styles.brand}>Salud Ahora</Text>
          <Text style={styles.title}>Iniciar sesión</Text>

          <ControlledInput
            control={control}
            name="email"
            label="Correo electrónico"
            placeholder="tucorreo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ControlledInput
            control={control}
            name="password"
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
          />

          <View style={styles.rowBetween}>
            <CheckboxField
              value={remember}
              onChange={(v) => setValue("remember", v)}
              label="Recordarme"
            />
            <Pressable onPress={() => console.log("Forgot password")}>
              <Text style={styles.linkMuted}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </View>

          <Button title="Iniciar sesión" onPress={handleSubmit(onSubmit)} />

          <Divider text="O" />

          <Pressable style={styles.googleBtn} onPress={onGoogle}>
            <Ionicons name="logo-google" size={18} color="#111827" />
            <Text style={styles.googleText}>Continuar con Google</Text>
          </Pressable>

          <Link href="/(auth)/register" asChild>
            <Pressable style={{ marginTop: theme.space.md }}>
              <Button title="Crear cuenta" variant="outline" />
            </Pressable>
          </Link>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flexGrow: 1,
    padding: theme.space.xl,
    justifyContent: "center",
  },
  brand: {
    textAlign: "center",
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.space.sm,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: theme.space.lg,
    color: theme.colors.text,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.space.lg,
  },
  linkMuted: { color: theme.colors.muted, textDecorationLine: "underline" },
  googleBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  googleText: { fontWeight: "600", color: "#111827" },
});
