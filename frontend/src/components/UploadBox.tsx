import { useState } from "react";
import axios from "axios";
import { api } from "../services/api";

const MAX_UPLOAD_MB = 30;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

interface UploadBoxProps {
  onResult: (data: any) => void;
  onLoadingChange: (loading: boolean) => void;
}

interface ErrorPopup {
  title: string;
  message: string;
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function UploadBox({ onResult, onLoadingChange }: UploadBoxProps) {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<ErrorPopup | null>(null);

  const openErrorPopup = (title: string, message: string) => {
    setErrorPopup({ title, message });
  };

  const closeErrorPopup = () => {
    setErrorPopup(null);
  };

  const getReadableErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
      return apiMessage || error.message || "Erro ao processar a conferencia.";
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Erro ao processar a conferencia.";
  };

  async function handleSubmit() {
    if (!excelFile || !pdfFile) {
      openErrorPopup("Arquivos obrigatorios", "Envie o Excel e o PDF para continuar.");
      return;
    }

    if (excelFile.size > MAX_UPLOAD_BYTES || pdfFile.size > MAX_UPLOAD_BYTES) {
      openErrorPopup(
        "Arquivo muito grande",
        `O limite por arquivo e de ${MAX_UPLOAD_MB}MB.`
      );
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
      openErrorPopup("Falha na conferencia", getReadableErrorMessage(error));
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  }

  return (
    <>
      <div className="card upload-card">
        <div className="upload-header">
          <p className="upload-kicker">Conferencia tabloide</p>
          <h2>Conferencia de arquivos</h2>
          <p className="upload-subtitle">
            Envie sua planilha e o PDF para comparar dados com rapidez e
            confiabilidade.
          </p>
        </div>

        <div className="upload-grid">
          <div className="input-group file-field">
            <label>Arquivo Excel</label>
            <span className="file-hint">Formatos .xlsx e .xls (maximo {MAX_UPLOAD_MB}MB)</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) =>
                setExcelFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <span className="file-name">
              {excelFile
                ? `${excelFile.name} (${formatFileSize(excelFile.size)})`
                : "Nenhum arquivo selecionado"}
            </span>
          </div>

          <div className="input-group file-field">
            <label>Arquivo PDF</label>
            <span className="file-hint">Documento no formato PDF (maximo {MAX_UPLOAD_MB}MB)</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
            />
            <span className="file-name">
              {pdfFile
                ? `${pdfFile.name} (${formatFileSize(pdfFile.size)})`
                : "Nenhum arquivo selecionado"}
            </span>
          </div>
        </div>

        <button className="upload-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Processando..." : "Iniciar conferencia"}
        </button>
      </div>

      {errorPopup && (
        <div className="error-popup-overlay" role="alertdialog" aria-modal="true">
          <div className="error-popup-card">
            <h3>{errorPopup.title}</h3>
            <p>{errorPopup.message}</p>
            <button type="button" className="error-popup-button" onClick={closeErrorPopup}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
