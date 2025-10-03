import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ListCard } from "@/components/common/ListCard";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { deleteCategory, getCategories, subscribeToCategories } from "@/src/services/categoriesService";
import { Category } from "@/src/types/models";



export default function CategoriesList() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();

  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCategories(
      (rows) => {
        setItems(rows);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const rows = await getCategories();
      setItems(rows);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Eliminar", "¿Borrar esta categoría?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategory(id);
          } catch {
            Alert.alert("Error", "No se pudo eliminar.");
          }
        },
      },
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Categorías</Text>
            <Text style={styles.subtitle}>
              Clasifica tus citas por color y nombre.
            </Text>
            <Button onPress={() => router.push("/(app)/categories/new")}>
              Nueva categoría
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push("/(app)/appointments")}
            >
              Ver citas
            </Button>
          </View>
        }
        renderItem={({ item }) => (
          <ListCard
            title={item.name}
            subtitle={item.color ? `Color: ${item.color}` : undefined}
            accentColor={item.color ?? undefined}
            onPress={() => router.push(`/(app)/categories/${item.id}`)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.subtitle}>Cargando...</Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.title}>Sin categorías</Text>
              <Text style={styles.subtitle}>Crea una para empezar.</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (t: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.colors.bg },
    content: {
      padding: t.tokens.spacing.lg,
      paddingBottom: t.tokens.spacing.xl,
    },
    header: { gap: t.tokens.spacing.sm, marginBottom: t.tokens.spacing.lg },
    title: {
      fontSize: t.tokens.font.xl,
      fontWeight: "700",
      color: t.colors.text,
    },
    subtitle: { color: t.colors.textMuted },
    empty: { alignItems: "center", gap: 8, paddingVertical: 48 },
  });
