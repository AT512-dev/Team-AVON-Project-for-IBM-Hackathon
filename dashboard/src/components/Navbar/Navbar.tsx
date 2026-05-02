"use client";

import { useState } from "react";
import { type AuditData } from "../../lib/api";

export type ApiStatus = "online" | "offline" | "checking";

interface NavbarProps {
  apiStatus: ApiStatus;
  auditData?: AuditData | null;
}

export default function Navbar({ apiStatus, auditData }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGenerateReport = () => {
    if (!auditData) {
      alert("⚠️ No audit data available. Please run an audit first!");
      return;
    }

    // Generate a downloadable HTML report with actual data
    const summary = auditData.summary;
    const vulnerabilities = auditData.vulnerabilities || [];

    const vulnRows =
      vulnerabilities.length > 0
        ? vulnerabilities
            .map(
              (v) => `
        <tr>
          <td class="${v.severity.toLowerCase()}">${v.severity.toUpperCase()}</td>
          <td>${v.type.replace(/_/g, " ")}</td>
          <td><code>${v.file}</code></td>
          <td>${v.line}</td>
          <td>${v.description}</td>
        </tr>
      `,
            )
            .join("")
        : `<tr><td colspan="5" style="text-align: center; color: #999; padding: 40px;">No vulnerabilities found</td></tr>`;

    const reportContent = `
<!DOCTYPE html>
<html>
<head>
  <title>CodeGuard Security Audit Report</title>
  <style>
    body { font-family: Inter, sans-serif; padding: 40px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h1 { color: #1a1a1a; margin-bottom: 10px; }
    .meta { color: #666; margin-bottom: 30px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
    .metric { padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; }
    .metric-value { font-size: 32px; font-weight: bold; color: #6366f1; }
    .metric-label { color: #666; margin-top: 8px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 30px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
    th { background: #f8f9fa; font-weight: 600; }
    .critical { color: #ef4444; font-weight: 600; }
    .high { color: #f97316; font-weight: 600; }
    .medium { color: #eab308; font-weight: 600; }
    .low { color: #6b7280; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛡️ CodeGuard Security Audit Report</h1>
    <div class="meta">
      Generated: ${new Date().toLocaleString()}<br>
      Report ID: AUDIT-${Date.now()}
    </div>
    
    <h2>Executive Summary</h2>
    <div class="summary">
      <div class="metric">
        <div class="metric-value">${summary.total}</div>
        <div class="metric-label">Total Issues</div>
      </div>
      <div class="metric">
        <div class="metric-value critical">${summary.critical}</div>
        <div class="metric-label">Critical</div>
      </div>
      <div class="metric">
        <div class="metric-value high">${summary.high}</div>
        <div class="metric-label">High</div>
      </div>
      <div class="metric">
        <div class="metric-value" style="color: #10b981;">${auditData.overallScore}%</div>
        <div class="metric-label">Security Score</div>
      </div>
    </div>
    
    <h2>Severity Breakdown</h2>
    <div style="margin: 20px 0;">
      <p><span class="critical">● Critical:</span> ${summary.critical} issues</p>
      <p><span class="high">● High:</span> ${summary.high} issues</p>
      <p><span class="medium">● Medium:</span> ${summary.medium} issues</p>
      <p><span class="low">● Low:</span> ${summary.low} issues</p>
    </div>
    
    <h2>Vulnerability Details</h2>
    <table>
      <thead>
        <tr>
          <th>Severity</th>
          <th>Type</th>
          <th>File</th>
          <th>Line</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${vulnRows}
      </tbody>
    </table>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 14px;">
      <strong>CodeGuard AI</strong> - Powered by IBM WatsonX | Team AVON - IBM Hackathon 2024
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([reportContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codeguard-report-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        .top-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(5,5,8,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-content {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          width: 100%;
        }
        .logo {
          font-size: 1.125rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links { display: flex; gap: 2rem; }
        .nav-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          padding: 0.5rem 0;
          border-bottom: 2px solid transparent;
        }
        .nav-link:hover {
          color: #fff;
          border-bottom-color: rgba(163, 180, 252, 0.3);
        }
        .nav-link.active {
          color: #a5b4fc;
          border-bottom-color: #a5b4fc;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          padding: 8px;
        }
        .hamburger span {
          width: 20px;
          height: 2px;
          background: #9ca3af;
          transition: all 0.3s;
          border-radius: 2px;
        }
        .hamburger:hover span { background: #fff; }
        .mobile-menu {
          display: none;
          position: absolute;
          top: 64px;
          left: 0;
          right: 0;
          background: rgba(5,5,8,0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 1rem 2rem;
          flex-direction: column;
          gap: 1rem;
        }
        .mobile-menu.open { display: flex; }
        .api-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .api-dot.online  { background: #10b981; box-shadow: 0 0 6px #10b981; }
        .api-dot.offline { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
        .api-dot.checking { background: #eab308; animation: blink 1s infinite; }

        @media (max-width: 768px) {
          .top-nav { padding: 0 1rem; }
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .nav-content { gap: 1rem; }
        }

        @media (max-width: 640px) {
          .top-nav { height: 56px; }
          .logo { font-size: 1rem; }
        }
      `}</style>

      <nav className="top-nav">
        <div className="nav-content">
          <span className="logo">⬡ CodeGuard</span>
          <div className="nav-links">
            <span className="nav-link active">Dashboard</span>
            <span className="nav-link" onClick={handleGenerateReport}>
              Reports
            </span>
            <span
              className="nav-link"
              onClick={() => alert("Settings panel coming soon!")}
            >
              Settings
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              color: "#6b7280",
            }}
          >
            <span className={`api-dot ${apiStatus}`} />
            API {apiStatus}
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, color: "#fff" }}
            >
              person
            </span>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <span className="nav-link active">Dashboard</span>
          <span className="nav-link" onClick={handleGenerateReport}>
            Reports
          </span>
          <span
            className="nav-link"
            onClick={() => alert("Settings panel coming soon!")}
          >
            Settings
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              color: "#6b7280",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className={`api-dot ${apiStatus}`} />
            API {apiStatus}
          </div>
        </div>
      </nav>
    </>
  );
}
