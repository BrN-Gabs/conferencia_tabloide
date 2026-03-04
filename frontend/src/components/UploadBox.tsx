import { useState } from "react";
import { api } from "../services/api";

interface UploadBoxProps {
  onResult: (data: any) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function UploadBox({ onResult, onLoadingChange }: UploadBoxProps) {
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
      onLoadingChange(true);

      const response = await api.post("/api/conferencia/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao processar.");
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  }

  return (
    <div className="card upload-card">
      <div className="upload-header">
        <p className="upload-kicker">Conferência tabloide</p>
        <h2>Conferência de arquivos</h2>
        <p className="upload-subtitle">
          Envie sua planilha e o PDF para comparar dados com rapidez e
          confiabilidade.
        </p>
      </div>

      <div className="upload-grid">
        <div className="input-group file-field">
          <label>Arquivo Excel</label>
          <span className="file-hint">Formatos .xlsx e .xls</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) =>
              setExcelFile(e.target.files ? e.target.files[0] : null)
            }
          />
          <span className="file-name">
            {excelFile ? excelFile.name : "Nenhum arquivo selecionado"}
          </span>
        </div>

        <div className="input-group file-field">
          <label>Arquivo PDF</label>
          <span className="file-hint">Documento no formato PDF</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
          />
          <span className="file-name">
            {pdfFile ? pdfFile.name : "Nenhum arquivo selecionado"}
          </span>
        </div>
      </div>

      <button className="upload-button" onClick={handleSubmit} disabled={loading}>
        {loading ? "Processando..." : "Iniciar conferência"}
      </button>
    </div>
  );
}
