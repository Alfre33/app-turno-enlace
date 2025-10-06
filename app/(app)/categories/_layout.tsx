import { useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";

export default function CategoriesLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Categorías" }} />
      <Stack.Screen name="[id]" options={{ title: "Categoría" }} />
    </Stack>
  );
}
