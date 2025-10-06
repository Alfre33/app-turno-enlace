import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  accentColor?: string;
  rightSlot?: React.ReactNode;
  onPress?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
};

export const ListCard: React.FC<Props> = ({
  title,
  subtitle,
  meta,
  accentColor,
  rightSlot,
  onPress,
  onDelete,
  disabled,
  style,
  testID,
}) => {
  const { theme: t } = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityHint={onPress ? "Abrir detalle" : undefined}
      android_ripple={
        onPress
          ? { color: t.colors.primary + "22", borderless: false }
          : undefined
      }
      onPress={onPress}
      disabled={!onPress || disabled}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: t.colors.card,
          borderColor: t.colors.border,
          borderRadius: t.tokens.radius.lg,
          ...t.tokens.shadow.lg,
        },
        pressed && onPress && Platform.OS !== "android"
          ? { opacity: 0.95 }
          : null,
        disabled ? { opacity: 0.6 } : null,
        style,
      ]}
    >
      <View style={styles.row}>
        {accentColor ? (
          <View
            style={{
              width: 8,
              alignSelf: "stretch",
              borderRadius: t.tokens.radius.sm,
              backgroundColor: accentColor,
              marginRight: t.tokens.spacing.md,
            }}
          />
        ) : null}

        <View style={{ flex: 1, gap: 4 }}>
          <Text
            style={{
              color: t.colors.text,
              fontSize: t.tokens.font.lg,
              fontWeight: "600",
            }}
            numberOfLines={1}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              style={{
                color: t.colors.textMuted,
                fontSize: t.tokens.font.sm,
              }}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          ) : null}

          {meta ? (
            <Text
              style={{
                marginTop: 4,
                color: t.colors.text,
                opacity: 0.8,
                fontSize: t.tokens.font.sm,
                fontWeight: "500",
              }}
              numberOfLines={1}
            >
              {meta}
            </Text>
          ) : null}
        </View>

        {rightSlot}
      </View>

      {onDelete ? (
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Eliminar"
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={({ pressed }) => ({
            marginTop: t.tokens.spacing.sm,
            alignSelf: "flex-start",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: t.tokens.radius.sm,
            backgroundColor: pressed ? t.colors.danger : t.colors.danger + "22",
          })}
        >
          <Text
            style={{
              color: t.colors.danger,
              fontSize: t.tokens.font.sm,
              fontWeight: "600",
            }}
          >
            Eliminar
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
