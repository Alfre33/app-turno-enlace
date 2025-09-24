import { useTheme } from "@/contexts/ThemeContext";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
interface Props {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default"|"email-address"|"number-pad"|"phone-pad";
  error?: string;
  helperText?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  disabled?: boolean;
}

export const Input: React.FC<Props> = ({
  label, placeholder, value, onChangeText,
  secureTextEntry, keyboardType="default", error, helperText, left, right, disabled,
}) => {
  const { theme } = useTheme();
  const [focus, setFocus] = useState(false);
  const [hide, setHide] = useState(!!secureTextEntry);

  const borderColor = error
    ? theme.colors.danger
    : focus
    ? theme.colors.primary
    : theme.colors.border;

  return (
    <View style={{ width: "100%" }}>
      {label && (
        <Text style={{ color: theme.colors.text, marginBottom: 6, fontWeight: "600" }}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor,
            borderRadius: theme.tokens.radius.md,
            height: 48,
          },
        ]}
      >
        {left && <View style={{ marginLeft: 10 }}>{left}</View>}

        <TextInput
          style={{
            flex: 1,
            color: theme.colors.text,
            paddingHorizontal: 12,
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          secureTextEntry={hide}
          keyboardType={keyboardType}
          editable={!disabled}
        />

        {secureTextEntry && (
          <Pressable onPress={() => setHide((v) => !v)} style={{ paddingHorizontal: 10 }}>
            <Text style={{ color: theme.colors.textMuted }}>
              {hide ? "Mostrar" : "Ocultar"}
            </Text>
          </Pressable>
        )}

        {right && <View style={{ marginRight: 10 }}>{right}</View>}
      </View>

      {!!error ? (
        <Text style={{ color: theme.colors.danger, marginTop: 6, fontSize: 12 }}>{error}</Text>
      ) : helperText ? (
        <Text style={{ color: theme.colors.textMuted, marginTop: 6, fontSize: 12 }}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
