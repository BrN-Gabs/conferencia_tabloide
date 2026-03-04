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

  // 🔢 Totais
  const totalExcel = iguais.length + divergentes.length + faltandoNoPDF.length;
  const totalPDF = iguais.length + divergentes.length + faltandoNoExcel.length;

  // 🔥 NÃO remove mais duplicados
  const produtosLista: Produto[] = [
    ...iguais,
    ...divergentes,
    ...faltandoNoPDF,
    ...faltandoNoExcel,
  ];

  const totalUnico = produtosLista.length;

  // 💰 Formatador BRL
  const formatMoney = (value?: number | string) => {
    if (!value && value !== 0) return "-";

    const number =
      typeof value === "string"
        ? parseFloat(value.replace(",", "."))
        : value;

    if (isNaN(number)) return "-";

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>📊 Resultado da Conferência</h2>

      {/* ================= TOTAIS ================= */}
      <div style={summaryContainer}>
        <SummaryCard title="Total Consolidado" value={totalUnico} />
        <SummaryCard title="Total Excel" value={totalExcel} />
        <SummaryCard title="Total PDF" value={totalPDF} />
        <SummaryCard title="OK" value={iguais.length} color="#16a34a" />
        <SummaryCard title="Divergentes" value={divergentes.length} color="#dc2626" />
        <SummaryCard title="Faltando no PDF" value={faltandoNoPDF.length} color="#f59e0b" />
        <SummaryCard title="Faltando no Excel" value={faltandoNoExcel.length} color="#7c3aed" />
      </div>

      {/* ================= LISTA COMPLETA ================= */}
      <h3 style={{ marginTop: 30 }}>📋 Lista Completa</h3>

        <div style={tableContainer}>
        {produtosLista.map((item: Produto, index: number) => {

            return (
            <div key={index} style={rowStyle}>
                <div style={rowHeader}>
                <strong>{item.codigo}</strong>

                <span
                    style={{
                    ...statusBadge,
                    backgroundColor:
                        item.status === "IGUAL"
                        ? "#16a34a"
                        : item.status.includes("PDF")
                        ? "#f59e0b"
                        : item.status.includes("EXCEL")
                        ? "#7c3aed"
                        : "#dc2626",
                    }}
                >
                    {item.status}
                </span>
                </div>

                <div style={valuesContainer}>
                {item.excel && (
                    <div>
                    <strong>Excel:</strong>{" "}
                    À vista: {formatMoney(item.excel.valorAvista)} |{" "}
                    Parcela: {item.excel.parcelasQtd}X |{" "}
                    Valor da Parcela: {formatMoney(item.excel.valorParcela)} |{" "}
                    À Prazo: {formatMoney(item.excel.valorTotal)}
                    </div>
                )}

                <br/>

                {item.pdf && (
                    <div>
                    <strong>PDF:</strong>{" "}
                    À vista: {formatMoney(item.pdf.valorAvista)} |{" "}
                    Parcela: {item.pdf.parcelas}X |{" "}
                    Valor da Parcela: {formatMoney(item.pdf.valorParcela)} |{" "}
                    À Prazo: {formatMoney(item.pdf.valorPrazo)}
                    </div>
                )}
                </div>
            </div>
            );
        })}
        </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

const summaryContainer = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap" as const,
  marginTop: "20px",
};

const tableContainer = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  marginTop: "15px",
};

const rowStyle = {
  padding: "15px 0",
  borderBottom: "1px solid #eee",
};

const rowHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const valuesContainer = {
  marginTop: "8px",
  fontSize: "14px",
  color: "#444",
};

const statusBadge = {
  padding: "4px 10px",
  borderRadius: "20px",
  color: "#fff",
  fontSize: "12px",
  fontWeight: 600,
};