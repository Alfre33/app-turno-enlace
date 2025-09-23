import { theme } from "@/constants/theme";
import Checkbox from "expo-checkbox";
import { Pressable, StyleSheet, Text, View } from "react-native";
type Props = {
  value: boolean;
  onChange: (next: boolean) => void;
  label?: string | React.ReactNode;
};

export default function CheckboxField({ value, onChange, label }: Props) {
  return (
    <Pressable onPress={() => onChange(!value)}>
      <View style={styles.row}>
        <Checkbox
          value={value}
          onValueChange={onChange}
          color={value ? theme.colors.primary : undefined}
          style={{ marginRight: 8 }}
        />
        {typeof label === "string" ? (
          <Text style={styles.label}>{label}</Text>
        ) : (
          label
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  label: { color: theme.colors.text },
});
