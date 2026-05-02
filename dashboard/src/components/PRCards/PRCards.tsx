"use client";

import { useState } from "react";
import { type Vulnerability, isCodeBlock } from "../../lib/api";
import { SEVERITY_CONFIG } from "../styles";

// ── Single PR Card ────────────────────────────────────────────────────────────
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
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem;
          transition: border-color 0.3s, transform 0.2s;
          animation: rowIn 0.4s ease both;
          display: flex;
          flex-direction: column;
        }
        .pr-card:hover {
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-2px);
        }
        .pr-view-btn {
          width: 100%;
          margin-top: auto;
          padding-top: 0.75rem;
          padding-bottom: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(99,102,241,0.3);
          background: transparent;
          color: #818cf8;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.75rem;
          font-family: 'Syne', sans-serif;
          transition: background 0.2s, border-color 0.2s;
        }
        .pr-view-btn:hover {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.5);
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          padding: 1rem;
        }
        .modal-box {
          background: linear-gradient(135deg, rgba(30,30,35,0.97), rgba(20,20,25,0.99));
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          width: 100%;
          max-width: 700px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }
        .modal-close-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: #9ca3af;
          font-size: 1rem;
          border-radius: 0.5rem;
          padding: 0.3rem 0.7rem;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: 'Syne', sans-serif;
        }
        .modal-close-btn:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
        .modal-section-label {
          font-size: 0.6875rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }
        .code-block {
          background: rgba(0,0,0,0.5);
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
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 0.5rem;
          padding: 1rem;
          color: #d1d5db;
          font-size: 0.875rem;
          line-height: 1.7;
        }
        .taint-flow {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
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
          color: #6b7280;
          font-size: 0.875rem;
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
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.2,
                  marginBottom: 2,
                }}
              >
                Fix {vuln.type.replace(/_/g, " ")}
              </p>
              <code
                style={{
                  fontSize: "0.7rem",
                  color: "#6b7280",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
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
          <div
            style={{
              marginBottom: "0.5rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.15)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ color: "#a5b4fc", fontSize: "0.7rem", fontWeight: 600 }}
            >
              Impact Score
            </span>
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
          <div
            style={{
              fontSize: "0.7rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
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
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            lineHeight: 1.6,
            marginBottom: "0.75rem",
            flex: 1,
          }}
        >
          {remediationText.length > 100
            ? remediationText.substring(0, 100) + "…"
            : remediationText}
        </p>

        {/* View PR button */}
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
                  <h2
                    style={{
                      color: "#fff",
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    Fix {vuln.type.replace(/_/g, " ")}
                  </h2>
                  <code
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
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

            {/* Severity + Impact row */}
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
              {vuln.cwe && (
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 9999,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#9ca3af",
                  }}
                >
                  {vuln.cwe}
                </span>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p className="modal-section-label">Description</p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#d1d5db",
                  lineHeight: 1.7,
                }}
              >
                {vuln.description}
              </p>
            </div>

            {/* Data Flow / Taint Path */}
            {taintPath?.source && (
              <div style={{ marginBottom: "1.25rem" }}>
                <p className="modal-section-label">🔍 Data Flow Analysis</p>
                <div className="taint-flow">
                  <div className="taint-row">
                    <span style={{ fontSize: "1rem" }}>🟢</span>
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Source:
                    </span>
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
                          <span
                            style={{ fontSize: "0.75rem", color: "#6b7280" }}
                          >
                            Tainted:
                          </span>
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
                    <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      Sink:
                    </span>
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

            {/* Vulnerable code */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p className="modal-section-label">Vulnerable Code</p>
              <code
                className="code-block"
                style={{
                  color: "#fca5a5",
                  borderColor: "rgba(239,68,68,0.15)",
                }}
              >
                {vuln.code}
              </code>
            </div>

            {/* AI Remediation — handles code block OR plain text */}
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

            {/* Effort + Priority (if available) */}
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
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.65rem",
                          color: "#6b7280",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 2,
                        }}
                      >
                        Priority
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        {vuln.remediation.priority}
                      </p>
                    </div>
                  )}
                  {vuln.remediation.effort && (
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.65rem",
                          color: "#6b7280",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 2,
                        }}
                      >
                        Effort
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
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
              fontFamily: "Syne, sans-serif",
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
