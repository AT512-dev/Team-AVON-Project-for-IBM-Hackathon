"use client";

import { useState } from "react";

export type ScanMode = "demo" | "live";

interface HeroProps {
  loading: boolean;
  hasData: boolean;
  scanMode: ScanMode;
  lastAudit: string | null;
  onRunAudit: () => void;
  onScanModeChange: (mode: ScanMode) => void;
  repoUrl: string;
  onRepoUrlChange: (url: string) => void;
}

export default function Hero({
  loading,
  hasData,
  scanMode,
  lastAudit,
  onRunAudit,
  onScanModeChange,
  repoUrl,
  onRepoUrlChange,
}: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-glow" />
      <h1>
        One-Click Security
        <br />
        Audit
      </h1>
      <p>
        Detect vulnerabilities across your codebase in seconds. Powered by AI —
        zero config needed.
      </p>

      <div className="mode-toggle">
        <button
          className={`mode-btn ${scanMode === "demo" ? "active" : "inactive"}`}
          onClick={() => onScanModeChange("demo")}
        >
          DEMO
        </button>
        <button
          className={`mode-btn ${scanMode === "live" ? "active" : "inactive"}`}
          onClick={() => onScanModeChange("live")}
        >
          LIVE API
        </button>
      </div>

      {/* Repository URL Input */}
      <div className="repo-input-container">
        <span className="material-symbols-outlined repo-icon">link</span>
        <input
          type="url"
          className="repo-input"
          placeholder="Enter repository URL (e.g., https://github.com/user/repo)"
          value={repoUrl}
          onChange={(e) => onRepoUrlChange(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        className={`run-btn ${!loading && !hasData ? "pulse" : ""}`}
        onClick={onRunAudit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Scanning Codebase…
          </>
        ) : hasData ? (
          <>
            <span
              className="material-symbols-outlined"
              style={{ verticalAlign: "middle", marginRight: 8, fontSize: 18 }}
            >
              refresh
            </span>
            Re-run Audit
          </>
        ) : (
          <>
            <span
              className="material-symbols-outlined"
              style={{ verticalAlign: "middle", marginRight: 8, fontSize: 18 }}
            >
              play_arrow
            </span>
            Run Audit Now
          </>
        )}
      </button>

      {lastAudit && (
        <p className="hero-last-scan">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 14, verticalAlign: "middle", marginRight: 4 }}
          >
            history
          </span>
          Last scan at {lastAudit}
        </p>
      )}
    </section>
  );
}
