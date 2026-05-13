import { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "../../components/Button";
import CategoryPicker from "../../components/CategoryPicker";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import DescriptionInput from "../../components/DescriptionInput";
import { MoneyContext } from "../../contexts/GlobalState";
import { globalStyles } from "../../styles/globalStyles";

const buildInitialForm = (categories) => ({
  description: "",
  value: 0,
  date: new Date(),
  categoryId: categories.find((c) => c.isIncome)?.id ?? categories[0]?.id ?? "",
});

export default function AddTransactions() {
  const { categories, addTransaction } = useContext(MoneyContext);
  const [form, setForm] = useState(buildInitialForm(categories));
  const [saving, setSaving] = useState(false);
  const valueInputRef = useRef();

  useEffect(() => {
    if (categories.length > 0 && !form.categoryId) {
      setForm((f) => ({
        ...f,
        categoryId: categories.find((c) => c.isIncome)?.id ?? categories[0].id,
      }));
    }
  }, [categories]);

  const handleAdd = async () => {
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
      await addTransaction({
        description: form.description,
        value: form.value,
        date: form.date.toISOString(),
        categoryId: form.categoryId,
      });
      setForm(buildInitialForm(categories));
      Alert.alert("Sucesso!", "Transação adicionada com sucesso!");
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível salvar a transação.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={globalStyles.screenContainer} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={globalStyles.content}>
          <View style={styles.form}>
            <DescriptionInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
            <CurrencyInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
            <DatePicker form={form} setForm={setForm} />
            <CategoryPicker form={form} setForm={setForm} />
          </View>
          <Button onPress={handleAdd} disabled={saving}>
            {saving ? "Salvando..." : "Adicionar"}
          </Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
    marginBottom: 40,
    marginTop: 10,
  },
});
