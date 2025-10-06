import { useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function AppointmentsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Citas" }} />
      <Stack.Screen name="[id]" options={{ title: "Cita" }} />
    </Stack>
  );
}
