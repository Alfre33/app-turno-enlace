import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  initialRouteName: "(auth)/welcome",
};

// --- Aplica tema + define todas las screens en un SOLO Stack ---
function ThemedStack() {
  const { theme } = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.card },
          headerTitleStyle: { color: theme.colors.text },
          headerTintColor: theme.colors.text,
          contentStyle: { backgroundColor: theme.colors.bg },
        }}
      >
        {/* Grupos: sin header, cada screen decide si muestra header */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />

        {/* Extras */}
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
      </Stack>

      {/* StatusBar único controlado por el tema */}
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
    </>
  );
}

// --- Redirecciones según auth + splash ---
function RouterGuard() {
  const { user, isInitializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isInitializing) return;

    const inAuthGroup = segments.length > 0 && segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    } else if (user && inAuthGroup) {
      router.replace("/(app)");
    }
  }, [isInitializing, segments, user]);

  useEffect(() => {
    if (!isInitializing) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isInitializing]);

  if (isInitializing) return null; // aquí puedes poner un loader si quieres

  return <ThemedStack />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterGuard />
      </ThemeProvider>
    </AuthProvider>
  );
}
