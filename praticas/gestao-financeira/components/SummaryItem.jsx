import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

export default function SummaryItem({ category, total }) {
  const totalStyle = category.isIncome
    ? globalStyles.positiveText
    : globalStyles.negativeText;

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.icon, { backgroundColor: category.background }]}>
          <MaterialIcons name={category.icon} size={24} color={colors.primaryContrast} />
        </View>
        <View style={styles.textContainer}>
          <Text style={globalStyles.primaryText}>{category.displayName}</Text>
          <Text style={globalStyles.secondaryText}>
            {category.isDefault ? "padrão" : "personalizada"}
          </Text>
        </View>
        <Text style={totalStyle}>
          {Number(total).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
      <View style={globalStyles.line} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
});
