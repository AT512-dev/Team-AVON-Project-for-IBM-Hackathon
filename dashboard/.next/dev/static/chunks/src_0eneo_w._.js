(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkHealth",
    ()=>checkHealth,
    "getDemoAudit",
    ()=>getDemoAudit,
    "getMetrics",
    ()=>getMetrics,
    "getVulnerabilities",
    ()=>getVulnerabilities,
    "runAudit",
    ()=>runAudit,
    "runAuditWithRemediation",
    ()=>runAuditWithRemediation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000";
/**
 * Transform backend response to match frontend interface
 * Backend uses scan_summary, we use summary
 */ function transformAuditResponse(backendData) {
    // Handle both backend formats (scan_summary and summary)
    const scanSummary = backendData.scan_summary || backendData.summary;
    const totalIssues = scanSummary?.total_issues ?? scanSummary?.total ?? 0;
    // Calculate impact metrics
    const estimatedSavings = backendData.impact?.estimated_savings_usd || 18500;
    const manualMinutes = totalIssues * 15;
    const automatedMinutes = 2;
    const savedMinutes = manualMinutes - automatedMinutes;
    return {
        vulnerabilities: backendData.vulnerabilities || [],
        summary: {
            total: totalIssues,
            critical: scanSummary?.critical || 0,
            high: scanSummary?.high || 0,
            medium: scanSummary?.medium || 0,
            low: scanSummary?.low || 0
        },
        impact: {
            time_saved_minutes: savedMinutes,
            time_saved_hours: Math.round(savedMinutes / 60 * 10) / 10,
            manual_review_cost: `$${Math.round(manualMinutes * 2.5)}`,
            automated_cost: "$5",
            savings: `$${Math.round(manualMinutes * 2.5 - 5)}`
        },
        overallScore: backendData.overallScore || 92,
        auditTimestamp: backendData.auditTimestamp || new Date().toISOString(),
        remediation: backendData.remediation
    };
}
async function checkHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    return res.json();
}
async function runAudit(files) {
    const res = await fetch(`${BASE_URL}/api/v1/audit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            files
        })
    });
    const json = await res.json();
    if (json.success && json.data) {
        json.data = transformAuditResponse(json.data);
    }
    return json;
}
async function runAuditWithRemediation(files) {
    const res = await fetch(`${BASE_URL}/api/v1/audit/remediation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            files
        })
    });
    const json = await res.json();
    if (json.success && json.data) {
        json.data = transformAuditResponse(json.data);
    }
    return json;
}
async function getDemoAudit() {
    const res = await fetch(`${BASE_URL}/api/v1/demo`);
    const json = await res.json();
    if (json.success && json.data) {
        json.data = transformAuditResponse(json.data);
    }
    return json;
}
async function getVulnerabilities(severity) {
    const res = await fetch(`${BASE_URL}/api/v1/vulnerabilities/${severity}`);
    return res.json();
}
async function getMetrics() {
    const res = await fetch(`${BASE_URL}/api/v1/metrics`);
    return res.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/styles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GLOBAL_STYLES",
    ()=>GLOBAL_STYLES,
    "SEVERITY_CONFIG",
    ()=>SEVERITY_CONFIG
]);
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #050508;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .dashboard-root {
    min-height: 100vh;
    background: #050508;
    color: #e2e8f0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .dashboard-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .content { position: relative; z-index: 1; }

  .main-grid {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .split-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    overflow: hidden;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .card-title {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .count-badge {
    background: rgba(239,68,68,0.12);
    color: #f87171;
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 9999px;
    padding: 2px 10px;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-weight: normal;
    font-style: normal;
    font-size: 20px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
  }

  .font-mono { font-family: 'JetBrains Mono', monospace; }

  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  @media (max-width: 768px) {
    .split-row { grid-template-columns: 1fr; }
    .main-grid { padding: 0 1rem 2rem; }
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }

  @media (max-width: 640px) {
    .main-grid { padding: 0 0.75rem 1.5rem; }
    .card { border-radius: 16px; }
    .card-header { padding: 1rem; }
  }
`;
const SEVERITY_CONFIG = {
    CRITICAL: {
        label: "Critical",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.12)",
        dot: "#ef4444"
    },
    HIGH: {
        label: "High",
        color: "#f97316",
        bg: "rgba(249,115,22,0.12)",
        dot: "#f97316"
    },
    MEDIUM: {
        label: "Medium",
        color: "#eab308",
        bg: "rgba(234,179,8,0.12)",
        dot: "#eab308"
    },
    LOW: {
        label: "Low",
        color: "#6b7280",
        bg: "rgba(107,114,128,0.12)",
        dot: "#6b7280"
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Navbar/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function Navbar({ apiStatus, auditData }) {
    _s();
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleGenerateReport = ()=>{
        if (!auditData) {
            alert("⚠️ No audit data available. Please run an audit first!");
            return;
        }
        // Generate a downloadable HTML report with actual data
        const summary = auditData.summary;
        const vulnerabilities = auditData.vulnerabilities || [];
        const vulnRows = vulnerabilities.length > 0 ? vulnerabilities.map((v)=>`
        <tr>
          <td class="${v.severity.toLowerCase()}">${v.severity.toUpperCase()}</td>
          <td>${v.type.replace(/_/g, " ")}</td>
          <td><code>${v.file}</code></td>
          <td>${v.line}</td>
          <td>${v.description}</td>
        </tr>
      `).join("") : `<tr><td colspan="5" style="text-align: center; color: #999; padding: 40px;">No vulnerabilities found</td></tr>`;
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
        const blob = new Blob([
            reportContent
        ], {
            type: "text/html"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `codeguard-report-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
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
      `
            }, void 0, false, {
                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "top-nav",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "nav-content",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "logo",
                                children: "⬡ CodeGuard"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "nav-links",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "nav-link active",
                                        children: "Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                        lineNumber: 243,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "nav-link",
                                        onClick: handleGenerateReport,
                                        children: "Reports"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                        lineNumber: 244,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "nav-link",
                                        onClick: ()=>alert("Settings panel coming soon!"),
                                        children: "Settings"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                        lineNumber: 247,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "hamburger",
                                onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                "aria-label": "Toggle menu",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                        lineNumber: 262,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                        lineNumber: 263,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "0.75rem",
                                    color: "#6b7280"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `api-dot ${apiStatus}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this),
                                    "API ",
                                    apiStatus
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined",
                                    style: {
                                        fontSize: 16,
                                        color: "#fff"
                                    },
                                    children: "person"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                    lineNumber: 289,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `mobile-menu ${mobileMenuOpen ? "open" : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "nav-link active",
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "nav-link",
                                onClick: handleGenerateReport,
                                children: "Reports"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 301,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "nav-link",
                                onClick: ()=>alert("Settings panel coming soon!"),
                                children: "Settings"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "0.75rem",
                                    color: "#6b7280",
                                    paddingTop: "0.5rem",
                                    borderTop: "1px solid rgba(255,255,255,0.06)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `api-dot ${apiStatus}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this),
                                    "API ",
                                    apiStatus
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                                lineNumber: 310,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar/Navbar.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar/Navbar.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Navbar, "d7gXMF6mPDUhHBNUSEb8mLK4AII=");
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Hero/Hero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function Hero({ loading, hasData, scanMode, lastAudit, onRunAudit, onScanModeChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .hero {
          text-align: center;
          padding: 5rem 2rem 4rem;
          position: relative;
        }
        .hero-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse at center top, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero h1 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .hero p {
          color: #6b7280;
          font-size: 1rem;
          max-width: 480px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .mode-toggle {
          display: inline-flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9999px;
          padding: 4px;
          margin-bottom: 1.5rem;
        }
        .mode-btn {
          padding: 6px 18px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .mode-btn.active  { background: #6366f1; color: #fff; }
        .mode-btn.inactive { background: transparent; color: #6b7280; }
        .run-btn {
          position: relative;
          padding: 1rem 3rem;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          border: none;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          transition: all 0.3s;
        }
        .run-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.4);
        }
        .run-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .run-btn.pulse { animation: btn-pulse 2s infinite; }
        @keyframes btn-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          70%  { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }

        @media (max-width: 768px) {
          .hero { padding: 3rem 1.5rem 3rem; }
          .hero h1 { font-size: 2rem; margin-bottom: 0.75rem; }
          .hero p { font-size: 0.875rem; margin-bottom: 2rem; }
          .run-btn { padding: 0.875rem 2rem; font-size: 0.9375rem; }
          .mode-toggle { margin-bottom: 1.25rem; }
        }

        @media (max-width: 640px) {
          .hero { padding: 2rem 1rem 2.5rem; }
          .hero h1 { font-size: 1.75rem; }
          .hero p { font-size: 0.8125rem; max-width: 100%; }
          .run-btn {
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
            width: 100%;
            max-width: 320px;
          }
          .mode-btn { padding: 5px 14px; font-size: 0.6875rem; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/src/components/Hero/Hero.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "hero",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hero-glow"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: [
                            "One-Click Security",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/components/Hero/Hero.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            "Audit"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Detect vulnerabilities across your codebase in seconds. Powered by AI — zero config needed."
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mode-toggle",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `mode-btn ${scanMode === "demo" ? "active" : "inactive"}`,
                                onClick: ()=>onScanModeChange("demo"),
                                children: "DEMO"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero/Hero.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `mode-btn ${scanMode === "live" ? "active" : "inactive"}`,
                                onClick: ()=>onScanModeChange("live"),
                                children: "LIVE API"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero/Hero.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `run-btn ${!loading && !hasData ? "pulse" : ""}`,
                        onClick: onRunAudit,
                        disabled: loading,
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "spinner"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Hero/Hero.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this),
                                "Scanning Codebase…"
                            ]
                        }, void 0, true) : hasData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined",
                                    style: {
                                        verticalAlign: "middle",
                                        marginRight: 8,
                                        fontSize: 18
                                    },
                                    children: "refresh"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Hero/Hero.tsx",
                                    lineNumber: 173,
                                    columnNumber: 15
                                }, this),
                                "Re-run Audit"
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined",
                                    style: {
                                        verticalAlign: "middle",
                                        marginRight: 8,
                                        fontSize: 18
                                    },
                                    children: "play_arrow"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Hero/Hero.tsx",
                                    lineNumber: 187,
                                    columnNumber: 15
                                }, this),
                                "Run Audit Now"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    lastAudit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            marginTop: "1rem",
                            fontSize: "0.75rem",
                            color: "#4b5563"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined",
                                style: {
                                    fontSize: 14,
                                    verticalAlign: "middle",
                                    marginRight: 4
                                },
                                children: "history"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Hero/Hero.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this),
                            "Last scan at ",
                            lastAudit
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Hero/Hero.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Hero/Hero.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ErrorBanner/ErrorBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ErrorBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function ErrorBanner({ message }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .error-banner {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          color: #fca5a5;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
      `
            }, void 0, false, {
                fileName: "[project]/src/components/ErrorBanner/ErrorBanner.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "error-banner",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "material-symbols-outlined",
                        children: "error"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ErrorBanner/ErrorBanner.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    message
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ErrorBanner/ErrorBanner.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = ErrorBanner;
var _c;
__turbopack_context__.k.register(_c, "ErrorBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/MetricsRow/MetricsRow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MetricsRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
// Animated counter hook
function useCountUp(end, duration = 1000) {
    _s();
    const [count, setCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCountUp.useEffect": ()=>{
            let startTime;
            let animationFrame;
            const animate = {
                "useCountUp.useEffect.animate": (currentTime)=>{
                    if (!startTime) startTime = currentTime;
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    // Easing function for smooth animation
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    setCount(Math.floor(end * easeOutQuart));
                    if (progress < 1) {
                        animationFrame = requestAnimationFrame(animate);
                    } else {
                        setCount(end);
                    }
                }
            }["useCountUp.useEffect.animate"];
            animationFrame = requestAnimationFrame(animate);
            return ({
                "useCountUp.useEffect": ()=>cancelAnimationFrame(animationFrame)
            })["useCountUp.useEffect"];
        }
    }["useCountUp.useEffect"], [
        end,
        duration
    ]);
    return count;
}
_s(useCountUp, "/xL7qdScToREtqzbt5GZ1kHtYjQ=");
function MetricCard({ label, value, icon, accent, tooltip, trend }) {
    _s1();
    const [showTooltip, setShowTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .metric-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          overflow: hidden;
          transition: border-color 0.3s, transform 0.2s, box-shadow 0.3s;
          cursor: pointer;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent, #6366f1);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .metric-glow {
          position: absolute;
          top: -20px; left: -20px;
          width: 80px; height: 80px;
          background: radial-gradient(circle, var(--accent, #6366f1) 0%, transparent 70%);
          opacity: 0.12;
          pointer-events: none;
        }
        .metric-icon { font-size: 1.5rem; color: var(--accent, #6366f1); flex-shrink: 0; }
        .metric-value {
          font-size: 1.5rem; font-weight: 800; color: #fff;
          letter-spacing: -0.03em; line-height: 1; margin-bottom: 2px;
        }
        .metric-label {
          font-size: 0.7rem; font-weight: 600; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .metrics-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .metric-card {
            padding: 1rem;
          }
          .metric-value { font-size: 1.25rem; }
          .metric-label { font-size: 0.65rem; }
        }

        @media (max-width: 640px) {
          .metrics-row {
            grid-template-columns: 1fr;
          }
        }
        .metric-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: rgba(0,0,0,0.9);
          color: #fff;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 10;
        }
        .metric-card:hover .metric-tooltip {
          opacity: 1;
        }
        .trend-indicator {
          font-size: 0.875rem;
          margin-left: 0.25rem;
        }
        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }
      `
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "metric-card",
                style: {
                    "--accent": accent
                },
                onMouseEnter: ()=>setShowTooltip(true),
                onMouseLeave: ()=>setShowTooltip(false),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-glow"
                    }, void 0, false, {
                        fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    tooltip && showTooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "metric-tooltip",
                        children: tooltip
                    }, void 0, false, {
                        fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "metric-icon material-symbols-outlined",
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "metric-value",
                                children: [
                                    value,
                                    trend && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `trend-indicator trend-${trend}`,
                                        children: trend === "up" ? "↑" : "↓"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "metric-label",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s1(MetricCard, "MlKqB7CDspaiqeinDL2ipSY+OVU=");
_c = MetricCard;
function MetricsRow({ auditData, metrics, beforeScore }) {
    _s2();
    const afterScore = auditData.overallScore ?? 92;
    const animatedBefore = useCountUp(Math.max(10, beforeScore), 1200);
    const animatedAfter = useCountUp(afterScore, 1200);
    const animatedHours = useCountUp(Math.floor(auditData.impact.time_saved_hours * 10) / 10, 1000);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "metrics-row",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                label: "Score Before",
                value: `${animatedBefore}%`,
                icon: "trending_down",
                accent: "#ef4444",
                tooltip: "Security score before fixes",
                trend: "down"
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                label: "Score After",
                value: `${animatedAfter}%`,
                icon: "trending_up",
                accent: "#10b981",
                tooltip: "Projected score after applying fixes",
                trend: "up"
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                label: "Time Saved",
                value: `${(animatedHours / 10).toFixed(1)}h`,
                icon: "schedule",
                accent: "#6366f1",
                tooltip: "Time saved vs manual code review"
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                label: "Cost Saved",
                value: auditData.impact.savings,
                icon: "payments",
                accent: "#8b5cf6",
                tooltip: "Estimated cost savings from automation"
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            metrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                label: "Efficiency",
                value: metrics.efficiency_improvement,
                icon: "bolt",
                accent: "#f59e0b",
                tooltip: "Efficiency improvement over manual review"
            }, void 0, false, {
                fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
                lineNumber: 219,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/MetricsRow/MetricsRow.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
_s2(MetricsRow, "T3P0TH3zSIX1aKmkJhPL5i4Q+PY=", false, function() {
    return [
        useCountUp,
        useCountUp,
        useCountUp
    ];
});
_c1 = MetricsRow;
var _c, _c1;
__turbopack_context__.k.register(_c, "MetricCard");
__turbopack_context__.k.register(_c1, "MetricsRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ScoreComparison/ScoreComparison.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScoreComparison
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function ScoreRing({ score, label, color }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const filled = score / 100 * circumference;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "relative",
                    width: 128,
                    height: 128
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 128 128",
                        style: {
                            width: "100%",
                            height: "100%",
                            transform: "rotate(-90deg)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "64",
                                cy: "64",
                                r: radius,
                                fill: "none",
                                stroke: "rgba(255,255,255,0.06)",
                                strokeWidth: "10"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "64",
                                cy: "64",
                                r: radius,
                                fill: "none",
                                stroke: color,
                                strokeWidth: "10",
                                strokeDasharray: `${filled} ${circumference}`,
                                strokeLinecap: "round",
                                style: {
                                    transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                color
                            },
                            children: [
                                score,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: "0.875rem",
                                        fontWeight: 400,
                                        color: "#9ca3af"
                                    },
                                    children: "%"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#9ca3af"
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = ScoreRing;
function ScoreComparison({ beforeScore, afterScore }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "card-title",
                    children: "Score Comparison"
                }, void 0, false, {
                    fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreRing, {
                        score: Math.max(10, beforeScore),
                        label: "Before",
                        color: "#ef4444"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 1,
                            height: 80,
                            background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreRing, {
                        score: afterScore,
                        label: "After",
                        color: "#10b981"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ScoreComparison/ScoreComparison.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_c1 = ScoreComparison;
var _c, _c1;
__turbopack_context__.k.register(_c, "ScoreRing");
__turbopack_context__.k.register(_c1, "ScoreComparison");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SeverityBreakdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function SeverityBreakdown({ summary, impact }) {
    const total = summary.total || 1;
    const bars = [
        {
            key: "critical",
            label: "Critical",
            color: "#ef4444",
            count: summary.critical
        },
        {
            key: "high",
            label: "High",
            color: "#f97316",
            count: summary.high
        },
        {
            key: "medium",
            label: "Medium",
            color: "#eab308",
            count: summary.medium
        },
        {
            key: "low",
            label: "Low",
            color: "#6b7280",
            count: summary.low
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "card-title",
                        children: "Severity Breakdown"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "count-badge",
                        children: [
                            summary.total,
                            " total"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "1.5rem"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem"
                        },
                        children: bars.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: 56,
                                            fontSize: "0.75rem",
                                            color: "#9ca3af"
                                        },
                                        children: b.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            height: 8,
                                            borderRadius: 9999,
                                            background: "rgba(255,255,255,0.05)",
                                            overflow: "hidden"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                height: "100%",
                                                borderRadius: 9999,
                                                width: `${b.count / total * 100}%`,
                                                background: b.color,
                                                boxShadow: `0 0 8px ${b.color}55`,
                                                transition: "width 1s ease"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                                            lineNumber: 58,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                                        lineNumber: 49,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            width: 20,
                                            textAlign: "right",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            color: b.color
                                        },
                                        children: b.count
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, b.key, true, {
                                fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                                lineNumber: 40,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: "1.5rem",
                            padding: "1rem",
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.05)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: "0.7rem",
                                    color: "#6b7280",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginBottom: 4
                                },
                                children: "Estimated Fix Time"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: "1.25rem",
                                    fontWeight: 800,
                                    color: "#fff"
                                },
                                children: [
                                    impact.time_saved_minutes,
                                    " minutes"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: "0.75rem",
                                    color: "#4b5563",
                                    marginTop: 2
                                },
                                children: [
                                    "vs ",
                                    impact.manual_review_cost,
                                    " manual review"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = SeverityBreakdown;
var _c;
__turbopack_context__.k.register(_c, "SeverityBreakdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VulnerabilitiesTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/styles.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
// ── Severity Badge ────────────────────────────────────────────────────────────
function SeverityBadge({ severity }) {
    const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEVERITY_CONFIG"][severity] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEVERITY_CONFIG"].LOW;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            padding: "2px 10px",
            borderRadius: 9999,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: cfg.color,
            background: cfg.bg,
            border: `1px solid ${cfg.color}33`
        },
        children: cfg.label
    }, void 0, false, {
        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = SeverityBadge;
// ── Single expandable row ─────────────────────────────────────────────────────
function VulnRow({ vuln, index, onCopy }) {
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEVERITY_CONFIG"][vuln.severity] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEVERITY_CONFIG"].LOW;
    const handleCopy = (text)=>{
        onCopy(text);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                onClick: ()=>setExpanded(!expanded),
                className: "vuln-row",
                style: {
                    animationDelay: `${index * 60}ms`,
                    cursor: "pointer"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        style: {
                            padding: "1rem 1.5rem"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        flexShrink: 0,
                                        background: cfg.dot,
                                        boxShadow: `0 0 6px ${cfg.dot}`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                    style: {
                                        fontSize: "0.875rem",
                                        color: "#93c5fd",
                                        fontFamily: "JetBrains Mono, monospace"
                                    },
                                    children: vuln.file
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: "0.75rem",
                                        color: "#6b7280"
                                    },
                                    children: [
                                        ":",
                                        vuln.line
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        style: {
                            padding: "1rem 1.5rem",
                            fontSize: "0.875rem",
                            color: "#d1d5db"
                        },
                        children: vuln.type.replace(/_/g, " ")
                    }, void 0, false, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        style: {
                            padding: "1rem 1.5rem"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SeverityBadge, {
                            severity: vuln.severity
                        }, void 0, false, {
                            fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        style: {
                            padding: "1rem 1.5rem"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1,
                                        height: 6,
                                        borderRadius: 9999,
                                        background: "rgba(255,255,255,0.05)"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: "100%",
                                            borderRadius: 9999,
                                            width: `${vuln.confidence * 100}%`,
                                            background: "linear-gradient(90deg, #6366f1, #8b5cf6)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: "0.75rem",
                                        color: "#6b7280",
                                        whiteSpace: "nowrap"
                                    },
                                    children: [
                                        Math.round(vuln.confidence * 100),
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        style: {
                            padding: "1rem 1.5rem"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                color: "#34d399",
                                fontSize: "0.75rem",
                                fontWeight: 600
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined",
                                    style: {
                                        fontSize: 16
                                    },
                                    children: "check_circle"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this),
                                "Generated"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        style: {
                            padding: "1rem 1.5rem",
                            textAlign: "right"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined",
                            style: {
                                fontSize: 18,
                                color: "#6b7280",
                                display: "inline-block",
                                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s"
                            },
                            children: "expand_more"
                        }, void 0, false, {
                            fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                            lineNumber: 156,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                style: {
                    background: "rgba(255,255,255,0.01)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                    colSpan: 6,
                    style: {
                        padding: "1rem 1.5rem"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "0.5rem"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "0.6875rem",
                                                    color: "#6b7280",
                                                    fontWeight: 600,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em"
                                                },
                                                children: "Vulnerable Code"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 196,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "copy-btn",
                                                onClick: ()=>handleCopy(vuln.code),
                                                children: copied ? "✓ Copied" : "Copy"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 207,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        style: {
                                            display: "block",
                                            fontSize: "0.75rem",
                                            background: "rgba(0,0,0,0.4)",
                                            color: "#fca5a5",
                                            padding: "0.75rem",
                                            borderRadius: "0.5rem",
                                            border: "1px solid rgba(239,68,68,0.1)",
                                            fontFamily: "JetBrains Mono, monospace",
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-all"
                                        },
                                        children: vuln.code
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.75rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "0.6875rem",
                                                    color: "#6b7280",
                                                    fontWeight: 600,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                    marginBottom: "0.25rem"
                                                },
                                                children: "Description"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 239,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "0.875rem",
                                                    color: "#d1d5db"
                                                },
                                                children: vuln.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 251,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 238,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "0.6875rem",
                                                    color: "#6b7280",
                                                    fontWeight: 600,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                    marginBottom: "0.25rem"
                                                },
                                                children: "Fix Suggestion"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 256,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: "0.875rem",
                                                    color: "#6ee7b7"
                                                },
                                                children: vuln.fix_suggestion
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 268,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 255,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                lineNumber: 231,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 180,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                    lineNumber: 179,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                lineNumber: 173,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(VulnRow, "AWJyyaORvSZi2lzNUyuT6JA1FcI=");
_c1 = VulnRow;
const FILTERS = [
    "ALL",
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "LOW"
];
const SEVERITY_ORDER = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3
};
function VulnerabilitiesTable({ vulnerabilities, total }) {
    _s1();
    const [activeFilter, setActiveFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [sortField, setSortField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("severity");
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("asc");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Filter and sort vulnerabilities
    const processedVulnerabilities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "VulnerabilitiesTable.useMemo[processedVulnerabilities]": ()=>{
            let result = vulnerabilities.filter({
                "VulnerabilitiesTable.useMemo[processedVulnerabilities].result": (v)=>activeFilter === "ALL" || v.severity === activeFilter
            }["VulnerabilitiesTable.useMemo[processedVulnerabilities].result"]);
            // Apply search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                result = result.filter({
                    "VulnerabilitiesTable.useMemo[processedVulnerabilities]": (v)=>v.file.toLowerCase().includes(query) || v.type.toLowerCase().includes(query) || v.description.toLowerCase().includes(query)
                }["VulnerabilitiesTable.useMemo[processedVulnerabilities]"]);
            }
            // Apply sorting
            result.sort({
                "VulnerabilitiesTable.useMemo[processedVulnerabilities]": (a, b)=>{
                    let comparison = 0;
                    switch(sortField){
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
                }
            }["VulnerabilitiesTable.useMemo[processedVulnerabilities]"]);
            return result;
        }
    }["VulnerabilitiesTable.useMemo[processedVulnerabilities]"], [
        vulnerabilities,
        activeFilter,
        searchQuery,
        sortField,
        sortDirection
    ]);
    const handleSort = (field)=>{
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };
    const copyToClipboard = (text)=>{
        navigator.clipboard.writeText(text);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
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
      `
            }, void 0, false, {
                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "card-title",
                                        children: "Detected Vulnerabilities"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 473,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "count-badge",
                                        children: [
                                            total,
                                            " Issues"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 474,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                lineNumber: 470,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: "0.75rem",
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        className: "search-box",
                                        placeholder: "Search vulnerabilities...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        style: {
                                            minWidth: "200px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 484,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "filter-tabs",
                                        children: FILTERS.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `filter-tab ${activeFilter === f ? "active" : ""}`,
                                                onClick: ()=>setActiveFilter(f),
                                                children: f
                                            }, f, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 494,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 492,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 469,
                        columnNumber: 9
                    }, this),
                    processedVulnerabilities.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            overflowX: "auto"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "vuln-table",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: `sortable ${sortField === "file" ? `sorted-${sortDirection}` : ""}`,
                                                onClick: ()=>handleSort("file"),
                                                children: "File"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 511,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: `sortable ${sortField === "type" ? `sorted-${sortDirection}` : ""}`,
                                                onClick: ()=>handleSort("type"),
                                                children: "Issue Type"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 517,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: `sortable ${sortField === "severity" ? `sorted-${sortDirection}` : ""}`,
                                                onClick: ()=>handleSort("severity"),
                                                children: "Severity"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 523,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: `sortable ${sortField === "confidence" ? `sorted-${sortDirection}` : ""}`,
                                                onClick: ()=>handleSort("confidence"),
                                                children: "Confidence"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 529,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                children: "PR Fix"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 535,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {}, void 0, false, {
                                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                                lineNumber: 536,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                        lineNumber: 510,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                    lineNumber: 509,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: processedVulnerabilities.map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VulnRow, {
                                            vuln: v,
                                            index: i,
                                            onCopy: copyToClipboard
                                        }, `${v.file}-${v.line}-${i}`, false, {
                                            fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                            lineNumber: 541,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                    lineNumber: 539,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                            lineNumber: 508,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 507,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "empty-state",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined",
                                style: {
                                    fontSize: "3rem",
                                    marginBottom: "1rem",
                                    display: "block"
                                },
                                children: "search_off"
                            }, void 0, false, {
                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                lineNumber: 553,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: "0.875rem"
                                },
                                children: "No vulnerabilities found for this filter."
                            }, void 0, false, {
                                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                                lineNumber: 563,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                        lineNumber: 552,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx",
                lineNumber: 468,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s1(VulnerabilitiesTable, "7483u+itUTM+abVUcp53uI2eDls=");
_c2 = VulnerabilitiesTable;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SeverityBadge");
__turbopack_context__.k.register(_c1, "VulnRow");
__turbopack_context__.k.register(_c2, "VulnerabilitiesTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/PRCards/PRCards.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PRCards
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/styles.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function PRCard({ vuln, index }) {
    _s();
    const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEVERITY_CONFIG"][vuln.severity] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SEVERITY_CONFIG"].LOW;
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleViewPR = ()=>{
        setShowModal(true);
    };
    const handleCloseModal = ()=>{
        setShowModal(false);
    };
    const handleCopyPRDescription = ()=>{
        const prDescription = `## 🔒 Security Fix: ${vuln.type.replace(/_/g, " ")}

**File:** \`${vuln.file}\`
**Line:** ${vuln.line}
**Severity:** ${vuln.severity}

### 🐛 Issue
${vuln.description}

### 💡 Proposed Fix
${vuln.fix_suggestion}

### 📝 Vulnerable Code
\`\`\`javascript
${vuln.code}
\`\`\`

### ✅ Testing
- [ ] Verify fix resolves the security issue
- [ ] Run existing test suite
- [ ] Add new security test case
- [ ] Manual security review

---
*Generated by CodeGuard AI - Powered by IBM WatsonX*`;
        navigator.clipboard.writeText(prDescription);
        alert("PR description copied to clipboard!");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pr-card",
        style: {
            animationDelay: `${index * 80}ms`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 36,
                                    height: 36,
                                    borderRadius: "0.5rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(99,102,241,0.15)",
                                    border: "1px solid rgba(99,102,241,0.2)"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined",
                                    style: {
                                        color: "#818cf8",
                                        fontSize: 18
                                    },
                                    children: "alt_route"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            color: "#fff",
                                            lineHeight: 1.2,
                                            marginBottom: 2
                                        },
                                        children: [
                                            "Fix ",
                                            vuln.type.replace(/_/g, " ")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        style: {
                                            fontSize: "0.75rem",
                                            color: "#6b7280",
                                            fontFamily: "JetBrains Mono, monospace"
                                        },
                                        children: [
                                            vuln.file,
                                            ":",
                                            vuln.line
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PRCards/PRCards.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: "0.7rem",
                            padding: "2px 8px",
                            borderRadius: 9999,
                            fontWeight: 600,
                            color: cfg.color,
                            background: cfg.bg,
                            whiteSpace: "nowrap"
                        },
                        children: "Pending"
                    }, void 0, false, {
                        fileName: "[project]/src/components/PRCards/PRCards.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    lineHeight: 1.6,
                    marginBottom: "1rem"
                },
                children: vuln.fix_suggestion
            }, void 0, false, {
                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleViewPR,
                style: {
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.2)",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    fontFamily: "Inter, sans-serif"
                },
                onMouseEnter: (e)=>e.currentTarget.style.background = "rgba(99,102,241,0.1)",
                onMouseLeave: (e)=>e.currentTarget.style.background = "transparent",
                children: "View PR →"
            }, void 0, false, {
                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            showModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.85)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: "1rem",
                    animation: "fadeIn 0.2s ease"
                },
                onClick: handleCloseModal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "linear-gradient(135deg, rgba(30,30,35,0.95), rgba(20,20,25,0.98))",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "1.5rem",
                        maxWidth: "700px",
                        width: "100%",
                        maxHeight: "85vh",
                        overflow: "auto",
                        padding: "2.5rem",
                        position: "relative",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                        animation: "slideUp 0.3s ease"
                    },
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCloseModal,
                            style: {
                                position: "absolute",
                                top: "1.5rem",
                                right: "1.5rem",
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                cursor: "pointer",
                                color: "#fff",
                                fontSize: "1.5rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                                fontFamily: "Inter, sans-serif"
                            },
                            onMouseEnter: (e)=>{
                                e.currentTarget.style.background = "rgba(239,68,68,0.2)";
                                e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                                e.currentTarget.style.transform = "rotate(90deg)";
                            },
                            onMouseLeave: (e)=>{
                                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                                e.currentTarget.style.transform = "rotate(0deg)";
                            },
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: "2rem"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        color: "#fff",
                                        fontSize: "1.75rem",
                                        fontWeight: 700,
                                        marginBottom: "0.5rem",
                                        fontFamily: "Inter, sans-serif",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.75rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: "2rem",
                                                filter: "drop-shadow(0 0 8px rgba(99,102,241,0.5))"
                                            },
                                            children: "🔒"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 242,
                                            columnNumber: 17
                                        }, this),
                                        "Security Fix PR"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "#9ca3af",
                                        fontSize: "0.875rem",
                                        fontFamily: "Inter, sans-serif"
                                    },
                                    children: "Auto-generated pull request for vulnerability remediation"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "1rem",
                                marginBottom: "2rem"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "0.75rem",
                                        padding: "1rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#6b7280",
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                marginBottom: "0.5rem"
                                            },
                                            children: "Type"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 280,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#fff",
                                                fontSize: "0.875rem",
                                                fontWeight: 600,
                                                fontFamily: "Inter, sans-serif"
                                            },
                                            children: vuln.type.replace(/_/g, " ")
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 292,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 272,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "0.75rem",
                                        padding: "1rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#6b7280",
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                marginBottom: "0.5rem"
                                            },
                                            children: "Location"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 312,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                            style: {
                                                color: "#93c5fd",
                                                fontSize: "0.875rem",
                                                fontFamily: "JetBrains Mono, monospace"
                                            },
                                            children: [
                                                vuln.file,
                                                ":",
                                                vuln.line
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 324,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 304,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: `${cfg.bg}15`,
                                        border: `1px solid ${cfg.bg}40`,
                                        borderRadius: "0.75rem",
                                        padding: "1rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#6b7280",
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                marginBottom: "0.5rem"
                                            },
                                            children: "Severity"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 343,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: cfg.color,
                                                fontSize: "0.875rem",
                                                fontWeight: 700,
                                                fontFamily: "Inter, sans-serif"
                                            },
                                            children: vuln.severity.toUpperCase()
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 355,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 335,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                            lineNumber: 264,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "rgba(239,68,68,0.05)",
                                border: "1px solid rgba(239,68,68,0.15)",
                                borderRadius: "1rem",
                                padding: "1.5rem",
                                marginBottom: "1.5rem"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        color: "#fff",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        marginBottom: "0.75rem",
                                        fontFamily: "Inter, sans-serif",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: "1.25rem"
                                            },
                                            children: "🐛"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 390,
                                            columnNumber: 17
                                        }, this),
                                        "Issue Description"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 378,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "#e5e7eb",
                                        fontSize: "0.875rem",
                                        lineHeight: 1.7,
                                        fontFamily: "Inter, sans-serif"
                                    },
                                    children: vuln.description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 393,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                            lineNumber: 369,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "rgba(16,185,129,0.05)",
                                border: "1px solid rgba(16,185,129,0.15)",
                                borderRadius: "1rem",
                                padding: "1.5rem",
                                marginBottom: "1.5rem"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        color: "#fff",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        marginBottom: "0.75rem",
                                        fontFamily: "Inter, sans-serif",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: "1.25rem"
                                            },
                                            children: "💡"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 427,
                                            columnNumber: 17
                                        }, this),
                                        "Proposed Fix"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 415,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "#6ee7b7",
                                        fontSize: "0.875rem",
                                        lineHeight: 1.7,
                                        fontFamily: "Inter, sans-serif"
                                    },
                                    children: vuln.fix_suggestion
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 430,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                            lineNumber: 406,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: "2rem"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        color: "#fff",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        marginBottom: "0.75rem",
                                        fontFamily: "Inter, sans-serif",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: "1.25rem"
                                            },
                                            children: "📝"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 456,
                                            columnNumber: 17
                                        }, this),
                                        "Vulnerable Code"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 444,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    style: {
                                        background: "rgba(0,0,0,0.5)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        padding: "1.25rem",
                                        borderRadius: "0.75rem",
                                        overflow: "auto",
                                        fontSize: "0.8125rem",
                                        color: "#fca5a5",
                                        fontFamily: "JetBrains Mono, monospace",
                                        lineHeight: 1.6,
                                        maxHeight: "200px"
                                    },
                                    children: vuln.code
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 459,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                            lineNumber: 443,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                gap: "1rem",
                                flexWrap: "wrap"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCopyPRDescription,
                                    style: {
                                        flex: 1,
                                        minWidth: "200px",
                                        padding: "1rem 1.5rem",
                                        borderRadius: "0.75rem",
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: "#fff",
                                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                        border: "none",
                                        cursor: "pointer",
                                        fontFamily: "Inter, sans-serif",
                                        transition: "all 0.2s",
                                        boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.5rem"
                                    },
                                    onMouseEnter: (e)=>{
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)";
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)";
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: "1.125rem"
                                            },
                                            children: "📋"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                            lineNumber: 511,
                                            columnNumber: 17
                                        }, this),
                                        "Copy PR Description"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 479,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCloseModal,
                                    style: {
                                        padding: "1rem 1.5rem",
                                        borderRadius: "0.75rem",
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: "#9ca3af",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        cursor: "pointer",
                                        fontFamily: "Inter, sans-serif",
                                        transition: "all 0.2s"
                                    },
                                    onMouseEnter: (e)=>{
                                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.color = "#fff";
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                        e.currentTarget.style.color = "#9ca3af";
                                    },
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                    lineNumber: 514,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/PRCards/PRCards.tsx",
                            lineNumber: 478,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/PRCards/PRCards.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                lineNumber: 159,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/PRCards/PRCards.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(PRCard, "uVlnG5KLfXemZk5i5Fl+Cg356FU=");
_c = PRCard;
function PRCards({ vulnerabilities }) {
    const visible = vulnerabilities.slice(0, 6);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .pr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
        }
        .pr-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.25rem;
          transition: border-color 0.3s, transform 0.2s;
          animation: rowIn 0.4s ease both;
        }
        .pr-card:hover {
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-2px);
        }
      `
            }, void 0, false, {
                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                lineNumber: 556,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "card-title",
                                children: "Auto-Generated PRs"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                lineNumber: 579,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                style: {
                                    fontSize: "0.75rem",
                                    color: "#6366f1",
                                    fontWeight: 700,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: "Syne, sans-serif"
                                },
                                children: "View all →"
                            }, void 0, false, {
                                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                lineNumber: 580,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/PRCards/PRCards.tsx",
                        lineNumber: 578,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pr-grid",
                        children: visible.map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PRCard, {
                                vuln: v,
                                index: i
                            }, `${v.file}-${v.line}-${i}`, false, {
                                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                                lineNumber: 596,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/PRCards/PRCards.tsx",
                        lineNumber: 594,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/PRCards/PRCards.tsx",
                lineNumber: 577,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c1 = PRCards;
var _c, _c1;
__turbopack_context__.k.register(_c, "PRCard");
__turbopack_context__.k.register(_c1, "PRCards");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/EmptyState/EmptyState.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function EmptyState() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card",
        style: {
            padding: "5rem 2rem",
            textAlign: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "material-symbols-outlined",
                style: {
                    fontSize: "3.5rem",
                    color: "#1f2937",
                    marginBottom: "1rem",
                    display: "block"
                },
                children: "security"
            }, void 0, false, {
                fileName: "[project]/src/components/EmptyState/EmptyState.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#374151",
                    fontSize: "0.9rem",
                    maxWidth: 320,
                    margin: "0 auto"
                },
                children: [
                    "Click ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        style: {
                            color: "#6366f1"
                        },
                        children: "Run Audit Now"
                    }, void 0, false, {
                        fileName: "[project]/src/components/EmptyState/EmptyState.tsx",
                        lineNumber: 25,
                        columnNumber: 15
                    }, this),
                    " above to scan your codebase for vulnerabilities."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/EmptyState/EmptyState.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/EmptyState/EmptyState.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = EmptyState;
var _c;
__turbopack_context__.k.register(_c, "EmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DashboardUI.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardUI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/styles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navbar/Navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Hero/Hero.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ErrorBanner$2f$ErrorBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ErrorBanner/ErrorBanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MetricsRow$2f$MetricsRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/MetricsRow/MetricsRow.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScoreComparison$2f$ScoreComparison$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ScoreComparison/ScoreComparison.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SeverityBreakdown$2f$SeverityBreakdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SeverityBreakdown/SeverityBreakdown.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$VulnerabilitiesTable$2f$VulnerabilitiesTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PRCards$2f$PRCards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/PRCards/PRCards.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EmptyState$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/EmptyState/EmptyState.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
function DashboardUI() {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [auditData, setAuditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [scanMode, setScanMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("demo");
    const [lastAudit, setLastAudit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [apiStatus, setApiStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("checking");
    // ── API health check ─────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardUI.useEffect": ()=>{
            const check = {
                "DashboardUI.useEffect.check": async ()=>{
                    try {
                        const res = await fetch(`${("TURBOPACK compile-time value", "http://localhost:3000") || "http://localhost:3000"}/health`);
                        setApiStatus(res.ok ? "online" : "offline");
                    } catch  {
                        setApiStatus("offline");
                    }
                }
            }["DashboardUI.useEffect.check"];
            check();
        }
    }["DashboardUI.useEffect"], []);
    // ── Run audit ────────────────────────────────────────────────────
    const handleRunAudit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardUI.useCallback[handleRunAudit]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                const result = scanMode === "demo" || apiStatus === "offline" ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoAudit"])() : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runAudit"])([
                    {
                        file: "routes/user.js",
                        content: `const express = require('express');
const db = require('./db');
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  db.query(\`SELECT * FROM users WHERE id = '\${userId}'\`, (err, rows) => {
    res.json(rows);
  });
});`
                    }
                ]);
                console.log("AUDIT RESULT:", result); // 🔥 debug
                if (result?.success && result?.data) {
                    setAuditData(result.data);
                    setLastAudit(new Date().toLocaleTimeString());
                    try {
                        const m = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetrics"])();
                        if (m?.success && m?.data) {
                            setMetrics(m.data);
                        }
                    } catch  {
                    // metrics optional
                    }
                } else {
                    setError("Audit failed. Please try again.");
                }
            } catch (err) {
                console.error(err);
                setError("Cannot reach API. Switch to Demo mode or check backend server.");
            } finally{
                setLoading(false);
            }
        }
    }["DashboardUI.useCallback[handleRunAudit]"], [
        scanMode,
        apiStatus
    ]);
    // ── SAFE DATA NORMALIZATION (IMPORTANT) ───────────────────────────
    const summary = auditData?.summary ?? {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
    };
    const impact = auditData?.impact ?? {
        time_saved_minutes: 0,
        time_saved_hours: 0,
        manual_review_cost: "$0",
        automated_cost: "$0",
        savings: "$0"
    };
    const vulnerabilities = auditData?.vulnerabilities ?? [];
    // ── Derived values ────────────────────────────────────────────────
    const beforeScore = 100 - summary.total * 8;
    const afterScore = auditData?.overallScore ?? 92;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$styles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLOBAL_STYLES"]
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-root",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "content",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            apiStatus: apiStatus,
                            auditData: auditData
                        }, void 0, false, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 126,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Hero$2f$Hero$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            loading: loading,
                            hasData: !!auditData,
                            scanMode: scanMode,
                            lastAudit: lastAudit,
                            onRunAudit: handleRunAudit,
                            onScanModeChange: setScanMode
                        }, void 0, false, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "main-grid",
                            children: [
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ErrorBanner$2f$ErrorBanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    message: error
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 140,
                                    columnNumber: 23
                                }, this),
                                auditData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$MetricsRow$2f$MetricsRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            auditData: auditData,
                                            metrics: metrics,
                                            beforeScore: beforeScore
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "split-row",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ScoreComparison$2f$ScoreComparison$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    beforeScore: beforeScore,
                                                    afterScore: afterScore
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SeverityBreakdown$2f$SeverityBreakdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    summary: summary,
                                                    impact: impact
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 152,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$VulnerabilitiesTable$2f$VulnerabilitiesTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            vulnerabilities: vulnerabilities,
                                            total: summary.total
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 161,
                                            columnNumber: 17
                                        }, this),
                                        vulnerabilities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$PRCards$2f$PRCards$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            vulnerabilities: vulnerabilities
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 168,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true) : !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$EmptyState$2f$EmptyState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 172,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DashboardUI.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DashboardUI, "N+/hzdZDxfdRDVNQ3fLrkTAG/as=");
_c = DashboardUI;
var _c;
__turbopack_context__.k.register(_c, "DashboardUI");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0eneo_w._.js.map