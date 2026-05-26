import { useContext, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SummaryItem from "../../components/SummaryItem";
import MonthYearFilter from "../../components/MonthYearFilter";
import PieChartView from "../../components/PieChartView";
import { MoneyContext } from "../../contexts/GlobalState";
import { colors } from "../../constants/colors";
import { globalStyles } from "../../styles/globalStyles";

export default function Summary() {
  const { transactions, categories, loading, error } = useContext(MoneyContext);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

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

  const filtered = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totals = categories.map((cat) => {
    const total = filtered
      .filter((tx) => tx.categoryId === cat.id)
      .reduce((sum, tx) => sum + Number(tx.value), 0);
    return { category: cat, total };
  });

  const balance = totals.reduce(
    (acc, { category, total }) =>
      category.isIncome ? acc + total : acc - total,
    0
  );

  const balanceStyle = balance >= 0 ? styles.positiveBalance : styles.negativeBalance;

  const totalIncome = totals
    .filter((t) => t.category.isIncome)
    .reduce((s, t) => s + t.total, 0);

  const totalExpenses = totals
    .filter((t) => !t.category.isIncome)
    .reduce((s, t) => s + t.total, 0);

  const pieData = totals
    .filter((t) => t.total > 0)
    .map((t) => ({
      label: t.category.displayName,
      value: t.total,
      color: t.category.background,
    }));

  return (
    <View style={globalStyles.screenContainer}>
      <MonthYearFilter
        month={month}
        year={year}
        onChange={(m, y) => { setMonth(m); setYear(y); }}
      />

      <ScrollView style={globalStyles.content}>
        {/* Balance card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo do Mês</Text>
          <Text style={[styles.balanceValue, balanceStyle]}>
            {balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </Text>
          <View style={styles.incomeExpenseRow}>
            <View style={styles.incomeExpenseItem}>
              <Text style={styles.incomeExpenseLabel}>Receitas</Text>
              <Text style={[styles.incomeExpenseValue, { color: colors.positiveText }]}>
                {totalIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.incomeExpenseItem}>
              <Text style={styles.incomeExpenseLabel}>Despesas</Text>
              <Text style={[styles.incomeExpenseValue, { color: colors.negativeText }]}>
                {totalExpenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </Text>
            </View>
          </View>
        </View>

        {/* Pie chart */}
        {pieData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Distribuição por Categoria</Text>
            <PieChartView data={pieData} />
          </View>
        )}

        {/* Category list */}
        <Text style={styles.sectionTitle}>Detalhes por Categoria</Text>
        {totals
          .filter((t) => t.total > 0)
          .map(({ category, total }) => (
            <SummaryItem key={category.id} category={category} total={total} />
          ))}

        {filtered.length === 0 && (
          <Text style={[globalStyles.secondaryText, { textAlign: "center", marginTop: 24 }]}>
            Nenhuma transação neste mês.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 4,
    fontWeight: "500",
  },
  balanceValue: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
  },
  positiveBalance: {
    color: colors.positiveText,
  },
  negativeBalance: {
    color: colors.negativeText,
  },
  incomeExpenseRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    gap: 16,
  },
  incomeExpenseItem: {
    flex: 1,
  },
  incomeExpenseLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  incomeExpenseValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    width: 1,
    backgroundColor: "#f0f0f0",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryText,
    marginBottom: 12,
  },
});
