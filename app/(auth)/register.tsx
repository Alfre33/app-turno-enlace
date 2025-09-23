import {
    registerFormValues,
    registerSchema,
} from "@/constants/schemas/register";
import { theme } from "@/constants/theme";
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
import ControlledInput from "../../components/ui/Input";

export default function RegisterScreen() {
  const { control, handleSubmit, setValue, watch } =
    useForm<registerFormValues>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        accept: false,
      },
    });

  const accept = watch("accept");

  const onSubmit = (data: registerFormValues) => {
    // TODO: conecta con tu API/Firebase
    console.log("register:", data);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Card>
          <Text style={styles.brand}>Salud Ahora</Text>
          <Text style={styles.title}>Crea tu cuenta</Text>

          <ControlledInput
            control={control}
            name="firstName"
            label="Nombre"
            placeholder="Nombre"
          />
          <ControlledInput
            control={control}
            name="lastName"
            label="Apellido"
            placeholder="Apellido"
          />
          <ControlledInput
            control={control}
            name="email"
            label="Correo electrónico"
            placeholder="tucorreo@ejemplo.com"
            keyboardType="email-address"
          />
          <ControlledInput
            control={control}
            name="phone"
            label="Teléfono (MX)"
            placeholder="5512345678"
            keyboardType="phone-pad"
          />
          <ControlledInput
            control={control}
            name="password"
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
          />
          <ControlledInput
            control={control}
            name="confirmPassword"
            label="Confirmar contraseña"
            placeholder="••••••••"
            secureTextEntry
          />

          <View style={{ marginBottom: theme.space.lg }}>
            <CheckboxField
              value={accept}
              onChange={(v) => setValue("accept", v, { shouldValidate: true })}
              label={
                <Text>
                  Acepto los <Text style={styles.link}>Términos</Text> y la{" "}
                  <Text style={styles.link}>Política de Privacidad</Text>
                </Text>
              }
            />
          </View>

          <Button
            title="Registrarse"
            onPress={handleSubmit(onSubmit)}
            disabled={!accept}
          />

          <View style={styles.footerRow}>
            <Text style={{ color: theme.colors.muted }}>
              ¿Ya tienes cuenta?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.link}>Inicia sesión</Text>
              </Pressable>
            </Link>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, padding: theme.space.xl },
  brand: {
    textAlign: "center",
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.space.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: theme.space.lg,
    color: theme.colors.text,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.space.lg,
  },
});
