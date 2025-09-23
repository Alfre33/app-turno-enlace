import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }} initialRouteName="login">
      <Stack.Screen name="login" options={{ title: "Iniciar sesión" }} />
      <Stack.Screen name="register" options={{ title: "Crear cuenta" }} />
    </Stack>
  );
}
