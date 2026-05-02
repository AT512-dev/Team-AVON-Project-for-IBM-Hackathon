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
    return res.json();
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
    return res.json();
}
async function getDemoAudit() {
    const res = await fetch(`${BASE_URL}/api/v1/demo`);
    return res.json();
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
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
// ─── Severity config ──────────────────────────────────────────────────────────
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
// ─── Score Ring Component ─────────────────────────────────────────────────────
function ScoreRing({ score, label, color }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const filled = score / 100 * circumference;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-32 h-32",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 128 128",
                        className: "w-full h-full -rotate-90",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                cx: "64",
                                cy: "64",
                                r: radius,
                                fill: "none",
                                stroke: "rgba(255,255,255,0.06)",
                                strokeWidth: "10"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardUI.tsx",
                                lineNumber: 59,
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
                                fileName: "[project]/src/components/DashboardUI.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-2xl font-bold",
                            style: {
                                color
                            },
                            children: [
                                score,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-normal text-gray-400",
                                    children: "%"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-semibold tracking-widest uppercase text-gray-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DashboardUI.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c = ScoreRing;
// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, icon, accent }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "metric-card group",
        style: {
            "--accent": accent
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "metric-glow"
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "metric-icon material-symbols-outlined",
                children: icon
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 113,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "metric-value",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "metric-label",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DashboardUI.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_c1 = MetricCard;
// ─── Severity Badge ───────────────────────────────────────────────────────────
function SeverityBadge({ severity }) {
    const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.LOW;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase",
        style: {
            color: cfg.color,
            background: cfg.bg,
            border: `1px solid ${cfg.color}33`
        },
        children: cfg.label
    }, void 0, false, {
        fileName: "[project]/src/components/DashboardUI.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_c2 = SeverityBadge;
// ─── Vulnerability Row ────────────────────────────────────────────────────────
function VulnRow({ vuln, index }) {
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const cfg = SEVERITY_CONFIG[vuln.severity] ?? SEVERITY_CONFIG.LOW;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "vuln-row cursor-pointer",
                onClick: ()=>setExpanded(!expanded),
                style: {
                    animationDelay: `${index * 60}ms`
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-6 py-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "w-2 h-2 rounded-full flex-shrink-0",
                                    style: {
                                        background: cfg.dot,
                                        boxShadow: `0 0 6px ${cfg.dot}`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                    className: "text-sm text-blue-300 font-mono",
                                    children: vuln.file
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-500",
                                    children: [
                                        ":",
                                        vuln.line
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-6 py-4 text-sm text-gray-300",
                        children: vuln.type.replace(/_/g, " ")
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-6 py-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SeverityBadge, {
                            severity: vuln.severity
                        }, void 0, false, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-6 py-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-1.5 flex-1 rounded-full bg-white/5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-full rounded-full",
                                        style: {
                                            width: `${vuln.confidence * 100}%`,
                                            background: "linear-gradient(90deg, #6366f1, #8b5cf6)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 171,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-gray-500",
                                    children: [
                                        Math.round(vuln.confidence * 100),
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 170,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-6 py-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-1.5 text-emerald-400 text-xs font-semibold",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined text-sm",
                                    children: "check_circle"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this),
                                " ",
                                "Generated"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                        className: "px-6 py-4 text-right",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-gray-500 text-sm transition-transform duration-200",
                            style: {
                                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                display: "inline-block"
                            },
                            children: "expand_more"
                        }, void 0, false, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 194,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                className: "bg-white/[0.02] border-b border-white/5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                    colSpan: 6,
                    className: "px-6 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2",
                                        children: "Vulnerable Code"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                        lineNumber: 210,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "block text-xs bg-black/40 text-red-300 p-3 rounded-lg font-mono border border-red-500/10 whitespace-pre-wrap break-all",
                                        children: vuln.code
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                        lineNumber: 213,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardUI.tsx",
                                lineNumber: 209,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1",
                                                children: "Description"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 219,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-300",
                                                children: vuln.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 222,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                        lineNumber: 218,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1",
                                                children: "Fix Suggestion"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 225,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-emerald-300",
                                                children: vuln.fix_suggestion
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 228,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                        lineNumber: 224,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardUI.tsx",
                                lineNumber: 217,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 208,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/DashboardUI.tsx",
                    lineNumber: 207,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 206,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(VulnRow, "DuL5jiiQQFgbn7gBKAyxwS/H4Ek=");
_c3 = VulnRow;
// ─── PR Card ──────────────────────────────────────────────────────────────────
function PRCard({ vuln, index }) {
    const cfg = SEVERITY_CONFIG[vuln.severity] ?? SEVERITY_CONFIG.LOW;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pr-card",
        style: {
            animationDelay: `${index * 80}ms`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9 h-9 rounded-lg flex items-center justify-center",
                                style: {
                                    background: "rgba(99,102,241,0.15)",
                                    border: "1px solid rgba(99,102,241,0.2)"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "material-symbols-outlined text-indigo-400 text-lg",
                                    children: "alt_route"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/DashboardUI.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-white leading-tight",
                                        children: [
                                            "Fix ",
                                            vuln.type.replace(/_/g, " ")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "text-xs text-gray-500 font-mono",
                                        children: [
                                            vuln.file,
                                            ":",
                                            vuln.line
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                        lineNumber: 263,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DashboardUI.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs px-2 py-0.5 rounded-full font-medium",
                        style: {
                            color: cfg.color,
                            background: cfg.bg
                        },
                        children: "Pending"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-400 mb-4 leading-relaxed",
                children: vuln.fix_suggestion
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "w-full py-2 rounded-lg text-xs font-semibold text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/10 transition-colors",
                children: "View PR →"
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DashboardUI.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
_c4 = PRCard;
// ─── Summary Bar ──────────────────────────────────────────────────────────────
function SummaryBar({ summary }) {
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
        className: "space-y-3",
        children: bars.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-14 text-xs text-gray-400",
                        children: b.label
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 303,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 h-2 rounded-full bg-white/5 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full rounded-full transition-all duration-1000",
                            style: {
                                width: `${b.count / total * 100}%`,
                                background: b.color,
                                boxShadow: `0 0 8px ${b.color}55`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 305,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 304,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-6 text-right text-xs font-bold",
                        style: {
                            color: b.color
                        },
                        children: b.count
                    }, void 0, false, {
                        fileName: "[project]/src/components/DashboardUI.tsx",
                        lineNumber: 314,
                        columnNumber: 11
                    }, this)
                ]
            }, b.key, true, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 302,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/DashboardUI.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
_c5 = SummaryBar;
function DashboardUI() {
    _s1();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [auditData, setAuditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [severityFilter, setSeverityFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [scanMode, setScanMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("demo");
    const [lastAudit, setLastAudit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [apiStatus, setApiStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("checking");
    // Check API health on mount
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
    const handleRunAudit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardUI.useCallback[handleRunAudit]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                let result;
                if (scanMode === "demo" || apiStatus === "offline") {
                    result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoAudit"])();
                } else {
                    result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runAudit"])([
                        {
                            file: "routes/user.js",
                            content: `const express = require('express');\nconst db = require('./db');\nrouter.get('/user/:id', (req, res) => {\n  const userId = req.params.id;\n  db.query(\`SELECT * FROM users WHERE id = '\${userId}'\`, (err, rows) => {\n    res.json(rows);\n  });\n});`
                        }
                    ]);
                }
                if (result.success) {
                    setAuditData(result.data);
                    setLastAudit(new Date().toLocaleTimeString());
                    // Fetch metrics separately
                    try {
                        const m = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMetrics"])();
                        if (m.success) setMetrics(m.data);
                    } catch  {}
                } else {
                    setError("Audit failed. Please try again.");
                }
            } catch  {
                setError("Cannot reach the API server. Run in demo mode or check your connection.");
            } finally{
                setLoading(false);
            }
        }
    }["DashboardUI.useCallback[handleRunAudit]"], [
        scanMode,
        apiStatus
    ]);
    const filteredVulns = auditData?.vulnerabilities.filter((v)=>severityFilter === "ALL" || v.severity === severityFilter) ?? [];
    const beforeScore = 100 - (auditData?.summary.total ?? 0) * 8;
    const afterScore = auditData?.overallScore ?? 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        * { box-sizing: border-box; }

        body {
          background: #050508;
          font-family: 'Syne', sans-serif;
        }

        .dashboard-root {
          min-height: 100vh;
          background: #050508;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
        }

        /* Grid noise overlay */
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

        /* Nav */
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
          transition: color 0.2s;
          cursor: pointer;
        }
        .nav-link:hover, .nav-link.active { color: #fff; }
        .nav-link.active { color: #a5b4fc; }

        .api-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          display: inline-block;
        }
        .api-dot.online { background: #10b981; box-shadow: 0 0 6px #10b981; }
        .api-dot.offline { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
        .api-dot.checking { background: #eab308; animation: blink 1s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* Hero */
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
          font-family: 'Syne', sans-serif;
        }
        .mode-btn.active {
          background: #6366f1;
          color: #fff;
        }
        .mode-btn.inactive {
          background: transparent;
          color: #6b7280;
        }

        .run-btn {
          position: relative;
          padding: 1rem 3rem;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          border: none;
          font-family: 'Syne', sans-serif;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          transition: all 0.3s;
          box-shadow: 0 0 0 0 rgba(99,102,241,0.4);
        }
        .run-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.4), 0 0 0 0 rgba(99,102,241,0);
        }
        .run-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .run-btn.pulse {
          animation: btn-pulse 2s infinite;
        }
        @keyframes btn-pulse {
          0% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          70% { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }

        /* Spinner */
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
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Main grid */
        .main-grid {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Metric cards */
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

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
          transition: border-color 0.3s, transform 0.2s;
        }
        .metric-card:hover {
          border-color: rgba(var(--accent-rgb, 99,102,241), 0.3);
          transform: translateY(-2px);
        }
        .metric-glow {
          position: absolute;
          top: -20px; left: -20px;
          width: 80px; height: 80px;
          background: radial-gradient(circle, var(--accent, #6366f1) 0%, transparent 70%);
          opacity: 0.12;
          pointer-events: none;
        }
        .metric-icon {
          font-size: 1.5rem;
          color: var(--accent, #6366f1);
          flex-shrink: 0;
        }
        .metric-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 2px;
        }
        .metric-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* Section cards */
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
        }
        .card-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
        }

        /* Split row */
        .split-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .split-row { grid-template-columns: 1fr; }
          .metrics-row { grid-template-columns: 1fr 1fr; }
        }

        /* Score section */
        .scores-inner {
          padding: 2rem;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .score-divider {
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
        }

        /* Vuln table */
        .vuln-table { width: 100%; border-collapse: collapse; }
        .vuln-table th {
          padding: 0.75rem 1.5rem;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: left;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .vuln-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
          animation: rowIn 0.4s ease both;
        }
        .vuln-row:hover { background: rgba(255,255,255,0.03); }
        @keyframes rowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Filter tabs */
        .filter-tabs {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .filter-tab {
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #6b7280;
          font-family: 'Syne', sans-serif;
          transition: all 0.2s;
        }
        .filter-tab.active {
          background: #6366f1;
          color: #fff;
          border-color: #6366f1;
        }
        .filter-tab:not(.active):hover {
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }

        /* PR cards */
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

        /* Error banner */
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

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #374151;
        }
        .empty-state .material-symbols-outlined {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        /* Count badge */
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
      `
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 399,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dashboard-root",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "content",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "top-nav",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "2.5rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "logo",
                                            children: "⬡ CodeGuard"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 822,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "nav-links",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "nav-link active",
                                                    children: "Dashboard"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 824,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "nav-link",
                                                    children: "Reports"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 825,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "nav-link",
                                                    children: "Settings"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 826,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 823,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 819,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem"
                                    },
                                    children: [
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
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 839,
                                                    columnNumber: 17
                                                }, this),
                                                "API ",
                                                apiStatus
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 830,
                                            columnNumber: 15
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
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 853,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 842,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 829,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 818,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "hero",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hero-glow"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 865,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    children: [
                                        "One-Click Security",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 868,
                                            columnNumber: 15
                                        }, this),
                                        "Audit"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 866,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Detect vulnerabilities across your codebase in seconds. Powered by AI — zero config needed."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 871,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mode-toggle",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `mode-btn ${scanMode === "demo" ? "active" : "inactive"}`,
                                            onClick: ()=>setScanMode("demo"),
                                            children: "DEMO"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 877,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `mode-btn ${scanMode === "live" ? "active" : "inactive"}`,
                                            onClick: ()=>setScanMode("live"),
                                            children: "LIVE API"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 883,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 876,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 891,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `run-btn ${!loading && !auditData ? "pulse" : ""}`,
                                    onClick: handleRunAudit,
                                    disabled: loading,
                                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "spinner"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 900,
                                                columnNumber: 19
                                            }, this),
                                            "Scanning Codebase…"
                                        ]
                                    }, void 0, true) : auditData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
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
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 905,
                                                columnNumber: 19
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
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 919,
                                                columnNumber: 19
                                            }, this),
                                            "Run Audit Now"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 893,
                                    columnNumber: 13
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
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 942,
                                            columnNumber: 17
                                        }, this),
                                        "Last scan at ",
                                        lastAudit
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 935,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 864,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "main-grid",
                            children: [
                                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "error-banner",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined",
                                            children: "error"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 961,
                                            columnNumber: 17
                                        }, this),
                                        error
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 960,
                                    columnNumber: 15
                                }, this),
                                auditData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "metrics-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Score Before",
                                            value: `${Math.max(10, beforeScore)}%`,
                                            icon: "trending_down",
                                            accent: "#ef4444"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 969,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Score After",
                                            value: `${afterScore ?? 92}%`,
                                            icon: "trending_up",
                                            accent: "#10b981"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 975,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Time Saved",
                                            value: `${auditData.impact.time_saved_hours}h`,
                                            icon: "schedule",
                                            accent: "#6366f1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 981,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Cost Saved",
                                            value: auditData.impact.savings,
                                            icon: "payments",
                                            accent: "#8b5cf6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 987,
                                            columnNumber: 17
                                        }, this),
                                        metrics && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                            label: "Efficiency",
                                            value: metrics.efficiency_improvement,
                                            icon: "bolt",
                                            accent: "#f59e0b"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 994,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 968,
                                    columnNumber: 15
                                }, this),
                                auditData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "split-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "card-header",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "card-title",
                                                        children: "Score Comparison"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                                        lineNumber: 1009,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1008,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "scores-inner",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreRing, {
                                                            score: Math.max(10, beforeScore),
                                                            label: "Before",
                                                            color: "#ef4444"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1012,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "score-divider"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1017,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreRing, {
                                                            score: afterScore ?? 92,
                                                            label: "After",
                                                            color: "#10b981"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1018,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1011,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1007,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "card",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "card-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "card-title",
                                                            children: "Severity Breakdown"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1028,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "count-badge",
                                                            children: [
                                                                auditData.summary.total,
                                                                " total"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1029,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1027,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: "1.5rem"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryBar, {
                                                            summary: auditData.summary
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1034,
                                                            columnNumber: 21
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
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1044,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: "1.25rem",
                                                                        fontWeight: 800,
                                                                        color: "#fff"
                                                                    },
                                                                    children: [
                                                                        auditData.impact.time_saved_minutes,
                                                                        " minutes"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1056,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: "0.75rem",
                                                                        color: "#4b5563",
                                                                        marginTop: 2
                                                                    },
                                                                    children: [
                                                                        "vs ",
                                                                        auditData.impact.manual_review_cost,
                                                                        " manual review"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1065,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1035,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1033,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1026,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 1006,
                                    columnNumber: 15
                                }, this),
                                auditData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1091,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "count-badge",
                                                            children: [
                                                                auditData.summary.total,
                                                                " Issues"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1092,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1084,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "filter-tabs",
                                                    children: [
                                                        "ALL",
                                                        "CRITICAL",
                                                        "HIGH",
                                                        "MEDIUM",
                                                        "LOW"
                                                    ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: `filter-tab ${severityFilter === s ? "active" : ""}`,
                                                            onClick: ()=>setSeverityFilter(s),
                                                            children: s
                                                        }, s, false, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1098,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1096,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1083,
                                            columnNumber: 17
                                        }, this),
                                        filteredVulns.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                    children: "File"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1113,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Issue Type"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1114,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Severity"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1115,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "Confidence"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1116,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    children: "PR Fix"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1117,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {}, void 0, false, {
                                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                                    lineNumber: 1118,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                                            lineNumber: 1112,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                                        lineNumber: 1111,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: filteredVulns.map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VulnRow, {
                                                                vuln: v,
                                                                index: i
                                                            }, `${v.file}-${v.line}-${i}`, false, {
                                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                                lineNumber: 1123,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DashboardUI.tsx",
                                                        lineNumber: 1121,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DashboardUI.tsx",
                                                lineNumber: 1110,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1109,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "empty-state",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "material-symbols-outlined",
                                                    children: "search_off"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1134,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: "No vulnerabilities found for this filter."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1137,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1133,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 1082,
                                    columnNumber: 15
                                }, this),
                                auditData && auditData.vulnerabilities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "card-header",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "card-title",
                                                    children: "Auto-Generated PRs"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1147,
                                                    columnNumber: 19
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
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1148,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1146,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pr-grid",
                                            children: auditData.vulnerabilities.slice(0, 6).map((v, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PRCard, {
                                                    vuln: v,
                                                    index: i
                                                }, i, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1164,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1162,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 1145,
                                    columnNumber: 15
                                }, this),
                                !auditData && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1176,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#374151",
                                                fontSize: "0.9rem",
                                                maxWidth: 320,
                                                margin: "0 auto"
                                            },
                                            children: [
                                                "Click",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    style: {
                                                        color: "#6366f1"
                                                    },
                                                    children: "Run Audit Now"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                                    lineNumber: 1196,
                                                    columnNumber: 19
                                                }, this),
                                                " ",
                                                "above to scan your codebase for vulnerabilities."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DashboardUI.tsx",
                                            lineNumber: 1187,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DashboardUI.tsx",
                                    lineNumber: 1172,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DashboardUI.tsx",
                            lineNumber: 957,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DashboardUI.tsx",
                    lineNumber: 816,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/DashboardUI.tsx",
                lineNumber: 815,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s1(DashboardUI, "k3dtDnoAvaMW8Qa1s4arKVdpNX8=");
_c6 = DashboardUI;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "ScoreRing");
__turbopack_context__.k.register(_c1, "MetricCard");
__turbopack_context__.k.register(_c2, "SeverityBadge");
__turbopack_context__.k.register(_c3, "VulnRow");
__turbopack_context__.k.register(_c4, "PRCard");
__turbopack_context__.k.register(_c5, "SummaryBar");
__turbopack_context__.k.register(_c6, "DashboardUI");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0-4cwrh._.js.map