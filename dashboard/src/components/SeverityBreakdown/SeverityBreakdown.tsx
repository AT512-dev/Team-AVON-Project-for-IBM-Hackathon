"use client";

import { type AuditData } from "../../lib/api";

interface SeverityBreakdownProps {
  summary: AuditData["summary"];
  impact: AuditData["impact"];
}

export default function SeverityBreakdown({
  summary,
  impact,
}: SeverityBreakdownProps) {
  const total = summary.total || 1;

  const bars = [
    {
      key: "critical",
      label: "Critical",
      color: "#ef4444",
      count: summary.critical,
    },
    { key: "high", label: "High", color: "#f97316", count: summary.high },
    { key: "medium", label: "Medium", color: "#eab308", count: summary.medium },
    { key: "low", label: "Low", color: "#6b7280", count: summary.low },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Severity Breakdown</span>
        <span className="count-badge">{summary.total} total</span>
      </div>
      <div style={{ padding: "1.5rem" }}>
        {/* Bars */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {bars.map((b) => (
            <div
              key={b.key}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span
                style={{ width: 56, fontSize: "0.75rem", color: "#9ca3af" }}
              >
                {b.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 9999,
                    width: `${(b.count / total) * 100}%`,
                    background: b.color,
                    boxShadow: `0 0 8px ${b.color}55`,
                    transition: "width 1s ease",
                  }}
                />
              </div>
              <span
                style={{
                  width: 20,
                  textAlign: "right",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: b.color,
                }}
              >
                {b.count}
              </span>
            </div>
          ))}
        </div>

        {/* Fix time info */}
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            borderRadius: 12,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              color: "#6b7280",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Estimated Fix Time
          </p>
          <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>
            {impact.time_saved_minutes} minutes
          </p>
          <p style={{ fontSize: "0.75rem", color: "#4b5563", marginTop: 2 }}>
            vs {impact.manual_review_cost} manual review
          </p>
        </div>
      </div>
    </div>
  );
}
