import XLSX from "xlsx";
import { extrairCodigo, pareceValor, normalizarValor } from "../utils/normalizacao.js";

export function lerExcelBuffer(buffer) {

  const workbook = XLSX.read(buffer, { type: "buffer" });
  let produtos = [];

  for (const sheetName of workbook.SheetNames) {

    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
      defval: ""
    });

    if (!rows.length) continue;

    for (let i = 0; i < rows.length; i++) {

      const row = rows[i];
      if (!row || row.length < 8) continue;

      const codigo = extrairCodigo(row[0]);
      const descricao = String(row[1] ?? "").trim();

      if (
        codigo &&
        descricao.length > 5 &&
        pareceValor(row[2]) &&
        pareceValor(row[3])
      ) {

        produtos.push({
          codigo,
          descricao,
          valorAvista: normalizarValor(row[2]),
          valorCarne: normalizarValor(row[3]),
          entrada: row[4],
          parcelasQtd: Number(row[5]) || 0,
          valorParcela: normalizarValor(row[6]),
          valorTotal: normalizarValor(row[7])
        });
      }
    }

    if (produtos.length) break;
  }

  if (!produtos.length) {
    const erro = new Error("Tabela de produtos não encontrada no Excel.");
    erro.status = 400;
    throw erro;
  }

  return produtos;
}