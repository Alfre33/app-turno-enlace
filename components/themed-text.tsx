import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Text, TextProps, View, ViewProps } from "react-native";
export const ThemedView: React.FC<ViewProps> = ({ style, ...p }) => {
  const { theme } = useTheme();
  return <View style={[{ backgroundColor: theme.colors.bg }, style]} {...p} />;
};

export const ThemedText: React.FC<
  TextProps & {
    muted?: boolean;
    weight?: "regular" | "medium" | "semibold" | "bold";
  }
> = ({ style, muted, weight = "regular", ...p }) => {
  const { theme } = useTheme();
  const fontWeight =
    weight === "bold"
      ? "700"
      : weight === "semibold"
      ? "600"
      : weight === "medium"
      ? "500"
      : "400";
  return (
    <Text
      style={[
        {
          color: muted ? theme.colors.textMuted : theme.colors.text,
          fontSize: 16,
          fontWeight,
        },
        style,
      ]}
      {...p}
    />
  );
};
