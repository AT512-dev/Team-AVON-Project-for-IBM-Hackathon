"use client";

interface ScoreRingProps {
  score: number;
  label: string;
  color: string;
}

function ScoreRing({ score, label, color }: ScoreRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <div style={{ position: "relative", width: 128, height: 128 }}>
        <svg
          viewBox="0 0 128 128"
          style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
        >
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color }}>
            {score}
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "#9ca3af",
              }}
            >
              %
            </span>
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#9ca3af",
        }}
      >
        {label}
      </span>
    </div>
  );
}

interface ScoreComparisonProps {
  beforeScore: number;
  afterScore: number;
}

export default function ScoreComparison({
  beforeScore,
  afterScore,
}: ScoreComparisonProps) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Score Comparison</span>
      </div>
      <div
        style={{
          padding: "2rem",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <ScoreRing
          score={Math.max(10, beforeScore)}
          label="Before"
          color="#ef4444"
        />
        <div
          style={{
            width: 1,
            height: 80,
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)",
          }}
        />
        <ScoreRing score={afterScore} label="After" color="#10b981" />
      </div>
    </div>
  );
}
