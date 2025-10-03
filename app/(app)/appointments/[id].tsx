import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
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
    createAppointment,
    getAppointment,
    updateAppointment,
} from "@/src/services/appointmentsService";
import { subscribeToCategories } from "@/src/services/categoriesService";
import { Category, UnsubscribeFn } from "@/src/types/models";

const schema = z.object({
  title: z.string().trim().min(1, "Requerido"),
  date: z.date(),
  notes: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().nullable(),
});
type FormValues = z.infer<typeof schema>;

export default function AppointmentForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id && id !== "new";
  const router = useRouter();

  const { theme: t } = useTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", date: new Date(), notes: "", categoryId: null },
  });

  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const unsub: UnsubscribeFn = subscribeToCategories(setCats);
    return unsub;
  }, []);

  useEffect(() => {
    if (!isEditing || !id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const doc = await getAppointment(String(id));
        if (!doc) {
          Alert.alert("No encontrado", "La cita ya no existe.", [
            { text: "OK", onPress: () => router.back() },
          ]);
          return;
        }
        if (!mounted) return;
        reset({
          title: doc.title,
          date: doc.date,
          notes: doc.notes ?? "",
          categoryId: doc.categoryId ?? null,
        });
      } catch {
        Alert.alert("Error", "No se pudo cargar la cita.");
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, isEditing, reset, router]);

  const selectedDate = watch("date");

  const onChangeDate = useCallback(
    (e: DateTimePickerEvent, d?: Date) => {
      if (Platform.OS === "android") setShowPicker(false);
      if (e.type === "dismissed" || !d) return;
      setValue("date", d, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      const payload = {
        title: values.title.trim(),
        date: values.date,
        notes: values.notes?.trim() || undefined,
        categoryId: values.categoryId || undefined,
      };
      try {
        if (isEditing && id) await updateAppointment(String(id), payload);
        else await createAppointment(payload);
        router.back();
      } catch {
        Alert.alert("Error", "No se pudo guardar.");
      }
    },
    [id, isEditing, router]
  );

  return (
    <SafeAreaView style={[styles.safe]}>
      <Stack.Screen
        options={{ title: isEditing ? "Editar cita" : "Nueva cita" }}
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
            {isEditing ? "Editar cita" : "Nueva cita"}
          </Text>

          {loading ? (
            <View style={styles.row}>
              <ActivityIndicator color={t.colors.primary} />
              <Text style={styles.muted}>Cargando...</Text>
            </View>
          ) : null}

          {/* Título */}
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Consulta"
                  style={[
                    styles.input,
                    {
                      borderColor: errors.title
                        ? t.colors.danger
                        : t.colors.border,
                      color: t.colors.text,
                    },
                  ]}
                />
                {errors.title?.message && (
                  <Text style={styles.error}>{errors.title.message}</Text>
                )}
              </View>
            )}
          />

          {/* Fecha */}
          <View style={styles.field}>
            <Text style={styles.label}>Fecha y hora</Text>
            <Text
              style={styles.selector}
              onPress={() => setShowPicker((s) => !s)}
            >
              {selectedDate.toLocaleString()}
            </Text>
            {showPicker ? (
              <View style={styles.pickerBox}>
                <DateTimePicker
                  value={selectedDate}
                  mode="datetime"
                  onChange={onChangeDate}
                />
              </View>
            ) : null}
          </View>

          {/* Categoría */}
          <Controller
            control={control}
            name="categoryId"
            render={({ field: { value, onChange } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Categoría (opcional)</Text>
                <View
                  style={[styles.selectorBox, { borderColor: t.colors.border }]}
                >
                  <Picker
                    selectedValue={value ?? ""}
                    onValueChange={(v) => onChange(v === "" ? null : String(v))}
                  >
                    <Picker.Item label="Sin categoría" value="" />
                    {cats.map((c) => (
                      <Picker.Item
                        key={c.id}
                        label={c.name}
                        value={c.id}
                        color={c.color ?? undefined}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          />

          {/* Notas */}
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <View style={styles.field}>
                <Text style={styles.label}>Notas</Text>
                <TextInput
                  value={value ?? ""}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  placeholder="Detalles adicionales"
                  style={[
                    styles.input,
                    {
                      height: 110,
                      textAlignVertical: "top",
                      color: t.colors.text,
                      borderColor: t.colors.border,
                    },
                  ]}
                />
              </View>
            )}
          />

          <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : isEditing
              ? "Guardar cambios"
              : "Crear cita"}
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
    selector: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      backgroundColor: t.colors.card,
      color: t.colors.text,
      borderColor: t.colors.border,
    },
    selectorBox: {
      borderWidth: 1,
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: t.colors.card,
    },
    pickerBox: {
      borderWidth: 1,
      borderRadius: 10,
      overflow: "hidden",
      borderColor: t.colors.border,
      backgroundColor: t.colors.card,
    },
    error: { color: t.colors.danger },
  });
