import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ResultViewer from "../components/ResultViewer";
import "../App.css";

export default function ComparePage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container compare-page">
      <UploadBox onResult={setResult} onLoadingChange={setLoading} />
      <ResultViewer result={result} />

      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-card">
            <div className="loading-spinner" />
            <p>Comparando os arquivos, aguarde...</p>
          </div>
        </div>
      )}
    </div>
  );
}
