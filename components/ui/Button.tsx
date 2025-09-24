import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  ActivityIndicator,
  DimensionValue,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Variant = "solid" | "outline" | "tonal" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  rounded?: "sm" | "md" | "lg" | "pill";
}

export const Button: React.FC<Props> = ({
  children,
  onPress,
  variant = "solid",
  size = "md",
  disabled,
  loading,
  fullWidth,
  left,
  right,
  rounded = "lg",
}) => {
  const { theme } = useTheme();

  const height = size === "sm" ? 40 : size === "lg" ? 54 : 48;
  const radius =
    rounded === "pill"
      ? theme.tokens.radius.pill
      : rounded === "md"
      ? theme.tokens.radius.md
      : rounded === "lg"
      ? theme.tokens.radius.lg
      : theme.tokens.radius.sm;

  // ---- estilos por variante (coinciden con el mockup) ----
  const computeByVariant = (): {
    container: ViewStyle;
    textColor: string;
    spinnerColor: string;
    ripple: string | undefined;
  } => {
    const common = {
      borderRadius: radius,
      height,
      paddingHorizontal: theme.tokens.spacing.lg,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: 8,
      width: fullWidth ? ("100%" as DimensionValue) : undefined,
    };

    if (variant === "solid") {
      const bg = disabled ? theme.colors.primaryMuted : theme.colors.primary;
      const txt = disabled ? theme.colors.text : theme.colors.primaryOn;
      return {
        container: {
          ...common,
          backgroundColor: bg,
          ...(disabled ? {} : theme.tokens.shadow.lg),
          borderWidth: 0,
        },
        textColor: txt,
        spinnerColor: txt,
        ripple: theme.colors.primaryMuted,
      };
    }

    if (variant === "outline") {
      const txt = disabled ? theme.colors.textMuted : theme.colors.text;
      return {
        container: {
          ...common,
          backgroundColor: theme.colors.card, // blanco en light, gris oscuro en dark
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: disabled ? theme.colors.border : theme.colors.border,
          ...(disabled ? {} : theme.tokens.shadow.lg),
        },
        textColor: txt,
        spinnerColor: txt,
        ripple: theme.colors.primaryMuted,
      };
    }

    if (variant === "tonal") {
      // Fondo azul clarito + texto azul (como “Crear cuenta”)
      const bg = theme.colors.primaryMuted;
      const txt = disabled ? theme.colors.textMuted : theme.colors.primary;
      return {
        container: {
          ...common,
          backgroundColor: bg,
          borderWidth: 0,
          ...(disabled ? {} : theme.tokens.shadow.lg),
        },
        textColor: txt,
        spinnerColor: txt,
        ripple: theme.colors.primaryMuted,
      };
    }

    // ghost: sin fondo, sin borde
    const ghostTxt = disabled ? theme.colors.textMuted : theme.colors.text;
    return {
      container: {
        ...common,
        backgroundColor: "transparent",
        borderWidth: 0,
      },
      textColor: ghostTxt,
      spinnerColor: ghostTxt,
      ripple: undefined,
    };
  };

  const { container, textColor, spinnerColor, ripple } = computeByVariant();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        container,
        { opacity: pressed ? theme.pressableOpacity : 1 },
      ]}
      android_ripple={ripple ? { color: ripple } : undefined}
      hitSlop={8}
    >
      {left}
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <Text style={{ color: textColor, fontSize: 16, fontWeight: "600" }}>
          {children}
        </Text>
      )}
      {right}
    </Pressable>
  );
};
