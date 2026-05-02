"use client";

import { type AuditData } from "../../lib/api";
import { downloadReport } from "../../lib/report";

export type ApiStatus = "online" | "offline" | "checking";

interface NavbarProps {
  apiStatus: ApiStatus;
  auditData?: AuditData | null;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({
  apiStatus,
  auditData,
  isDark,
  onToggleTheme,
}: NavbarProps) {
  const handleReportClick = () => {
    if (!auditData) {
      alert("Run a scan first to generate a report.");
      return;
    }
    downloadReport(auditData);
  };

  return (
    <>
      <style>{`
        .top-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--bg-nav);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-card);
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .logo {
          font-size: 1.125rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-links { display: flex; gap: 2rem; }
        .nav-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          padding: 0;
        }
        .nav-link:hover { color: var(--text-primary); }
        .nav-link.active { color: #6366f1; }
        .nav-link.disabled { opacity: 0.4; cursor: not-allowed; }
        .api-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .api-dot.online  { background: #10b981; box-shadow: 0 0 6px #10b981; }
        .api-dot.offline { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
        .api-dot.checking { background: #eab308; animation: blink 1s infinite; }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .api-status-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      <nav className="top-nav">
        {/* Left — logo + nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          <span className="logo">⬡ CodeGuard</span>
          <div className="nav-links">
            <span className="nav-link active">Dashboard</span>
            <button
              className={`nav-link ${!auditData ? "disabled" : ""}`}
              onClick={handleReportClick}
              title={!auditData ? "Run a scan first" : "Download JSON report"}
            >
              Reports
            </button>
            <span className="nav-link">Settings</span>
          </div>
        </div>

        {/* Right — api status + theme toggle + avatar */}
        <div className="nav-right">
          <div className="api-status-label">
            <span className={`api-dot ${apiStatus}`} />
            API {apiStatus}
          </div>

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <div className="user-avatar">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, color: "#fff" }}
            >
              person
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
