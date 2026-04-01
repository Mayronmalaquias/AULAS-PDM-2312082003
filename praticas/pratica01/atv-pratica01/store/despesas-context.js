import { createContext, useState } from 'react';

export const DespesasContext = createContext({
  despesas: [],
  addDespesa: ({ descricao, valor, data }) => {},
});

function DespesasContextProvider({ children }) {
  const [despesas, setDespesas] = useState([
    { id: '1', descricao: 'Conta de luz', valor: 100.99, data: new Date(2025, 2, 11) },
    { id: '2', descricao: 'Conta de Água', valor: 40.99, data: new Date(2025, 4, 10) },
  ]);

  function addDespesa(despesaData) {
    setDespesas((currentDespesas) => [
      {
        id: new Date().toString() + Math.random().toString(),
        ...despesaData,
      },
      ...currentDespesas,
    ]);
  }

  const value = {
    despesas,
    addDespesa,
  };

  return (
    <DespesasContext.Provider value={value}>
      {children}
    </DespesasContext.Provider>
  );
}

export default DespesasContextProvider;