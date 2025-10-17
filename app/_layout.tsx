import { Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

export const unstable_settings = {
  initialRouteName: "(auth)/welcome",
};

function ThemedStack() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTitleStyle: { color: theme.colors.text },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
    </Stack>
  );
}

function RouterGuard() {
  const { user, isInitializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [locked, setLocked] = useState<boolean>(false);
  const lastTargetRef = useRef<string | null>(null);

  const safeReplace = (target: string) => {
    if (pathname !== target && lastTargetRef.current !== target) {
      lastTargetRef.current = target;
      router.replace(target);
    }
  };


  useEffect(() => {
    let cancelled = false;
    (async () => {
      const v = await SecureStore.getItemAsync("LOCKED").catch(() => null);
      const next = v === "1";
      if (!cancelled && next !== locked) setLocked(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]); 

  useEffect(() => {
    if (isInitializing) return;

    const inAuth = pathname.startsWith("/(auth)");
    const isLogin = pathname === "/(auth)/login";
    const isRegister = pathname === "/(auth)/register";
    const isWelcome = pathname.startsWith("/(auth)/welcome");
    const isPublicAuth = inAuth && (isLogin || isRegister || isWelcome);
    if (!user) {
      if (!isPublicAuth) safeReplace("/(auth)/login");
      return;
    }

    if (locked) {
      if (!isLogin) safeReplace("/(auth)/login");
      return;
    }
    if (inAuth) {
      safeReplace("/(app)");
      return;
    }

    lastTargetRef.current = null;
  }, [user, locked, isInitializing, pathname]);

  return null; 
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterGuard />
        <ThemedStack />
      </ThemeProvider>
    </AuthProvider>
  );
}
