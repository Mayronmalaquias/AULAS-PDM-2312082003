import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import React, { useState, useContext } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DespesasContext } from '../store/despesas-context';

function GerenciarDespesa({ navigation }) {
  const despesasCtx = useContext(DespesasContext);

  const [data, setData] = useState(new Date());
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setData(selectedDate);
  };

  const handleChangeValor = (text) => {
    const cleanText = text.replace(',', '.');
    if (cleanText.match(/^\d*\.?\d{0,2}$/)) setValor(cleanText);
  };

  function confirmarHandler() {
    if (!descricao.trim() || !valor.trim()) {
      Alert.alert('Erro', 'Preencha a descrição e o valor.');
      return;
    }

    despesasCtx.addDespesa({
      descricao: descricao,
      valor: Number(valor),
      data: data,
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          maxLength={50}
          value={descricao}
          onChangeText={setDescricao}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valor da Despesa</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={valor}
          onChangeText={handleChangeValor}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Data da Despesa</Text>
        <Pressable onPress={() => setShowPicker(true)} style={styles.input}>
          <Text>{data.toLocaleDateString('pt-BR')}</Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={data}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <Pressable style={styles.button} onPress={confirmarHandler}>
        <Text style={styles.buttonText}>Salvar despesa</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: 20 },
  inputContainer: { marginHorizontal: 4, marginVertical: 16 },
  label: { fontSize: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 },
  button: {
    marginTop: 20,
    backgroundColor: '#4e6cff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GerenciarDespesa;