"use client";

import { useState } from "react";
import { type ActiveView } from "../DashboardUI";
import { type ScanMode } from "../Hero/Hero";

type NavItem = {
  label: string;
  icon: string;
  key: ActiveView;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", key: "dashboard" },
  { label: "Vulnerabilities", icon: "bug_report", key: "vulnerabilities" },
  { label: "Generated PRs", icon: "code", key: "generated-prs" },
];

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  isDark: boolean;
  onRunAudit: () => void;
  loading: boolean;
  scanMode: ScanMode;
  onScanModeChange: (mode: ScanMode) => void;
  hasData: boolean;
}

export default function Sidebar({
  activeView,
  onViewChange,
  isDark,
  onRunAudit,
  loading,
  scanMode,
  onScanModeChange,
  hasData,
}: SidebarProps) {
  return (
    <>
      <style>{`
        .sidebar {
          width: 220px;
          min-width: 220px;
          height: 100vh;
          position: sticky;
          top: 0;
          background: ${isDark ? "rgba(139, 92, 246, 0.08)" : "#ffffff"};
          backdrop-filter: ${isDark ? "blur(20px)" : "none"};
          -webkit-backdrop-filter: ${isDark ? "blur(20px)" : "none"};
          border-right: ${
            isDark ? "1px solid rgba(139, 92, 246, 0.2)" : "1px solid #e2e8f0"
          };
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
          z-index: 100;
          flex-shrink: 0;
          transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
        }
        .sidebar-logo {
          font-size: 1.25rem;
          font-weight: 800;
          color: ${isDark ? "#ffffff" : "#1e293b"};
          padding: 0 1.5rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          transition: color 0.3s;
          cursor: pointer;
          user-select: none;
        }
        .sidebar-logo:hover {
          color: ${isDark ? "#c4b5fd" : "#6366f1"};
        }
        .sidebar-logo span {
          color: ${isDark ? "#a5b4fc" : "#6366f1"};
        }
        .sidebar-mode-toggle {
          display: flex;
          background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
          border: 1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          border-radius: 9999px;
          padding: 3px;
          margin: 0 1.5rem 1.5rem;
          gap: 2px;
        }
        .sidebar-mode-btn {
          flex: 1;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
        }
        .sidebar-mode-btn.active {
          background: #6366f1;
          color: #fff;
        }
        .sidebar-mode-btn.inactive {
          background: transparent;
          color: ${isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"};
        }
        .sidebar-mode-btn.inactive:hover {
          color: ${isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)"};
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0 0.75rem;
          flex: 1;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          border: none;
          background: transparent;
          color: ${isDark ? "rgba(255,255,255,0.7)" : "rgba(30,41,59,0.7)"};
          font-size: 0.875rem;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s, color 0.2s, opacity 0.2s;
          text-align: left;
          width: 100%;
        }
        .sidebar-item:hover:not(:disabled) {
          background: ${isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.08)"};
          color: ${isDark ? "#ffffff" : "#1e293b"};
        }
        .sidebar-item.active {
          background: ${isDark ? "rgba(255,255,255,0.18)" : "rgba(99,102,241,0.15)"};
          color: ${isDark ? "#ffffff" : "#6366f1"};
          font-weight: 600;
        }
        .sidebar-item:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .sidebar-item .material-symbols-outlined {
          font-size: 20px;
          opacity: 0.9;
        }
        .sidebar-rerun-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.625rem 0.75rem;
          margin: 0.5rem 0.75rem 0;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(99,102,241,0.3)"};
          background: ${isDark ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.05)"};
          color: ${isDark ? "rgba(255,255,255,0.9)" : "#6366f1"};
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
          text-align: center;
          width: calc(100% - 1.5rem);
        }
        .sidebar-rerun-btn:hover:not(:disabled) {
          background: ${isDark ? "rgba(255,255,255,0.12)" : "rgba(99,102,241,0.12)"};
          border-color: ${isDark ? "rgba(255,255,255,0.3)" : "rgba(99,102,241,0.5)"};
          transform: translateY(-1px);
        }
        .sidebar-rerun-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .sidebar-rerun-btn .material-symbols-outlined {
          font-size: 18px;
        }
        .sidebar-bottom {
          padding: 0 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          border-top: 1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(30,41,59,0.1)"};
          padding-top: 1rem;
          margin: 0 0.75rem;
        }
        .sidebar-bottom-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 10px;
          cursor: pointer;
          border: none;
          background: transparent;
          color: ${isDark ? "rgba(255,255,255,0.6)" : "rgba(30,41,59,0.6)"};
          font-size: 0.875rem;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s, color 0.2s;
          text-align: left;
          width: 100%;
        }
        .sidebar-bottom-item:hover {
          background: ${isDark ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.08)"};
          color: ${isDark ? "#ffffff" : "#1e293b"};
        }
        .sidebar-bottom-item .material-symbols-outlined {
          font-size: 20px;
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>

      <aside className="sidebar">
        {/* Logo - clickable to go to dashboard */}
        <div
          className="sidebar-logo"
          onClick={() => onViewChange("dashboard")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onViewChange("dashboard")}
        >
          Codeguard<span>.</span>
        </div>

        {/* Mode toggle */}
        <div className="sidebar-mode-toggle">
          <button
            className={`sidebar-mode-btn ${scanMode === "demo" ? "active" : "inactive"}`}
            onClick={() => onScanModeChange("demo")}
          >
            Demo
          </button>
          <button
            className={`sidebar-mode-btn ${scanMode === "live" ? "active" : "inactive"}`}
            onClick={() => onScanModeChange("live")}
          >
            Live
          </button>
        </div>

        {/* Nav items */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`sidebar-item ${activeView === item.key ? "active" : ""}`}
              onClick={() => onViewChange(item.key)}
              disabled={!hasData}
              title={!hasData ? "Run an audit first to view this section" : ""}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}

          {/* Re-run audit button */}
          <button
            className="sidebar-rerun-btn"
            onClick={onRunAudit}
            disabled={loading || !hasData}
            title={
              !hasData
                ? "Run an audit first"
                : loading
                  ? "Scanning..."
                  : "Re-run the security audit"
            }
          >
            <span className="material-symbols-outlined">
              {loading ? "hourglass_empty" : "refresh"}
            </span>
            {loading ? "Scanning..." : "Re-run Audit"}
          </button>
        </nav>

        {/* Bottom items */}
        <div className="sidebar-bottom">
          <button className="sidebar-bottom-item">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </button>
          <button className="sidebar-bottom-item">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
