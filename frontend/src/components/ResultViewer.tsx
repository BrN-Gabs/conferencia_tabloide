import { SummaryCard } from "../components/SummaryCard";

interface Produto {
  codigo: string;
  status: string;
  excel?: any;
  pdf?: any;
}

export default function ResultViewer({ result }: any) {
  if (!result || !result.produtos) return null;

  const detalhes = result.produtos;
  const iguais = detalhes.iguais || [];
  const divergentes = detalhes.divergentes || [];
  const faltandoNoPDF = detalhes.faltandoNoPDF || [];
  const faltandoNoExcel = detalhes.faltandoNoExcel || [];

  const totalExcel = iguais.length + divergentes.length + faltandoNoPDF.length;
  const totalPDF = iguais.length + divergentes.length + faltandoNoExcel.length;

  const produtosLista: Produto[] = [
    ...iguais,
    ...divergentes,
    ...faltandoNoPDF,
    ...faltandoNoExcel,
  ];

  const totalUnico = produtosLista.length;

  const formatMoney = (value?: number | string) => {
    if (!value && value !== 0) return "-";

    const number =
      typeof value === "string"
        ? parseFloat(value.replace(/\./g, "").replace(",", "."))
        : value;

    if (isNaN(number)) return "-";

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatStatus = (status: string) =>
    status.replaceAll("_", " ").replace(/\bNAO\b/g, "N\u00c3O");

  const getStatusClass = (status: string) => {
    if (status === "IGUAL") return "product-status status-ok";
    if (status.includes("PDF")) return "product-status status-pdf";
    if (status.includes("EXCEL")) return "product-status status-excel";
    return "product-status status-divergent";
  };

  return (
    <section className="result-viewer">
      <h2 className="result-title">Resultado da conferência</h2>

      <div className="summary-grid">
        <SummaryCard title="Total consolidado" value={totalUnico} />
        <SummaryCard title="Total Excel" value={totalExcel} />
        <SummaryCard title="Total PDF" value={totalPDF} />
        <SummaryCard title="OK" value={iguais.length} color="#15803d" />
        <SummaryCard title="Divergentes" value={divergentes.length} color="#dc2626" />
        <SummaryCard title="Faltando no PDF" value={faltandoNoPDF.length} color="#d97706" />
        <SummaryCard
          title="Faltando no Excel"
          value={faltandoNoExcel.length}
          color="#0f8cae"
        />
      </div>

      <h3 className="list-title">Lista completa</h3>

      <div className="result-list card">
        {produtosLista.map((item: Produto, index: number) => (
          <article key={index} className="product-row">
            <div className="product-head">
              <strong>{item.codigo}</strong>
              <span className={getStatusClass(item.status)}>
                {formatStatus(item.status)}
              </span>
            </div>

            <div className="product-values">
              {item.excel && (
                <p>
                  <strong>Excel:</strong> A vista: {formatMoney(item.excel.valorAvista)} |
                  Parcela: {item.excel.parcelasQtd}x | Valor da parcela:{" "}
                  {formatMoney(item.excel.valorParcela)} | A prazo:{" "}
                  {formatMoney(item.excel.valorTotal)}
                </p>
              )}

              {item.pdf && (
                <p>
                  <strong>PDF:</strong> A vista: {formatMoney(item.pdf.valorAvista)} |
                  Parcela: {item.pdf.parcelas}x | Valor da parcela:{" "}
                  {formatMoney(item.pdf.valorParcela)} | A prazo:{" "}
                  {formatMoney(item.pdf.valorPrazo)}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
