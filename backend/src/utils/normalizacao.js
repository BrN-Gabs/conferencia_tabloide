// =============================
// EXTRAIR CÓDIGO
// =============================
export function extrairCodigo(valor) {
  if (valor === null || valor === undefined) return null;

  const codigo = String(valor)
    .trim()
    .replace(/\.0$/, "") // remove apenas ".0" no FINAL
    .replace(/\D/g, ""); // remove tudo que não for número

  if (codigo.length >= 4 && codigo.length <= 8) {
    return codigo;
  }

  return null;
}


// =============================
// VALIDAR SE PARECE VALOR
// =============================
export function pareceValor(valor) {
  if (valor === null || valor === undefined) return false;

  return /^[-\d.,R$\s]+$/.test(valor.toString());
}


// =============================
// NORMALIZAR VALOR MONETÁRIO
// =============================
export function normalizarValor(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let v = valor.toString().trim();

  // Remove tudo que não for número, vírgula, ponto ou sinal
  v = v.replace(/[^\d.,-]/g, "");

  const lastComma = v.lastIndexOf(",");
  const lastDot = v.lastIndexOf(".");

  if (lastComma > lastDot) {
    // Vírgula é decimal
    v = v.replace(/\./g, "");
    v = v.replace(",", ".");
  } else if (lastDot > lastComma) {
    // Ponto é decimal
    v = v.replace(/,/g, "");
  } else {
    // Não tem separador decimal (ex: 1798)
    v = v.replace(/,/g, "");
  }

  const numero = parseFloat(v);

  if (isNaN(numero)) return null;

  return numero; // sem arredondamento
}


// =============================
// COMPARAÇÃO SEGURA DE VALORES
// =============================
export function valoresIguais(a, b) {
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;

  return Math.abs(a - b) < 0.01;
}