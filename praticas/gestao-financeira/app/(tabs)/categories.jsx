import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  "#F4A261", "#E76F51", "#2A9D8F", "#264653", "#E9C46A",
  "#A8DADC", "#457B9D", "#E63946", "#606C38", "#DDA15E",
];

const ICON_OPTIONS = [
  "restaurant", "local_cafe", "local_bar", "fastfood",
  "directions_car", "flight", "train", "two_wheeler",
  "home", "bed", "bathroom", "roofing",
  "local_hospital", "fitness_center", "spa", "favorite",
  "school", "menu_book", "science", "computer",
  "shopping_cart", "shopping_bag", "storefront", "redeem",
  "sports_esports", "movie", "music_note", "sports_soccer",
  "work", "business", "account_balance", "savings",
  "attach_money", "trending_up", "credit_card", "payment",
  "pets", "child_care", "volunteer_activism", "build",
  "wifi", "phone_android", "electrical_services", "local_gas_station",
];

function toSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

const initialForm = {
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
    if (!form.displayName.trim()) {
      Alert.alert("Atenção", "Digite o nome da categoria.");
      return;
    }
    const slug = toSlug(form.displayName);
    if (!slug) {
      Alert.alert("Atenção", "O nome deve conter ao menos uma letra ou número.");
      return;
    }
    setSaving(true);
    try {
      await addCategory({ ...form, name: slug });
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
      <ScrollView style={globalStyles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Nova Categoria</Text>

        {/* Live preview */}
        <View style={styles.previewCard}>
          <View style={[styles.previewBadge, { backgroundColor: form.background }]}>
            <MaterialIcons name={form.icon} size={28} color="#fff" />
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewName} numberOfLines={1}>
              {form.displayName || "Nome da categoria"}
            </Text>
            <Text style={styles.previewType}>
              {form.isIncome ? "Receita" : "Despesa"}
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Name */}
          <View>
            <Text style={globalStyles.inputLabel}>Nome</Text>
            <TextInput
              value={form.displayName}
              onChangeText={(t) => setForm({ ...form, displayName: t })}
              placeholder="ex: Alimentação, Salário…"
              style={globalStyles.input}
              maxLength={40}
            />
          </View>

          {/* Type toggle */}
          <View>
            <Text style={globalStyles.inputLabel}>Tipo</Text>
            <View style={styles.typeToggle}>
              <TouchableOpacity
                style={[styles.typeBtn, !form.isIncome && styles.typeBtnActive]}
                onPress={() => setForm({ ...form, isIncome: false })}
              >
                <MaterialIcons
                  name="arrow_downward"
                  size={16}
                  color={!form.isIncome ? "#fff" : colors.secondaryText}
                />
                <Text style={[styles.typeBtnText, !form.isIncome && styles.typeBtnTextActive]}>
                  Despesa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, form.isIncome && styles.typeBtnIncomeActive]}
                onPress={() => setForm({ ...form, isIncome: true })}
              >
                <MaterialIcons
                  name="arrow_upward"
                  size={16}
                  color={form.isIncome ? "#fff" : colors.secondaryText}
                />
                <Text style={[styles.typeBtnText, form.isIncome && styles.typeBtnTextActive]}>
                  Receita
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Color picker */}
          <View>
            <Text style={globalStyles.inputLabel}>Cor</Text>
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
                >
                  {form.background === c && (
                    <MaterialIcons name="check" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Icon picker */}
          <View>
            <Text style={globalStyles.inputLabel}>Ícone</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  onPress={() => setForm({ ...form, icon: iconName })}
                  style={[
                    styles.iconBtn,
                    form.icon === iconName && {
                      backgroundColor: form.background,
                      borderColor: form.background,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={iconName}
                    size={22}
                    color={form.icon === iconName ? "#fff" : colors.primaryText}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button onPress={handleCreate} disabled={saving}>
            {saving ? "Criando..." : "Criar Categoria"}
          </Button>
        </View>

        <Text style={styles.sectionTitle}>
          Categorias ({categories.length})
        </Text>

        {loading && <ActivityIndicator color={colors.primary} />}
        {error && <Text style={globalStyles.secondaryText}>{error}</Text>}

        {categories.map((cat) => (
          <View key={cat.id}>
            <View style={styles.categoryRow}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.background }]}>
                <MaterialIcons name={cat.icon} size={20} color="#fff" />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={globalStyles.primaryText}>{cat.displayName}</Text>
                <Text style={globalStyles.secondaryText}>
                  {cat.isDefault ? "padrão" : "personalizada"}
                  {cat.isIncome ? " · receita" : " · despesa"}
                </Text>
              </View>
              {!cat.isDefault && (
                <TouchableOpacity onPress={() => handleDelete(cat)} hitSlop={8}>
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
    color: colors.primaryText,
    marginTop: 8,
    marginBottom: 12,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  previewBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: 2,
  },
  previewType: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  form: {
    gap: 16,
    marginBottom: 28,
  },
  typeToggle: {
    flexDirection: "row",
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.secondaryText,
    backgroundColor: "#fff",
  },
  typeBtnActive: {
    backgroundColor: colors.negativeText,
    borderColor: colors.negativeText,
  },
  typeBtnIncomeActive: {
    backgroundColor: colors.positiveText,
    borderColor: colors.positiveText,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.secondaryText,
  },
  typeBtnTextActive: {
    color: "#fff",
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
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchSelected: {
    borderWidth: 2.5,
    borderColor: "#555",
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
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
