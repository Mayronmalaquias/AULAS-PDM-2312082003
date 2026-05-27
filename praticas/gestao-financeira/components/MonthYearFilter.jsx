import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function MonthYearFilter({ month, year, onChange }) {
  const goBack = () => {
    if (month === 0) onChange(11, year - 1);
    else onChange(month - 1, year);
  };

  const goForward = () => {
    if (month === 11) onChange(0, year + 1);
    else onChange(month + 1, year);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.btn} hitSlop={8}>
        <MaterialIcons name="chevron-left" size={30} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.label}>
        {MONTHS[month]} {year}
      </Text>
      <TouchableOpacity onPress={goForward} style={styles.btn} hitSlop={8}>
        <MaterialIcons name="chevron-right" size={30} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primaryText,
    flex: 1,
    textAlign: "center",
  },
  btn: {
    padding: 4,
  },
});
