import { useContext } from 'react';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { DespesasContext } from '../store/despesas-context';

function TodasDespesas() {
  const despesasCtx = useContext(DespesasContext);

  return <DespesaSaida despesas={despesasCtx.despesas} periodo="Total" />;
}

export default TodasDespesas;