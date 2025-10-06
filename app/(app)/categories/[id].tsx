import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import {
    createCategory,
    getCategory,
    updateCategory,
} from "@/src/services/categoriesService";

const colorRegex = /^#([0-9a-fA-F]{6})$/;
const schema = z.object({
  name: z.string().trim().min(1, "Requerido"),
  color: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || colorRegex.test(v), { message: "Usa #RRGGBB" }),
});
type FormValues = z.infer<typeof schema>;

export default function CategoryForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id && id !== "new";
  const router = useRouter();

  const { theme: t } = useTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", color: "" },
  });

  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing || !id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const doc = await getCategory(String(id));
        if (!doc) {
          Alert.alert("No encontrado", "La categoría ya no existe.", [
            { text: "OK", onPress: () => router.back() },
          ]);
          return;
        }
        mounted && reset({ name: doc.name, color: doc.color ?? "" });
      } catch {
        Alert.alert("Error", "No se pudo cargar.");
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, isEditing, reset, router]);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const payload = {
        name: values.name.trim(),
        color: values.color?.trim() || undefined,
      };
      try {
        if (isEditing && id) await updateCategory(String(id), payload);
        else await createCategory(payload);
        router.back();
      } catch {
        Alert.alert("Error", "No se pudo guardar.");
      }
    },
    [id, isEditing, router]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{ title: isEditing ? "Editar categoría" : "Nueva categoría" }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.h1}>
            {isEditing ? "Editar categoría" : "Nueva categoría"}
          </Text>

          {loading ? (
            <View style={styles.row}>
              <ActivityIndicator color={t.colors.primary} />
              <Text style={styles.muted}>Cargando...</Text>
            </View>
          ) : null}

          {/* Nombre */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Vacunas"
                  style={[
                    styles.input,
                    {
                      borderColor: errors.name
                        ? t.colors.danger
                        : t.colors.border,
                      color: t.colors.text,
                    },
                  ]}
                />
                {errors.name?.message && (
                  <Text style={styles.error}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

          {/* Color */}
          <Controller
            control={control}
            name="color"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Color (#RRGGBB)</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  placeholder="#3B82F6"
                  autoCapitalize="characters"
                  style={[
                    styles.input,
                    {
                      borderColor: errors.color
                        ? t.colors.danger
                        : t.colors.border,
                      color: t.colors.text,
                    },
                  ]}
                />
                {value ? (
                  <View style={styles.previewRow}>
                    <View
                      style={[styles.previewSwatch, { backgroundColor: value }]}
                    />
                    <Text style={styles.muted}>Previsualización</Text>
                  </View>
                ) : null}
                {errors.color?.message && (
                  <Text style={styles.error}>{errors.color.message}</Text>
                )}
              </View>
            )}
          />

          <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : isEditing
              ? "Guardar cambios"
              : "Crear categoría"}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (t: ReturnType<typeof useTheme>["theme"]) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.colors.bg },
    content: {
      flexGrow: 1,
      gap: t.tokens.spacing.md,
      padding: t.tokens.spacing.lg,
      paddingBottom: t.tokens.spacing.xl,
    },
    h1: { fontSize: t.tokens.font.xl, fontWeight: "700", color: t.colors.text },
    row: { flexDirection: "row", alignItems: "center", gap: 8 },
    muted: { color: t.colors.textMuted },
    field: { gap: 6 },
    label: { color: t.colors.text, fontWeight: "600" },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      backgroundColor: t.colors.card,
    },
    previewRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 8,
    },
    previewSwatch: {
      width: 32,
      height: 32,
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: t.colors.border,
    },
    error: { color: t.colors.danger },
  });
