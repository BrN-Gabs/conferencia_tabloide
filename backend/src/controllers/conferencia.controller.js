import { lerExcelBuffer } from "../services/excel.service.js";
import { extrairProdutosDoPDF } from "../services/gemini.service.js";
import { compararProdutos } from "../services/comparacao.service.js";

function traduzirMensagemErro(err) {
  if (!err) return "Erro interno no servidor.";

  if (err.code === "LIMIT_FILE_SIZE" || err.message === "File too large") {
    return "Arquivo muito grande. Envie arquivos de ate 100MB.";
  }

  if (err.message === "CORS nao configurado no servidor.") {
    return "Servidor sem configuracao de acesso entre frontend e backend.";
  }

  if (err.message === "Origem nao permitida pelo CORS.") {
    return "Origem do frontend nao permitida pelo servidor.";
  }

  if (err.message === "Resposta vazia da IA.") {
    return "A IA nao retornou conteudo. Tente novamente.";
  }

  if (err.message === "IA retornou JSON invalido.") {
    return "Nao foi possivel interpretar a resposta da IA. Tente novamente.";
  }

  if (
    err.message === "Tabela de produtos nao encontrada no Excel." ||
    err.message === "Tabela de produtos nÃ£o encontrada no Excel."
  ) {
    return "Nao foi encontrada uma tabela de produtos valida no Excel enviado.";
  }

  if (err.message?.includes("status code 400")) {
    return "Requisicao invalida ao servico de IA. Verifique os arquivos enviados.";
  }

  if (err.message?.includes("status code 401") || err.message?.includes("status code 403")) {
    return "Falha de autenticacao no servico de IA. Verifique a chave GEMINI_API_KEY no Render.";
  }

  if (err.message?.includes("status code 429")) {
    return "Limite de requisicoes do servico de IA atingido. Tente novamente em instantes.";
  }

  if (err.message?.toLowerCase().includes("timeout")) {
    return "A analise demorou mais que o esperado. Tente novamente com um arquivo menor.";
  }

  if (err.message?.includes("status code 5")) {
    return "Servico de IA indisponivel no momento. Tente novamente mais tarde.";
  }

  return err.message || "Erro interno no servidor.";
}

export async function processarConferencia(req, res, next) {
  try {
    if (!req.files?.excel || !req.files?.pdf) {
      return res.status(400).json({
        success: false,
        message: "Envie os arquivos Excel e PDF."
      });
    }

    const excelFile = req.files.excel[0];
    const pdfFile = req.files.pdf[0];

    const produtosExcel = lerExcelBuffer(excelFile.buffer);
    const produtosPDF = await extrairProdutosDoPDF(pdfFile.buffer);

    console.log("Excel:", produtosExcel.length);
    console.log("PDF:", produtosPDF.length);

    const produtosComparados = compararProdutos(produtosExcel, produtosPDF);

    return res.status(200).json({
      success: true,
      pagina: 1,
      totalProdutos: produtosComparados.length,
      produtos: produtosComparados
    });
  } catch (err) {
    console.error("Erro na conferencia:", err.message);

    return res.status(err.status || 500).json({
      success: false,
      message: traduzirMensagemErro(err)
    });
  }
}
