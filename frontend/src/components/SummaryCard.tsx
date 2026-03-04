interface SummaryCardProps {
  title: string;
  value: number;
  color?: string;
}

export function SummaryCard({ title, value, color = "#0f8cae" }: SummaryCardProps) {
  return (
    <div className="summary-card">
      <div className="summary-title">{title}</div>
      <div className="summary-value" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
