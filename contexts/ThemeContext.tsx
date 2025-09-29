import { palette, ThemeMode, tokens } from "@/constants/theme";
import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = ReturnType<typeof buildTheme>;

function buildTheme(mode: ThemeMode) {
  const c = palette[mode];
  return {
    mode,
    colors: c,
    tokens,

    pressableOpacity: 0.9,
  };
}

const ThemeCtx = createContext<{
  theme: Theme;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
}>({} as any);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sys = useColorScheme(); // "light" | "dark" | null
  const initial = (sys ?? "light") as ThemeMode;
  const [mode, setMode] = useState<ThemeMode>(initial);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeCtx.Provider
      value={{
        theme,
        setMode,
        toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => useContext(ThemeCtx);
