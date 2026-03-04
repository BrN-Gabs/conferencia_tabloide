import { lerExcelBuffer } from "../services/excel.service.js";
import { extrairProdutosDoPDF } from "../services/gemini.service.js";
import { compararProdutos } from "../services/comparacao.service.js";

export async function processarConferencia(req, res, next) {
  try {

    // 🔒 Validação básica
    if (!req.files?.excel || !req.files?.pdf) {
      return res.status(400).json({
        success: false,
        message: "Envie os arquivos Excel e PDF."
      });
    }

    const excelFile = req.files.excel[0];
    const pdfFile = req.files.pdf[0];

    // 🟢 1️⃣ Processar Excel
    const produtosExcel = lerExcelBuffer(excelFile.buffer);

    // 🟢 2️⃣ Processar PDF via Gemini
    const produtosPDF = await extrairProdutosDoPDF(pdfFile.buffer);

    console.log("Excel:", produtosExcel.length);
    console.log("PDF:", produtosPDF.length);

    // 🟢 2️⃣ Comparação PDF com Excel
    const produtosComparados = compararProdutos(produtosExcel, produtosPDF);

    return res.status(200).json({
      success: true,
      pagina: 1,
      totalProdutos: produtosComparados.length,
      produtos: produtosComparados
    });

  } catch (err) {

    console.error("Erro na conferência:", err.message);

    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Erro interno no servidor."
    });
  }
}