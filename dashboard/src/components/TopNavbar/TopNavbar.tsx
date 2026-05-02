"use client";

import { type AuditData } from "../../lib/api";
import { downloadReport } from "../../lib/report";

export type ApiStatus = "online" | "offline" | "checking";

interface TopNavbarProps {
  apiStatus: ApiStatus;
  auditData?: AuditData | null;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function TopNavbar({
  apiStatus,
  auditData,
  isDark,
  onToggleTheme,
}: TopNavbarProps) {
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
        .top-navbar {
          height: 60px;
          background: var(--bg-nav);
          border-bottom: 1px solid var(--border-card);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: background 0.3s, border-color 0.3s;
        }
        .top-navbar-search {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-input);
          border: 1px solid var(--border-input);
          border-radius: 9999px;
          padding: 0.4rem 1rem;
          width: 320px;
          transition: border-color 0.2s, background 0.3s;
        }
        .top-navbar-search:focus-within {
          border-color: #6366f1;
        }
        .top-navbar-search input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.875rem;
          font-family: 'Inter', sans-serif;
          width: 100%;
        }
        .top-navbar-search input::placeholder {
          color: var(--text-muted);
        }
        .top-navbar-search .material-symbols-outlined {
          font-size: 18px;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .top-navbar-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          background: var(--toggle-bg);
          border: 1px solid var(--toggle-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          color: var(--toggle-icon);
        }
        .nav-icon-btn:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
          color: var(--text-primary);
          transform: rotate(15deg);
        }
        .nav-icon-btn.no-rotate:hover {
          transform: none;
        }
        .nav-icon-btn .material-symbols-outlined {
          font-size: 18px;
        }
        .api-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .api-dot.online  { background: #10b981; box-shadow: 0 0 6px #10b981; }
        .api-dot.offline { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
        .api-dot.checking { background: #eab308; animation: blink 1s infinite; }
        .api-status-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-right: 0.5rem;
        }
        .nav-report-btn {
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-report-btn:hover {
          background: rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.5);
        }
        .nav-report-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .top-navbar-search {
            width: 180px;
          }
        }
        @media (max-width: 480px) {
          .top-navbar-search {
            display: none;
          }
        }
      `}</style>

      <header className="top-navbar">
        {/* Search */}
        <div className="top-navbar-search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Search" />
        </div>

        {/* Right side */}
        <div className="top-navbar-right">
          {/* API status */}
          <div className="api-status-label">
            <span className={`api-dot ${apiStatus}`} />
            API {apiStatus}
          </div>

          {/* Reports button */}
          <button
            className={`nav-report-btn ${!auditData ? "disabled" : ""}`}
            onClick={handleReportClick}
            title={!auditData ? "Run a scan first" : "Download PDF report"}
          >
            Reports
          </button>

          {/* Theme toggle */}
          <button
            className="nav-icon-btn"
            onClick={onToggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined">
              {isDark ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Notification bell */}
          <button className="nav-icon-btn no-rotate" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>
    </>
  );
}
