import { useTheme } from "@/contexts/ThemeContext";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const HeaderHero: React.FC<{
  source: any;
  title?: string;
  bg?: string;
}> = ({ source, bg, title = "Turno Enlace" }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: bg ? bg : theme.colors.bg }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Image
        source={source} // require('@/assets/hero.png') o { uri: 'https://...' }
        style={styles.image}
        contentFit="cover" // cover | contain | fill
        accessible
        accessibilityLabel="Ilustración de salud y reservas"
        priority="high"
      />

      {/* Texto bajo la imagen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  image: {
    width: "80%", // ocupa todo el ancho disponible del contenedor
    aspectRatio: 1 / 1, // mantiene proporción (ajusta a tu imagen)
    borderRadius: 14,
    overflow: "hidden",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
