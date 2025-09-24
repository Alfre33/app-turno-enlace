import { Link } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Screen not found</Text>
        <Text style={styles.description}>
          The page you are looking for does not exist or may have been moved.
        </Text>

        <Link href="/(auth)/welcome" style={styles.link}>
          Go back to welcome
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.space.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.space.sm,
  },
  description: {
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center",
    marginBottom: theme.space.lg,
  },
  link: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
