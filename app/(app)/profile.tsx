import { useMemo } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}***@${domain}`;
};

export default function ProfileScreen() {
  const { user } = useAuth();

  const maskedEmail = useMemo(() => {
    return user?.email ? maskEmail(user.email) : "";
  }, [user?.email]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>
              {user?.name
                ?.split(" ")
                .map((part) => part[0]?.toUpperCase())
                .slice(0, 2)
                .join("") || "TN"}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{maskedEmail}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member since</Text>
            <Text style={styles.infoValue}>
              {user?.createdAt
                ? new Intl.DateTimeFormat("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(user.createdAt))
                : "Just now"}
            </Text>
          </View>
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
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.space.xl,
    alignItems: "center",
    shadowColor: theme.colors.shadowColor,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.space.md,
  },
  avatarInitials: {
    color: theme.colors.primaryText,
    fontSize: 32,
    fontWeight: "700",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.space.xs,
  },
  email: {
    fontSize: 16,
    color: theme.colors.muted,
    marginBottom: theme.space.lg,
  },
  infoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
});
