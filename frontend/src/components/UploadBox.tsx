import { useState } from "react";
import { api } from "../services/api";

interface UploadBoxProps {
  onResult: (data: any) => void;
}

export default function UploadBox({ onResult }: UploadBoxProps) {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!excelFile || !pdfFile) {
      alert("Envie o Excel e o PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", excelFile);
    formData.append("pdf", pdfFile);

    try {
      setLoading(true);

      const response = await api.post(
        "/api/conferencia/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      onResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao processar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>📊 Conferência de Arquivos</h2>

      <div className="input-group">
        <label>Arquivo Excel</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) =>
            setExcelFile(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>

      <div className="input-group">
        <label>Arquivo PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            setPdfFile(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "⏳ Processando..." : "🚀 Iniciar Conferência"}
      </button>
    </div>
  );
}