import { extrairCodigo, normalizarValor } from "../utils/normalizacao.js";

const TOLERANCIA = 0.01; // evita erro de ponto flutuante

export function compararProdutos(produtosExcel, produtosPDF) {
  const iguais = [];
  const divergentes = [];
  const faltandoNoPDF = [];
  const faltandoNoExcel = [];

  // 🔹 Normaliza Excel
  const excelNormalizado = produtosExcel
    .map(p => ({
      ...p,
      codigo: extrairCodigo(p.codigo),
      valorAvista: normalizarValor(p.valorAvista),
      valorCarne: normalizarValor(p.valorCarne),
      valorParcela: normalizarValor(p.valorParcela),
      valorTotal: normalizarValor(p.valorTotal)
    }))
    .filter(p => p.codigo);

  // 🔹 Normaliza PDF
  const pdfNormalizado = produtosPDF
    .map(p => ({
      ...p,
      codigo: extrairCodigo(p.codigo),
      valorAvista: normalizarValor(p.valorAvista),
      valorParcela: normalizarValor(p.valorParcela),
      valorPrazo: normalizarValor(p.valorPrazo)
    }))
    .filter(p => p.codigo);

  // 🔹 Mapas para busca rápida
  const mapaPDF = new Map();
  pdfNormalizado.forEach(p => {
    mapaPDF.set(String(p.codigo), p);
  });

  const mapaExcel = new Map();
  excelNormalizado.forEach(p => {
    mapaExcel.set(String(p.codigo), p);
  });

  // 🔍 1️⃣ Percorre Excel e tenta achar no PDF
  for (const produtoExcel of excelNormalizado) {
    const codigo = String(produtoExcel.codigo);
    const produtoPDF = mapaPDF.get(codigo);

    if (!produtoPDF) {
      faltandoNoPDF.push({
        codigo,
        status: "NAO_ENCONTRADO_NO_PDF",
        excel: produtoExcel,
        pdf: null,
        divergencias: null
      });
      continue;
    }

    const divergenciasItem = {};

    // 🔸 Comparação à vista
    if (
      produtoExcel.valorAvista !== null &&
      produtoPDF.valorAvista !== null &&
      Math.abs(produtoExcel.valorAvista - produtoPDF.valorAvista) > TOLERANCIA
    ) {
      divergenciasItem.valorAvista = {
        excel: produtoExcel.valorAvista,
        pdf: produtoPDF.valorAvista
      };
    }

    // 🔸 Comparação valor parcela
    if (
      produtoExcel.valorParcela !== null &&
      produtoPDF.valorParcela !== null &&
      Math.abs(produtoExcel.valorParcela - produtoPDF.valorParcela) > TOLERANCIA
    ) {
      divergenciasItem.valorParcela = {
        excel: produtoExcel.valorParcela,
        pdf: produtoPDF.valorParcela
      };
    }

    // 🔸 Comparação valor total / prazo
    if (
      produtoExcel.valorTotal !== null &&
      produtoPDF.valorPrazo !== null &&
      Math.abs(produtoExcel.valorTotal - produtoPDF.valorPrazo) > TOLERANCIA
    ) {
      divergenciasItem.valorTotal = {
        excel: produtoExcel.valorTotal,
        pdf: produtoPDF.valorPrazo
      };
    }

    if (Object.keys(divergenciasItem).length === 0) {
      iguais.push({
        codigo,
        status: "IGUAL",
        excel: produtoExcel,
        pdf: produtoPDF,
        divergencias: null
      });
    } else {
      divergentes.push({
        codigo,
        status: "DIVERGENTE",
        excel: produtoExcel,
        pdf: produtoPDF,
        divergencias: divergenciasItem
      });
    }
  }

  // 🔍 2️⃣ Verifica o que existe no PDF e não existe no Excel
  for (const produtoPDF of pdfNormalizado) {
    const codigo = String(produtoPDF.codigo);

    if (!mapaExcel.has(codigo)) {
      faltandoNoExcel.push({
        codigo,
        status: "NAO_ENCONTRADO_NO_EXCEL",
        excel: null,
        pdf: produtoPDF,
        divergencias: null
      });
    }
  }

  return {
    iguais,
    divergentes,
    faltandoNoPDF,
    faltandoNoExcel
  };
}