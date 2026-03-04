import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ResultViewer from "../components/ResultViewer";
import "../App.css";

export default function ComparePage() {
  const [result, setResult] = useState(null);

  return (
    <div className="container">
      <UploadBox onResult={setResult} />
      <ResultViewer result={result} />
    </div>
  );
}