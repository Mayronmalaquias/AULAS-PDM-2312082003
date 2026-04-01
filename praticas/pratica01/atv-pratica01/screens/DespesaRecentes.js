import { useContext } from 'react';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { DespesasContext } from '../store/despesas-context';

function DespesaRecentes() {
  const despesasCtx = useContext(DespesasContext);

  function filtrarUltimos7Dias(despesas) {
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);

    return despesas.filter(
      (despesa) => despesa.data >= seteDiasAtras && despesa.data <= hoje
    );
  }

  const despesasRecentes = filtrarUltimos7Dias(despesasCtx.despesas);

  return (
    <DespesaSaida
      despesas={despesasRecentes}
      periodo="Últimos 7 dias"
    />
  );
}

export default DespesaRecentes;