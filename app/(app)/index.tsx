import { Link } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

export default function HomeScreen() {
  const { user, logout, isAuthenticating } = useAuth();

  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{user?.name ?? "there"}</Text>
          <Text style={styles.subtitle}>
            Welcome to Turno Enlace. Explore your appointments and manage your
            profile with ease.
          </Text>

          <Link href="/(app)/profile" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>View Profile</Text>
            </Pressable>
          </Link>

          <Pressable
            onPress={logout}
            disabled={isAuthenticating}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.85 },
              isAuthenticating && styles.disabled,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {isAuthenticating ? "Signing out..." : "Sign Out"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: theme.space.xl,
    paddingBottom: theme.space.xl * 2,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.space.xl,
    shadowColor: theme.colors.shadowColor,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  greeting: {
    fontSize: 18,
    color: theme.colors.muted,
    marginBottom: theme.space.xs,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.space.sm,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.muted,
    marginBottom: theme.space.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center",
    marginBottom: theme.space.md,
  },
  primaryButtonText: {
    color: theme.colors.primaryText,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});
