import DespesaSaida from '../components/despesa/DespesaSaida';

function DespesaRecentes() {
  function filtrarUltimos7Dias(despesas) {
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);
    return despesas.filter(despesa => despesa.data >= seteDiasAtras && despesa.data <= hoje);
  }

  return <DespesaSaida despesas={filtrarUltimos7Dias(DUMMY_DESPESAS)} periodo={'Últimos 7 dias'} />;
}

export default DespesaRecentes;