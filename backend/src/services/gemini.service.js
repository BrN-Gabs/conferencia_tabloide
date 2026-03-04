import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

export async function extrairProdutosDoPDF(buffer) {
  try {
    if (!buffer) {
      throw new Error("Buffer do PDF não recebido.");
    }

    const base64PDF = buffer.toString("base64");

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [
              {
                text: `
Este PDF contém páginas promocionais de tabloide.

Extraia TODOS os produtos visíveis em TODAS as páginas.

⚠️ NÃO RESUMA.
⚠️ NÃO PARE ANTES DE TERMINAR.
⚠️ NÃO OMITA PRODUTOS.
⚠️ NÃO EXPLIQUE NADA.

REGRAS:

- Código é número de 4 a 6 dígitos
- Código nunca contém letras
- Se não conseguir ler, ignore o produto
- Nunca invente código
- Nunca estime código

Para cada produto retorne:

{
  "codigo": "",
  "parcelas": "",
  "valorAvista": "",
  "valorParcela": "",
  "valorPrazo": ""
}

FORMATO OBRIGATÓRIO DE RESPOSTA:

[
  {
    "codigo": "",
    "parcelas": "",
    "valorAvista": "",
    "valorParcela": "",
    "valorPrazo": ""
  }
]

Retorne APENAS JSON válido.
Sem markdown.
Sem texto adicional.
Sem explicações.
`
              },
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64PDF
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 8192,   // 🔥 AQUI É O MAIS IMPORTANTE
          topP: 1,
          topK: 1
        }
      },
      {
        timeout: 60000
      }
    );

    const respostaIA =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!respostaIA) {
      throw new Error("Resposta vazia da IA.");
    }

    const jsonLimpo = respostaIA
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const produtos = JSON.parse(jsonLimpo);

      if (!Array.isArray(produtos)) {
        throw new Error("IA não retornou array.");
      }

      return produtos;

    } catch (error) {
      console.error("Resposta original da IA:", respostaIA);
      throw new Error("IA retornou JSON inválido.");
    }

  } catch (error) {
    console.error("Erro no Gemini Service:", error.message);
    throw error;
  }
}