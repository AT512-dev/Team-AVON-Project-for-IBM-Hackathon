"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getDemoAudit,
  runAudit,
  getMetrics,
  type AuditData,
  type MetricsData,
} from "../lib/api";
import { GLOBAL_STYLES } from "./styles";

import Navbar, { type ApiStatus } from "./Navbar/Navbar";
import Hero, { type ScanMode } from "./Hero/Hero";
import ErrorBanner from "./ErrorBanner/ErrorBanner";
import MetricsRow from "./MetricsRow/MetricsRow";
import ScoreComparison from "./ScoreComparison/ScoreComparison";
import SeverityBreakdown from "./SeverityBreakdown/SeverityBreakdown";
import VulnerabilitiesTable from "./VulnerabilitiesTable/VulnerabilitiesTable";
import PRCards from "./PRCards/PRCards";
import EmptyState from "./EmptyState/EmptyState";

export default function DashboardUI() {
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("demo");
  const [lastAudit, setLastAudit] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

  // ── Theme state — read localStorage before first render to avoid flash ──
  // ── Theme state ──────────────────────────────────────────────────
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // ── Read theme from localStorage after mount ─────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved !== "light";
    setIsDark(dark);
    document.body.classList.toggle("light", !dark);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.body.classList.toggle("light", !next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  // ── API health check ─────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001"}/health`,
        );
        setApiStatus(res.ok ? "online" : "offline");
      } catch {
        setApiStatus("offline");
      }
    };
    check();
  }, []);

  // ── Run audit ────────────────────────────────────────────────────
  const handleRunAudit = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result =
        scanMode === "demo" || apiStatus === "offline"
          ? await getDemoAudit()
          : await runAudit([
              {
                file: "routes/user.js",
                content: `const express = require('express');
const db = require('./db');
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  db.query(\`SELECT * FROM users WHERE id = '\${userId}'\`, (err, rows) => {
    res.json(rows);
  });
});`,
              },
            ]);

      if (result?.success && result?.data) {
        setAuditData(result.data);
        setLastAudit(new Date().toLocaleTimeString());
        try {
          const m = await getMetrics();
          if (m?.success && m?.data) setMetrics(m.data);
        } catch {
          // metrics optional
        }
      } else {
        setError("Audit failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Cannot reach API. Switch to Demo mode or check backend server.",
      );
    } finally {
      setLoading(false);
    }
  }, [scanMode, apiStatus]);

  // ── Safe data normalization ──────────────────────────────────────
  const summary = auditData?.summary ?? {
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  const impact = auditData?.impact ?? {
    time_saved_minutes: 0,
    time_saved_hours: 0,
    manual_review_cost: "$0",
    automated_cost: "$0",
    savings: "$0",
  };
  const vulnerabilities = auditData?.vulnerabilities ?? [];

  // ── Derived values ────────────────────────────────────────────────
  const beforeScore = 100 - summary.total * 8;
  const afterScore = auditData?.overallScore ?? 92;

  // ── Before the return, add this ──────────────────────────────────
  if (isDark === null) return null;

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div className={`dashboard-root ${isDark ? "" : "light"}`}>
        <div
          className="content"
          style={{ maxWidth: "1400px", margin: "0 auto", width: "100%" }}
        >
          <Navbar
            apiStatus={apiStatus}
            auditData={auditData}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />

          <Hero
            loading={loading}
            hasData={!!auditData}
            scanMode={scanMode}
            lastAudit={lastAudit}
            onRunAudit={handleRunAudit}
            onScanModeChange={setScanMode}
          />

          <div className="main-grid">
            {error && <ErrorBanner message={error} />}

            {auditData ? (
              <>
                <MetricsRow
                  auditData={auditData}
                  metrics={metrics}
                  beforeScore={beforeScore}
                />

                <div className="split-row">
                  <ScoreComparison
                    beforeScore={beforeScore}
                    afterScore={afterScore}
                  />
                  <SeverityBreakdown summary={summary} impact={impact} />
                </div>

                <VulnerabilitiesTable
                  vulnerabilities={vulnerabilities}
                  total={summary.total}
                />

                {vulnerabilities.length > 0 && (
                  <PRCards vulnerabilities={vulnerabilities} />
                )}
              </>
            ) : (
              !loading && <EmptyState />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
