import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "./Button";
import CategoryPicker from "./CategoryPicker";
import CurrencyInput from "./CurrencyInput";
import DatePicker from "./DatePicker";
import DescriptionInput from "./DescriptionInput";
import { MoneyContext } from "../contexts/GlobalState";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

export default function EditTransactionModal({ transaction, visible, onClose }) {
  const { categories, updateTransaction, removeTransaction } = useContext(MoneyContext);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        value: Number(transaction.value),
        date: new Date(transaction.date),
        categoryId: transaction.categoryId,
      });
    }
  }, [transaction]);

  if (!visible || !form) return null;

  const handleSave = async () => {
    if (!form.description.trim()) {
      Alert.alert("Atenção", "Informe a descrição da transação.");
      return;
    }
    if (form.value <= 0) {
      Alert.alert("Atenção", "Informe um valor maior que zero.");
      return;
    }
    setSaving(true);
    try {
      await updateTransaction(transaction.id, {
        description: form.description,
        value: form.value,
        date: form.date.toISOString(),
        categoryId: form.categoryId,
      });
      onClose();
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível salvar a transação.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${transaction.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTransaction(transaction.id);
              onClose();
            } catch (e) {
              Alert.alert("Erro", e.message ?? "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.sheetWrapper}
          >
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <View style={styles.header}>
                <Text style={styles.title}>Editar Transação</Text>
                <TouchableOpacity onPress={onClose} hitSlop={8}>
                  <MaterialIcons name="close" size={24} color={colors.primaryText} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
                <View style={styles.form}>
                  <DescriptionInput form={form} setForm={setForm} />
                  <CurrencyInput form={form} setForm={setForm} />
                  <DatePicker form={form} setForm={setForm} />
                  <CategoryPicker form={form} setForm={setForm} />
                </View>

                <Button onPress={handleSave} disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </Button>

                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                  <MaterialIcons name="delete-outline" size={20} color={colors.negativeText} />
                  <Text style={styles.deleteText}>Excluir transação</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    width: "100%",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingBottom: 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primaryText,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  form: {
    gap: 12,
    marginBottom: 20,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    paddingVertical: 12,
  },
  deleteText: {
    color: colors.negativeText,
    fontSize: 15,
    fontWeight: "500",
  },
});
