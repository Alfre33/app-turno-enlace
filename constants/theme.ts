export type ThemeMode = "light" | "dark";

export const tokens = {
  radius: { sm: 8, md: 12, lg: 16, pill: 999 },
  spacing: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 },
  font: { xs: 12, sm: 14, md: 16, lg: 20, xl: 28, xxl: 34 },
  shadow: {
    lg: {
      elevation: 8,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
  },
};

export const palette = {
  light: {
    primary: "#2563EB",       // azul 600
    primaryOn: "#FFFFFF",
    primaryMuted: "#D8E2FF",
    bg: "#F3F6FC",
    card: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    border: "#E2E8F0",
    danger: "#EF4444",
    inputBg: "#FFFFFF",
    inputPlaceholder: "#94A3B8",
  },
  dark: {
    primary: "#3B82F6",       // azul 500 para contraste
    primaryOn: "#0B1220",
    primaryMuted: "#1E3A8A",
    bg: "#0B1220",
    card: "#111827",
    text: "#E5E7EB",
    textMuted: "#94A3B8",
    border: "#1F2937",
    danger: "#F87171",
    inputBg: "#0F172A",
    inputPlaceholder: "#64748B",
  },
};
