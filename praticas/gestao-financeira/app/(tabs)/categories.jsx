import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../../components/Button";
import { MoneyContext } from "../../contexts/GlobalState";
import { colors } from "../../constants/colors";
import { globalStyles } from "../../styles/globalStyles";

const SUGGESTED_COLORS = [
  "#DE9AC3", "#DEA17B", "#E6E088", "#AB8FBE", "#82C9DE",
  "#FFB6B6", "#98D8C8", "#C8A2C8", "#FFD700", "#87CEEB",
];

const initialForm = {
  name: "",
  displayName: "",
  icon: "star",
  background: SUGGESTED_COLORS[0],
  isIncome: false,
};

export default function Categories() {
  const { categories, loading, error, addCategory, removeCategory } =
    useContext(MoneyContext);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.displayName.trim()) {
      Alert.alert("Atenção", "Preencha o nome e o rótulo da categoria.");
      return;
    }
    setSaving(true);
    try {
      await addCategory(form);
      setForm(initialForm);
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível criar a categoria.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (cat) => {
    Alert.alert(
      "Excluir categoria",
      `Deseja excluir "${cat.displayName}"? Isso não será possível se houver transações associadas.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeCategory(cat.id);
            } catch (e) {
              Alert.alert("Erro", e.message ?? "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView style={globalStyles.content}>
        <Text style={[globalStyles.primaryText, styles.sectionTitle]}>
          Nova Categoria
        </Text>

        <View style={styles.form}>
          <View>
            <Text style={globalStyles.inputLabel}>Nome técnico (sem espaços)</Text>
            <TextInput
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t.toLowerCase().replace(/\s/g, "_") })}
              placeholder="ex: health"
              style={globalStyles.input}
            />
          </View>
          <View>
            <Text style={globalStyles.inputLabel}>Rótulo exibido</Text>
            <TextInput
              value={form.displayName}
              onChangeText={(t) => setForm({ ...form, displayName: t })}
              placeholder="ex: Saúde"
              style={globalStyles.input}
            />
          </View>
          <View>
            <Text style={globalStyles.inputLabel}>Ícone (Material Icons)</Text>
            <TextInput
              value={form.icon}
              onChangeText={(t) => setForm({ ...form, icon: t })}
              placeholder="ex: favorite"
              style={globalStyles.input}
            />
          </View>
          <View>
            <Text style={globalStyles.inputLabel}>Cor de fundo</Text>
            <View style={styles.colorPalette}>
              {SUGGESTED_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setForm({ ...form, background: c })}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c },
                    form.background === c && styles.colorSwatchSelected,
                  ]}
                />
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={styles.incomeToggle}
            onPress={() => setForm({ ...form, isIncome: !form.isIncome })}
          >
            <MaterialIcons
              name={form.isIncome ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={colors.primary}
            />
            <Text style={globalStyles.primaryText}>É uma categoria de renda?</Text>
          </TouchableOpacity>
          <Button onPress={handleCreate} disabled={saving}>
            {saving ? "Criando..." : "Criar Categoria"}
          </Button>
        </View>

        <Text style={[globalStyles.primaryText, styles.sectionTitle]}>
          Categorias ({categories.length})
        </Text>

        {loading && <ActivityIndicator color={colors.primary} />}
        {error && <Text style={globalStyles.secondaryText}>{error}</Text>}

        {categories.map((cat) => (
          <View key={cat.id}>
            <View style={styles.categoryRow}>
              <View
                style={[styles.categoryIcon, { backgroundColor: cat.background }]}
              >
                <MaterialIcons name={cat.icon} size={20} color={colors.primaryContrast} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={globalStyles.primaryText}>{cat.displayName}</Text>
                <Text style={globalStyles.secondaryText}>
                  {cat.isDefault ? "padrão" : "personalizada"}
                  {cat.isIncome ? " · receita" : ""}
                </Text>
              </View>
              {!cat.isDefault && (
                <TouchableOpacity onPress={() => handleDelete(cat)}>
                  <MaterialIcons name="delete" size={22} color={colors.negativeText} />
                </TouchableOpacity>
              )}
            </View>
            <View style={globalStyles.line} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 12,
  },
  form: {
    gap: 12,
    marginBottom: 24,
  },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: colors.primaryText,
  },
  incomeToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryInfo: {
    flex: 1,
  },
});
