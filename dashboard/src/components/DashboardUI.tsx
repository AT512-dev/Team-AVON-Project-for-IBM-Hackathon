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

  // ── API health check ─────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/health`,
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

      console.log("AUDIT RESULT:", result); // 🔥 debug
      console.log(
        "FIRST VULN RAW:",
        JSON.stringify(result.data.vulnerabilities[0], null, 2),
      );

      if (result?.success && result?.data) {
        setAuditData(result.data);
        setLastAudit(new Date().toLocaleTimeString());

        try {
          const m = await getMetrics();
          if (m?.success && m?.data) {
            setMetrics(m.data);
          }
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

  // ── SAFE DATA NORMALIZATION (IMPORTANT) ───────────────────────────
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

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div className="dashboard-root">
        <div className="content">
          {/* Navbar */}
          <Navbar apiStatus={apiStatus} auditData={auditData} />

          {/* Hero */}
          <Hero
            loading={loading}
            hasData={!!auditData}
            scanMode={scanMode}
            lastAudit={lastAudit}
            onRunAudit={handleRunAudit}
            onScanModeChange={setScanMode}
          />

          <div className="main-grid">
            {/* Error */}
            {error && <ErrorBanner message={error} />}

            {auditData ? (
              <>
                {/* Metrics */}
                <MetricsRow
                  auditData={auditData}
                  metrics={metrics}
                  beforeScore={beforeScore}
                />

                {/* Score + Severity */}
                <div className="split-row">
                  <ScoreComparison
                    beforeScore={beforeScore}
                    afterScore={afterScore}
                  />
                  <SeverityBreakdown summary={summary} impact={impact} />
                </div>

                {/* Table */}
                <VulnerabilitiesTable
                  vulnerabilities={vulnerabilities}
                  total={summary.total}
                />

                {/* PR Cards */}
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
