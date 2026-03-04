interface SummaryCardProps {
  title: string;
  value: number;
  color?: string;
}

export function SummaryCard({
  title,
  value,
  color = "#2563eb",
}: SummaryCardProps) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 14, color: "#666" }}>{title}</div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginTop: 5,
          color: color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const cardStyle = {
  flex: 1,
  minWidth: "140px",
  background: "#fff",
  padding: "18px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  textAlign: "center" as const,
};