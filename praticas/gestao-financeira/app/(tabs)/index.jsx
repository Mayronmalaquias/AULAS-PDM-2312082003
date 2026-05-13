import { useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TransactionItem from "../../components/TransactionItem";
import { MoneyContext } from "../../contexts/GlobalState";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

export default function Transactions() {
  const { transactions, loading, error, refresh, removeTransaction } =
    useContext(MoneyContext);

  const handleLongPress = (item) => {
    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${item.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => removeTransaction(item.id),
        },
      ]
    );
  };

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
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={1}>
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={globalStyles.secondaryText}>
            Ainda não há nenhuma transação!
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
    </View>
  );
}
