import { theme } from "@/constants/theme";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
type ControlledInputProps = {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export default function ControlledInput({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
}: ControlledInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: theme.space.md }}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            style={[styles.input, !!error && styles.inputError]}
            placeholderTextColor={theme.colors.muted}
          />
          {error ? <Text style={styles.error}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    color: theme.colors.text,
    fontWeight: "600",
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    backgroundColor: "#F8FAFC",
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  error: {
    marginTop: 6,
    color: theme.colors.danger,
    fontSize: 12,
  },
});
