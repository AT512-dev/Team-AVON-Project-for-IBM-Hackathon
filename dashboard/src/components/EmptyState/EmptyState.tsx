"use client";

export default function EmptyState() {
  return (
    <div className="card" style={{ padding: "5rem 2rem", textAlign: "center" }}>
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: "3.5rem",
          color: "#1f2937",
          marginBottom: "1rem",
          display: "block",
        }}
      >
        security
      </span>
      <p
        style={{
          color: "#374151",
          fontSize: "0.9rem",
          maxWidth: 320,
          margin: "0 auto",
        }}
      >
        Click <strong style={{ color: "#6366f1" }}>Run Audit Now</strong> above
        to scan your codebase for vulnerabilities.
      </p>
    </div>
  );
}
