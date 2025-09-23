import { theme } from "@/constants/theme";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "outline";
};

export default function Button({
  title,
  onPress,
  disabled,
  loading,
  variant = "primary",
}: Props) {
  const isOutline = variant === "outline";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.primary,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && { opacity: 0.9 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? theme.colors.text : "#fff"} />
      ) : (
        <Text style={[styles.text, isOutline && styles.textOutline]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: theme.colors.border,
  },
  disabled: { opacity: 0.6 },
  text: { color: theme.colors.primaryText, fontWeight: "600", fontSize: 16 },
  textOutline: { color: theme.colors.text },
});
