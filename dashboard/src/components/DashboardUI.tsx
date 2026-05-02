"use client";

import { useState, useEffect, useCallback } from "react";
import {
  runUnifiedScan,
  getMetrics,
  type AuditData,
  type MetricsData,
} from "../lib/api";
import { GLOBAL_STYLES } from "./styles";

import Sidebar from "./Sidebar/Sidebar";
import TopNavbar, { type ApiStatus } from "./TopNavbar/TopNavbar";
import Hero, { type ScanMode } from "./Hero/Hero";
import ErrorBanner from "./ErrorBanner/ErrorBanner";
import MetricsRow from "./MetricsRow/MetricsRow";
import ScoreComparison from "./ScoreComparison/ScoreComparison";
import SeverityBreakdown from "./SeverityBreakdown/SeverityBreakdown";
import VulnerabilitiesTable from "./VulnerabilitiesTable/VulnerabilitiesTable";
import PRCards from "./PRCards/PRCards";
import EmptyState from "./EmptyState/EmptyState";

export type ActiveView = "dashboard" | "vulnerabilities" | "generated-prs";

export default function DashboardUI() {
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("demo");
  const [lastAudit, setLastAudit] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [repoUrl, setRepoUrl] = useState<string>("");

  // ── Theme state ──────────────────────────────────────────────────
  const [isDark, setIsDark] = useState<boolean | null>(null);

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
      const isDemo = scanMode === "demo";

      // Live mode: validate URL before hitting the backend
      if (!isDemo) {
        if (!repoUrl || !repoUrl.trim()) {
          setError(
            "Live mode requires a repository URL. Enter a GitHub or GitLab URL above.",
          );
          setLoading(false);
          return;
        }
        const urlPattern =
          /^https:\/\/(github\.com|gitlab\.com|bitbucket\.org)\//i;
        if (!urlPattern.test(repoUrl.trim())) {
          setError(
            "Invalid URL. Please enter a valid GitHub, GitLab, or Bitbucket HTTPS repository URL.",
          );
          setLoading(false);
          return;
        }
      }

      // Route to the correct backend path via the unified /api/v1/scan endpoint
      const result = await runUnifiedScan({
        isDemoMode: isDemo,
        repoUrl: isDemo ? undefined : repoUrl.trim(),
        includeRemediation: false,
      });

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
    } catch (err: unknown) {
      console.error(err);
      // Surface the real backend error (clone failure, invalid URL, etc.)
      const message =
        err instanceof Error
          ? err.message
          : "Cannot reach API. Switch to Demo mode or check backend server.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [scanMode, repoUrl, apiStatus]);

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

  const beforeScore = 100 - summary.total * 8;
  const afterScore = auditData?.overallScore ?? 92;

  if (isDark === null) return null;

  return (
    <>
      <style>{`
        ${GLOBAL_STYLES}
        .app-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
        .page-content {
          flex: 1;
          overflow-y: auto;
          position: relative;
        }
        .page-content-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 2rem 4rem;
        }
      `}</style>

      <div className={`dashboard-root ${isDark ? "" : "light"}`}>
        <div className="app-shell">
          {/* ── Sidebar ── */}
          <Sidebar
            activeView={activeView}
            onViewChange={setActiveView}
            isDark={isDark}
            onRunAudit={handleRunAudit}
            loading={loading}
            scanMode={scanMode}
            onScanModeChange={setScanMode}
            hasData={!!auditData}
            repoUrl={repoUrl}
            onRepoUrlChange={setRepoUrl}
          />

          {/* ── Main area ── */}
          <div className="main-area">
            {/* ── Top Navbar ── */}
            <TopNavbar
              apiStatus={apiStatus}
              auditData={auditData}
              isDark={isDark}
              onToggleTheme={toggleTheme}
            />

            {/* ── Page content ── */}
            <div className="page-content">
              <div className="page-content-inner">
                {/* Show Hero only if no audit data yet */}
                {!auditData && (
                  <Hero
                    loading={loading}
                    hasData={!!auditData}
                    scanMode={scanMode}
                    lastAudit={lastAudit}
                    onRunAudit={handleRunAudit}
                    onScanModeChange={setScanMode}
                    repoUrl={repoUrl}
                    onRepoUrlChange={setRepoUrl}
                  />
                )}

                <div className="main-grid" style={{ padding: 0 }}>
                  {error && <ErrorBanner message={error} />}

                  {auditData ? (
                    <>
                      {/* Dashboard view - show only metrics and charts */}
                      {activeView === "dashboard" && (
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
                            <SeverityBreakdown
                              summary={summary}
                              impact={impact}
                            />
                          </div>
                        </>
                      )}

                      {/* Vulnerabilities view - show only table */}
                      {activeView === "vulnerabilities" && (
                        <VulnerabilitiesTable
                          vulnerabilities={vulnerabilities}
                          total={summary.total}
                        />
                      )}

                      {/* Generated PRs view - show only PR cards */}
                      {activeView === "generated-prs" &&
                        vulnerabilities.length > 0 && (
                          <PRCards vulnerabilities={vulnerabilities} />
                        )}

                      {/* Empty state for PRs if no vulnerabilities */}
                      {activeView === "generated-prs" &&
                        vulnerabilities.length === 0 && (
                          <div
                            style={{
                              padding: "4rem 2rem",
                              textAlign: "center",
                              color: "var(--text-muted)",
                            }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 48, opacity: 0.3 }}
                            >
                              code_off
                            </span>
                            <p style={{ marginTop: "1rem" }}>
                              No vulnerabilities found. No PRs to generate.
                            </p>
                          </div>
                        )}
                    </>
                  ) : (
                    !loading && <EmptyState />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
