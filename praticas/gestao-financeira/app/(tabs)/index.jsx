import { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TransactionItem from "../../components/TransactionItem";
import MonthYearFilter from "../../components/MonthYearFilter";
import EditTransactionModal from "../../components/EditTransactionModal";
import { MoneyContext } from "../../contexts/GlobalState";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

export default function Transactions() {
  const { transactions, loading, error, refresh } = useContext(MoneyContext);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [editingTx, setEditingTx] = useState(null);

  const filtered = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  if (loading) {
    return (
      <View style={[globalStyles.screenContainer, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.screenContainer, { alignItems: "center", justifyContent: "center", gap: 12 }]}>
        <Text style={globalStyles.secondaryText}>{error}</Text>
        <Text
          style={[globalStyles.primaryText, { color: colors.primary }]}
          onPress={refresh}
        >
          Tentar novamente
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <MonthYearFilter
        month={month}
        year={year}
        onChange={(m, y) => { setMonth(m); setYear(y); }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => setEditingTx(item)}
            activeOpacity={1}
            delayLongPress={400}
          >
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[globalStyles.secondaryText, { textAlign: "center", marginTop: 40 }]}>
            Nenhuma transação neste mês.{"\n"}Pressione + para adicionar.
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[colors.primary]}
          />
        }
        style={globalStyles.content}
      />

      <EditTransactionModal
        transaction={editingTx}
        visible={!!editingTx}
        onClose={() => setEditingTx(null)}
      />
    </View>
  );
}
