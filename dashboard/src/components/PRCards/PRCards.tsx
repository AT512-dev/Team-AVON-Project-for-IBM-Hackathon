"use client";

import { useState } from "react";
import { type Vulnerability, isCodeBlock } from "../../lib/api";
import { SEVERITY_CONFIG } from "../styles";

interface PRCardProps {
  vuln: Vulnerability;
  index: number;
}

function PRCard({ vuln, index }: PRCardProps) {
  const cfg = SEVERITY_CONFIG[vuln.severity] ?? SEVERITY_CONFIG.LOW;
  const [showModal, setShowModal] = useState(false);

  const remediationText = vuln.remediation?.suggestedFix || vuln.fix_suggestion;
  const isCode = isCodeBlock(remediationText);
  const impactScore = vuln.cvssScore;
  const taintPath = vuln.dataFlow;

  return (
    <>
      <style>{`
        .pr-card {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: 14px;
          padding: 1.25rem;
          transition: border-color 0.3s, transform 0.2s, background 0.3s;
          animation: rowIn 0.4s ease both;
          display: flex;
          flex-direction: column;
        }
        .pr-card:hover {
          border-color: rgba(99,102,241,0.4);
          transform: translateY(-2px);
          background: var(--bg-card-hover);
        }
        .pr-card-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 2px;
        }
        .pr-card-file {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: JetBrains Mono, monospace;
        }
        .pr-card-preview {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 0.75rem;
          flex: 1;
        }
        .pr-view-btn {
          width: 100%;
          margin-top: auto;
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(99,102,241,0.3);
          background: transparent;
          color: #818cf8;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.75rem;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s, border-color 0.2s;
        }
        .pr-view-btn:hover {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.5);
        }
        .pr-impact-box {
          margin-bottom: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pr-impact-label {
          color: #a5b4fc;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .pr-taint-preview {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          padding: 1rem;
        }
        .modal-box {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: 1rem;
          width: 100%;
          max-width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .modal-title {
          color: var(--text-primary);
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .modal-close-btn {
          background: var(--toggle-bg);
          border: 1px solid var(--toggle-border);
          color: var(--text-muted);
          font-size: 1rem;
          border-radius: 0.5rem;
          padding: 0.3rem 0.7rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .modal-close-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        .modal-section-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }
        .modal-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }
        .modal-cwe-badge {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--toggle-bg);
          border: 1px solid var(--border-card);
          color: var(--text-muted);
        }
        .modal-effort-box {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          background: var(--bg-card-hover);
          border: 1px solid var(--border-card);
        }
        .modal-effort-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 2px;
        }
        .modal-effort-value {
          font-size: 0.875rem;
          color: var(--text-primary);
          font-weight: 700;
        }
        .code-block {
          display: block;
          background: var(--vuln-code-bg, rgba(0,0,0,0.4));
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 0.5rem;
          padding: 1rem;
          color: #a5b4fc;
          font-size: 0.8rem;
          font-family: 'JetBrains Mono', monospace;
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 1.6;
        }
        .text-block {
          background: var(--bg-input);
          border: 1px solid var(--border-card);
          border-radius: 0.5rem;
          padding: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.7;
        }
        .taint-flow {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: var(--bg-input);
          border: 1px solid var(--border-card);
          border-radius: 0.5rem;
          padding: 1rem;
        }
        .taint-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .taint-arrow {
          padding-left: 1.5rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .taint-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>

      {/* ── Card ── */}
      <div className="pr-card" style={{ animationDelay: `${index * 80}ms` }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.2)",
                flexShrink: 0,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#818cf8", fontSize: 18 }}
              >
                alt_route
              </span>
            </div>
            <div>
              <p className="pr-card-title">
                Fix {vuln.type.replace(/_/g, " ")}
              </p>
              <code className="pr-card-file">
                {vuln.file}:{vuln.line}
              </code>
            </div>
          </div>
          <span
            style={{
              fontSize: "0.7rem",
              padding: "2px 8px",
              borderRadius: 9999,
              fontWeight: 600,
              color: cfg.color,
              background: cfg.bg,
              border: `1px solid ${cfg.color}33`,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Pending
          </span>
        </div>

        {/* Impact Score */}
        {impactScore !== undefined && (
          <div className="pr-impact-box">
            <span className="pr-impact-label">Impact Score</span>
            <span
              style={{
                fontWeight: 800,
                fontSize: "0.875rem",
                color:
                  impactScore >= 7
                    ? "#ef4444"
                    : impactScore >= 4
                      ? "#f59e0b"
                      : "#34d399",
              }}
            >
              {impactScore}/10
            </span>
          </div>
        )}

        {/* Taint path preview */}
        {taintPath?.source && (
          <div className="pr-taint-preview">
            <span>🔍</span>
            <code
              style={{
                color: "#34d399",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {taintPath.source}
            </code>
            <span>→</span>
            <code
              style={{
                color: "#ef4444",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {taintPath.sink}
            </code>
          </div>
        )}

        {/* Remediation preview */}
        <p className="pr-card-preview">
          {remediationText.length > 100
            ? remediationText.substring(0, 100) + "…"
            : remediationText}
        </p>

        <button className="pr-view-btn" onClick={() => setShowModal(true)}>
          View PR →
        </button>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "0.625rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#818cf8" }}
                  >
                    alt_route
                  </span>
                </div>
                <div>
                  <h2 className="modal-title">
                    Fix {vuln.type.replace(/_/g, " ")}
                  </h2>
                  <code className="pr-card-file">
                    {vuln.file}:{vuln.line}
                  </code>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Severity + CVSS + CWE badges */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 9999,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: cfg.color,
                  background: cfg.bg,
                  border: `1px solid ${cfg.color}33`,
                }}
              >
                {vuln.severity}
              </span>
              {impactScore !== undefined && (
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 9999,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color:
                      impactScore >= 7
                        ? "#ef4444"
                        : impactScore >= 4
                          ? "#f59e0b"
                          : "#34d399",
                  }}
                >
                  CVSS {impactScore}/10
                </span>
              )}
              {vuln.cwe && <span className="modal-cwe-badge">{vuln.cwe}</span>}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p className="modal-section-label">Description</p>
              <p className="modal-description">{vuln.description}</p>
            </div>

            {/* Data Flow */}
            {taintPath?.source && (
              <div style={{ marginBottom: "1.25rem" }}>
                <p className="modal-section-label">🔍 Data Flow Analysis</p>
                <div className="taint-flow">
                  <div className="taint-row">
                    <span style={{ fontSize: "1rem" }}>🟢</span>
                    <span className="taint-label">Source:</span>
                    <code
                      style={{
                        fontSize: "0.75rem",
                        color: "#34d399",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {taintPath.source}
                    </code>
                  </div>
                  {taintPath.taintedVariables &&
                    taintPath.taintedVariables.length > 0 && (
                      <>
                        <div className="taint-arrow">↓</div>
                        <div className="taint-row">
                          <span style={{ fontSize: "1rem" }}>🟡</span>
                          <span className="taint-label">Tainted:</span>
                          <code
                            style={{
                              fontSize: "0.75rem",
                              color: "#fbbf24",
                              fontFamily: "JetBrains Mono, monospace",
                            }}
                          >
                            {taintPath.taintedVariables.join(", ")}
                          </code>
                        </div>
                      </>
                    )}
                  <div className="taint-arrow">↓</div>
                  <div className="taint-row">
                    <span style={{ fontSize: "1rem" }}>🔴</span>
                    <span className="taint-label">Sink:</span>
                    <code
                      style={{
                        fontSize: "0.75rem",
                        color: "#ef4444",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {taintPath.sink}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* AI Remediation */}
            <div>
              <p className="modal-section-label">
                {isCode
                  ? "🤖 AI-Generated Fix (Code)"
                  : "🤖 AI Remediation Suggestion"}
              </p>
              {isCode ? (
                <code className="code-block">{remediationText}</code>
              ) : (
                <div className="text-block">{remediationText}</div>
              )}
            </div>

            {/* Effort + Priority */}
            {vuln.remediation &&
              (vuln.remediation.effort || vuln.remediation.priority) && (
                <div
                  style={{
                    marginTop: "1.25rem",
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  {vuln.remediation.priority && (
                    <div className="modal-effort-box">
                      <p className="modal-effort-label">Priority</p>
                      <p className="modal-effort-value">
                        {vuln.remediation.priority}
                      </p>
                    </div>
                  )}
                  {vuln.remediation.effort && (
                    <div className="modal-effort-box">
                      <p className="modal-effort-label">Effort</p>
                      <p className="modal-effort-value">
                        {vuln.remediation.effort}
                      </p>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}

// ── PRCards wrapper ───────────────────────────────────────────────────────────
export default function PRCards({
  vulnerabilities,
}: {
  vulnerabilities: Vulnerability[];
}) {
  return (
    <>
      <style>{`
        .pr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
        }
      `}</style>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Auto-Generated PRs</span>
          <button
            style={{
              fontSize: "0.75rem",
              color: "#6366f1",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            View all →
          </button>
        </div>
        <div className="pr-grid">
          {vulnerabilities.slice(0, 6).map((v, i) => (
            <PRCard key={`${v.file}-${v.line}-${i}`} vuln={v} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
