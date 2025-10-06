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
import {
    deleteAppointment,
    getAppointments,
    subscribeToAppointments,
} from "@/src/services/appointmentsService";
import { subscribeToCategories } from "@/src/services/categoriesService";
import { Appointment, Category, UnsubscribeFn } from "@/src/types/models";

type CategoryMap = Record<string, Category>;

export default function AppointmentsList() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [items, setItems] = useState<Appointment[]>([]);
  const [cats, setCats] = useState<CategoryMap>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAppointments(
      (rows) => {
        setItems(rows);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub: UnsubscribeFn = subscribeToCategories((rows) => {
      const map = rows.reduce<CategoryMap>(
        (acc, c) => ((acc[c.id] = c), acc),
        {}
      );
      setCats(map);
    });
    return unsub;
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const rows = await getAppointments();
      setItems(rows);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Eliminar", "¿Borrar esta cita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAppointment(id);
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
            <Text style={styles.title}>Citas</Text>
            <Text style={styles.subtitle}>Administra tus próximas citas.</Text>
            <Button onPress={() => router.push("/(app)/appointments/new")}>
              Nueva cita
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push("/(app)/categories")}
            >
              Ver categorías
            </Button>
          </View>
        }
        renderItem={({ item }) => {
          const cat = item.categoryId ? cats[item.categoryId] : undefined;
          return (
            <ListCard
              title={item.title}
              subtitle={item.notes ?? undefined}
              meta={new Date(item.date).toLocaleString()}
              accentColor={cat?.color ?? undefined}
              onPress={() => router.push(`/(app)/appointments/${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          );
        }}
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.subtitle}>Cargando...</Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.title}>Sin citas</Text>
              <Text style={styles.subtitle}>
                Crea tu primera cita con el botón.
              </Text>
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
