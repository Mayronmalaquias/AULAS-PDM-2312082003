import { useContext } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import SummaryItem from "../../components/SummaryItem";
import { MoneyContext } from "../../contexts/GlobalState";
import { colors } from "../../constants/colors";
import { globalStyles } from "../../styles/globalStyles";

export default function Summary() {
  const { transactions, categories, loading, error } = useContext(MoneyContext);

  if (loading) {
    return (
      <View style={[globalStyles.screenContainer, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.screenContainer, styles.centered]}>
        <Text style={globalStyles.secondaryText}>{error}</Text>
      </View>
    );
  }

  const totals = categories.map((cat) => {
    const total = transactions
      .filter((tx) => tx.categoryId === cat.id)
      .reduce((sum, tx) => sum + Number(tx.value), 0);
    return { category: cat, total };
  });

  const balance = categories.reduce((acc, cat) => {
    const total = transactions
      .filter((tx) => tx.categoryId === cat.id)
      .reduce((sum, tx) => sum + Number(tx.value), 0);
    return cat.isIncome ? acc + total : acc - total;
  }, 0);

  const balanceStyle = balance >= 0 ? styles.positiveBalance : styles.negativeBalance;

  return (
    <View style={globalStyles.screenContainer}>
      <View style={styles.balanceContainer}>
        <Text style={globalStyles.secondaryText}>Saldo Total</Text>
        <Text style={[styles.balanceValue, balanceStyle]}>
          {balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </Text>
      </View>
      <FlatList
        data={totals}
        keyExtractor={(item) => item.category.id}
        renderItem={({ item }) => (
          <SummaryItem category={item.category} total={item.total} />
        )}
        ListEmptyComponent={
          <Text style={globalStyles.secondaryText}>
            Nenhuma categoria encontrada.
          </Text>
        }
        style={globalStyles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  balanceContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondaryText + "33",
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  positiveBalance: {
    color: colors.positiveText,
  },
  negativeBalance: {
    color: colors.negativeText,
  },
});
