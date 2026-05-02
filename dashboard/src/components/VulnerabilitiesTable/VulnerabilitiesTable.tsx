"use client";

import { useState, useMemo } from "react";
import { type Vulnerability } from "../../lib/api";
import { SEVERITY_CONFIG } from "../styles";

type SortField = "severity" | "file" | "confidence" | "type";
type SortDirection = "asc" | "desc";

// ── Severity Badge ────────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: string }) {
  const cfg =
    SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] ??
    SEVERITY_CONFIG.LOW;
  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: 9999,
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.color}33`,
      }}
    >
      {cfg.label}
    </span>
  );
}

// ── Single expandable row ─────────────────────────────────────────────────────
function VulnRow({
  vuln,
  index,
  onCopy,
}: {
  vuln: Vulnerability;
  index: number;
  onCopy: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const cfg = SEVERITY_CONFIG[vuln.severity] ?? SEVERITY_CONFIG.LOW;

  const handleCopy = (text: string) => {
    onCopy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        className="vuln-row"
        style={{ animationDelay: `${index * 60}ms`, cursor: "pointer" }}
      >
        {/* File */}
        <td style={{ padding: "1rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flexShrink: 0,
                background: cfg.dot,
                boxShadow: `0 0 6px ${cfg.dot}`,
              }}
            />
            <code
              style={{
                fontSize: "0.875rem",
                color: "#93c5fd",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {vuln.file}
            </code>
            <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              :{vuln.line}
            </span>
          </div>
        </td>
        {/* Issue type */}
        <td
          style={{
            padding: "1rem 1.5rem",
            fontSize: "0.875rem",
            color: "#d1d5db",
          }}
        >
          {vuln.type.replace(/_/g, " ")}
        </td>
        {/* Severity */}
        <td style={{ padding: "1rem 1.5rem" }}>
          <SeverityBadge severity={vuln.severity} />
        </td>
        {/* Confidence */}
        <td style={{ padding: "1rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 9999,
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 9999,
                  width: `${vuln.confidence * 100}%`,
                  background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                whiteSpace: "nowrap",
              }}
            >
              {Math.round(vuln.confidence * 100)}%
            </span>
          </div>
        </td>
        {/* PR Fix */}
        <td style={{ padding: "1rem 1.5rem" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              color: "#34d399",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              check_circle
            </span>
            Generated
          </span>
        </td>
        {/* Expand arrow */}
        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 18,
              color: "#6b7280",
              display: "inline-block",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            expand_more
          </span>
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr
          style={{
            background: "rgba(255,255,255,0.01)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <td colSpan={6} style={{ padding: "1rem 1.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      color: "#6b7280",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Vulnerable Code
                  </p>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(vuln.code)}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <code
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    background: "rgba(0,0,0,0.4)",
                    color: "#fca5a5",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(239,68,68,0.1)",
                    fontFamily: "JetBrains Mono, monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {vuln.code}
                </code>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      color: "#6b7280",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Description
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#d1d5db" }}>
                    {vuln.description}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.6875rem",
                      color: "#6b7280",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Fix Suggestion
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#6ee7b7" }}>
                    {vuln.fix_suggestion}
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface VulnerabilitiesTableProps {
  vulnerabilities: Vulnerability[];
  total: number;
}

const FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export default function VulnerabilitiesTable({
  vulnerabilities,
  total,
}: VulnerabilitiesTableProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [sortField, setSortField] = useState<SortField>("severity");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort vulnerabilities
  const processedVulnerabilities = useMemo(() => {
    let result = vulnerabilities.filter(
      (v) => activeFilter === "ALL" || v.severity === activeFilter,
    );

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.file.toLowerCase().includes(query) ||
          v.type.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "severity":
          comparison = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
          break;
        case "file":
          comparison = a.file.localeCompare(b.file);
          break;
        case "confidence":
          comparison = a.confidence - b.confidence;
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [vulnerabilities, activeFilter, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <style>{`
        .vuln-table { width: 100%; border-collapse: collapse; }
        .vuln-table th {
          padding: 0.75rem 1.5rem;
          font-size: 0.6875rem; font-weight: 700;
          color: #4b5563; text-transform: uppercase; letter-spacing: 0.1em;
          text-align: left;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          transition: color 0.2s;
        }
        .vuln-table th:hover { color: #9ca3af; }
        .vuln-table th.sortable::after {
          content: '⇅';
          margin-left: 0.5rem;
          opacity: 0.3;
        }
        .vuln-table th.sorted-asc::after {
          content: '↑';
          opacity: 1;
          color: #6366f1;
        }
        .vuln-table th.sorted-desc::after {
          content: '↓';
          opacity: 1;
          color: #6366f1;
        }
        .vuln-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
          animation: rowIn 0.4s ease both;
        }
        .vuln-row:hover { background: rgba(255,255,255,0.03); }
        .filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .filter-tab {
          padding: 4px 12px; border-radius: 9999px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.08);
          background: transparent; color: #6b7280;
          font-family: 'Syne', sans-serif; transition: all 0.2s;
        }
        .filter-tab.active { background: #6366f1; color: #fff; border-color: #6366f1; }
        .filter-tab:not(.active):hover { color: #fff; border-color: rgba(255,255,255,0.2); }
        .search-box {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9999px;
          color: #fff;
          font-size: 0.875rem;
          font-family: 'Syne', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-box:focus { border-color: #6366f1; }
        .search-box::placeholder { color: #6b7280; }
        .empty-state {
          text-align: center; padding: 4rem 2rem; color: #374151;
        }
        .copy-btn {
          padding: 0.25rem 0.5rem;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 0.375rem;
          color: #818cf8;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Syne', sans-serif;
        }
        .copy-btn:hover {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.4);
        }

        @media (max-width: 768px) {
          .vuln-table th,
          .vuln-table td {
            padding: 0.75rem 1rem;
            font-size: 0.8125rem;
          }
          .search-box {
            width: 100%;
            min-width: auto;
          }
          .filter-tabs {
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .vuln-table {
            font-size: 0.75rem;
          }
          .vuln-table th:nth-child(4),
          .vuln-table td:nth-child(4) {
            display: none;
          }
          .vuln-table th,
          .vuln-table td {
            padding: 0.625rem 0.75rem;
          }
          .filter-tab {
            padding: 3px 10px;
            font-size: 0.65rem;
          }
        }
      `}</style>

      <div className="card">
        <div className="card-header">
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span className="card-title">Detected Vulnerabilities</span>
            <span className="count-badge">{total} Issues</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              className="search-box"
              placeholder="Search vulnerabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: "200px" }}
            />
            <div className="filter-tabs">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`filter-tab ${activeFilter === f ? "active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {processedVulnerabilities.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className="vuln-table">
              <thead>
                <tr>
                  <th
                    className={`sortable ${sortField === "file" ? `sorted-${sortDirection}` : ""}`}
                    onClick={() => handleSort("file")}
                  >
                    File
                  </th>
                  <th
                    className={`sortable ${sortField === "type" ? `sorted-${sortDirection}` : ""}`}
                    onClick={() => handleSort("type")}
                  >
                    Issue Type
                  </th>
                  <th
                    className={`sortable ${sortField === "severity" ? `sorted-${sortDirection}` : ""}`}
                    onClick={() => handleSort("severity")}
                  >
                    Severity
                  </th>
                  <th
                    className={`sortable ${sortField === "confidence" ? `sorted-${sortDirection}` : ""}`}
                    onClick={() => handleSort("confidence")}
                  >
                    Confidence
                  </th>
                  <th>PR Fix</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {processedVulnerabilities.map((v, i) => (
                  <VulnRow
                    key={`${v.file}-${v.line}-${i}`}
                    vuln={v}
                    index={i}
                    onCopy={copyToClipboard}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                display: "block",
              }}
            >
              search_off
            </span>
            <p style={{ fontSize: "0.875rem" }}>
              No vulnerabilities found for this filter.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
