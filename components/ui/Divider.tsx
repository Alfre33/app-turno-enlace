import { theme } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
export default function Divider({ text = "O" }: { text?: string }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.space.md,
  },
  line: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  text: { marginHorizontal: 10, color: theme.colors.muted, fontWeight: "600" },
});
