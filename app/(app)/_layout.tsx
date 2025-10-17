import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="privacy-settings"
        options={{
          title: "Configuración de Privacidad",
          headerBackTitle: "Atrás",
        }}
      />
    </Stack>
  );
}
