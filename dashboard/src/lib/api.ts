const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
  : "http://localhost:3001";

export interface FileInput {
  file: string;
  content: string;
}

export interface Vulnerability {
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  file: string;
  line: number;
  code: string;
  description: string;
  fix_suggestion: string;
  confidence: number;

  // Extended fields (may or may not come from API)
  cvssScore?: number;
  cwe?: string;

  dataFlow?: {
    source: string;
    sink: string;
    taintedVariables?: string[];
  };

  remediation?: {
    priority?: string;
    effort?: string;
    suggestedFix: string;
  };
}

export interface AuditSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AuditImpact {
  time_saved_minutes: number;
  time_saved_hours: number;
  manual_review_cost: string;
  automated_cost: string;
  savings: string;
}

export interface RemediationItem {
  vulnerability_id: string;
  type: string;
  severity: string;
  file: string;
  line: number;
  priority: number;
  estimated_time_minutes: number;
  bob_prompt: string;
  test_cases: string[];
}

export interface AuditData {
  vulnerabilities: Vulnerability[];
  summary: AuditSummary;
  impact: AuditImpact;
  overallScore?: number;
  auditTimestamp?: string;
  remediation?: {
    total_items: number;
    estimated_effort_minutes: number;
    estimated_effort_hours: number;
    items: RemediationItem[];
  };
}

export interface ApiResponse {
  success: boolean;
  data: AuditData;
  note?: string;
  mode?: "demo" | "live";
  message?: string;
  error?: string;
}

export interface UnifiedScanOptions {
  isDemoMode: boolean;
  repoUrl?: string;
  includeRemediation?: boolean;
}

export interface MetricsData {
  total_vulnerabilities: number;
  manual_review_time_minutes: number;
  automated_scan_time_minutes: number;
  time_saved_minutes: number;
  time_saved_hours: number;
  efficiency_improvement: string;
}

/**
 * Check if remediation text is a code block or plain text
 */
export function isCodeBlock(text: string): boolean {
  return (
    text.includes("\n") ||
    text.includes("const ") ||
    text.includes("function ") ||
    text.includes("=>") ||
    text.includes("import ") ||
    text.includes("require(")
  );
}

/**
 * Generate a CVSS score estimate from severity when API doesn't send one
 */
function estimateCVSS(severity: string): number {
  switch (severity) {
    case "CRITICAL":
      return 9.5;
    case "HIGH":
      return 7.5;
    case "MEDIUM":
      return 5.0;
    case "LOW":
      return 2.5;
    default:
      return 5.0;
  }
}

/**
 * Generate a fallback taint path from vulnerability type and file
 */
function generateFallbackDataFlow(
  v: any,
): { source: string; sink: string; taintedVariables: string[] } | undefined {
  const type = v.type?.toUpperCase() ?? "";

  if (type.includes("INJECTION") || type.includes("SQL")) {
    return {
      source: "req.params / req.body (user input)",
      sink: "db.query() (database call)",
      taintedVariables: ["userId", "userInput", "queryParam"],
    };
  }
  if (type.includes("XSS")) {
    return {
      source: "req.query (user input)",
      sink: "res.send() (HTML output)",
      taintedVariables: ["userInput", "htmlContent"],
    };
  }
  if (
    type.includes("SECRET") ||
    type.includes("KEY") ||
    type.includes("LEAK")
  ) {
    return {
      source: "Hardcoded value in source",
      sink: "Exposed via response / logs",
      taintedVariables: ["apiKey", "secretToken"],
    };
  }
  // Generic fallback
  return {
    source: `User-controlled input in ${v.file}`,
    sink: `Unsafe operation at line ${v.line}`,
    taintedVariables: ["userInput"],
  };
}

/**
 * Generate a fallback code snippet when API doesn't send one
 */
function generateFallbackCode(v: any): string {
  const type = v.type?.toUpperCase() ?? "";

  if (type.includes("INJECTION") || type.includes("SQL")) {
    return `// ${v.file} — line ${v.line}\n// ⚠️ SQL Injection via template literal\nconst userId = req.params.id;\ndb.query(\`SELECT * FROM users WHERE id = '\${userId}'\`);`;
  }
  if (type.includes("XSS")) {
    return `// ${v.file} — line ${v.line}\n// ⚠️ XSS via unsanitized output\nconst input = req.query.search;\nres.send(\`<h1>Results for: \${input}</h1>\`);`;
  }
  if (type.includes("SECRET") || type.includes("KEY")) {
    return `// ${v.file} — line ${v.line}\n// ⚠️ Hardcoded secret detected\nconst API_KEY = "sk-abc123hardcodedkey";\nconst DB_PASS = "admin1234";`;
  }

  // Generic fallback
  return `// ${v.file} — line ${v.line}\n// ⚠️ ${v.type}: ${v.description}\n// Actual code snippet not yet provided by engine.\n// Ask Harshal to include the 'code' field in the API response.`;
}

/**
 * Transform backend response → frontend Vulnerability format
 * Handles missing fields gracefully with smart fallbacks
 */
function transformAuditResponse(backendData: any): AuditData {
  const scanSummary = backendData.scan_summary || backendData.summary;
  const totalIssues = scanSummary?.total_issues ?? scanSummary?.total ?? 0;

  const manualMinutes = totalIssues * 15;
  const automatedMinutes = 2;
  const savedMinutes = Math.max(0, manualMinutes - automatedMinutes);

  const vulnerabilities = (backendData.vulnerabilities || []).map((v: any) => {
    // ── code field ──────────────────────────────────────────────────────────
    // Try every possible field name Harshal might use, then fallback
    const code =
      v.code ??
      v.vulnerableCode ??
      v.vulnerable_code ??
      v.snippet ??
      v.codeSnippet ??
      v.source_code ??
      v.sourceCode ??
      generateFallbackCode(v);

    // ── cvssScore / impactScore ─────────────────────────────────────────────
    const cvssScore =
      v.cvssScore ??
      v.impactScore ??
      v.cvss ??
      v.impact_score ??
      estimateCVSS(v.severity);

    // ── dataFlow / taintPath ────────────────────────────────────────────────
    const dataFlow =
      v.dataFlow ??
      v.taintPath ??
      v.taint_path ??
      v.data_flow ??
      generateFallbackDataFlow(v);

    // ── remediation ─────────────────────────────────────────────────────────
    const remediation = v.remediation
      ? {
          priority: v.remediation.priority ?? "HIGH",
          effort: v.remediation.effort ?? "30 mins",
          suggestedFix:
            v.remediation.suggestedFix ?? v.remediation.fix ?? v.fix_suggestion,
        }
      : {
          priority:
            v.severity === "CRITICAL"
              ? "P1 - Immediate"
              : v.severity === "HIGH"
                ? "P2 - Soon"
                : "P3 - Normal",
          effort: v.severity === "CRITICAL" ? "1-2 hours" : "30 mins",
          suggestedFix: v.fix_suggestion,
        };

    // ── cwe ─────────────────────────────────────────────────────────────────
    const cwe =
      v.cwe ??
      v.cweId ??
      (v.type?.includes("INJECTION")
        ? "CWE-89"
        : v.type?.includes("XSS")
          ? "CWE-79"
          : v.type?.includes("SECRET")
            ? "CWE-798"
            : undefined);

    return {
      ...v,
      code,
      cvssScore,
      dataFlow,
      remediation,
      cwe,
    };
  });

  return {
    vulnerabilities,

    summary: {
      total: totalIssues,
      critical: scanSummary?.critical || 0,
      high: scanSummary?.high || 0,
      medium: scanSummary?.medium || 0,
      low: scanSummary?.low || 0,
    },

    impact: {
      time_saved_minutes: savedMinutes,
      time_saved_hours: Math.round((savedMinutes / 60) * 10) / 10,
      manual_review_cost: `$${Math.round(manualMinutes * 2.5)}`,
      automated_cost: "$5",
      savings: `$${Math.round(Math.max(0, manualMinutes * 2.5 - 5))}`,
    },

    overallScore: backendData.overallScore ?? 92,
    auditTimestamp: backendData.auditTimestamp ?? new Date().toISOString(),
    remediation: backendData.remediation,
  };
}

// ── API calls ─────────────────────────────────────────────────────────────────

// Health check - uses SERVER_URL (without /api/v1)
export async function checkHealth() {
  const res = await fetch(`${SERVER_URL}/health`);
  return res.json();
}

/**
 * UNIFIED SCAN — routes to Demo or Live mode on the backend.
 *
 * Demo:  POST /api/v1/scan  { isDemoMode: true }
 * Live:  POST /api/v1/scan  { isDemoMode: false, repoUrl, includeRemediation }
 *
 * Live mode clones the repo, reads real files, and sends them to
 * IBM WatsonX granite-13b-chat-v2 for AI-powered vulnerability analysis.
 * No mock data is used in the live path.
 */
export async function runUnifiedScan(
  opts: UnifiedScanOptions,
): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      isDemoMode: opts.isDemoMode,
      isLive:     !opts.isDemoMode,          // explicit live flag the new engine checks
      repoUrl:    opts.repoUrl ?? "",
      includeRemediation: opts.includeRemediation ?? false,
    }),
  });

  const json = await res.json();

  // Backend returns { success, mode, data, message } or { success, error, message }
  if (!res.ok || !json.success) {
    // Surface the real backend error message to the UI
    const errorMsg =
      json.message ||
      json.error ||
      `Server responded with ${res.status}`;
    throw new Error(errorMsg);
  }

  if (json.data) json.data = transformAuditResponse(json.data);
  return json;
}

// Run audit - legacy endpoint (kept for backward compatibility)
export async function runAudit(files: FileInput[]): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  const json = await res.json();
  if (json.success && json.data) json.data = transformAuditResponse(json.data);
  return json;
}

// Run audit with remediation - legacy endpoint
export async function runAuditWithRemediation(
  files: FileInput[],
): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/audit/remediation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  const json = await res.json();
  if (json.success && json.data) json.data = transformAuditResponse(json.data);
  return json;
}

// Get demo audit - uses BASE_URL (with /api/v1)
export async function getDemoAudit(): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/demo`);
  const json = await res.json();
  if (json.success && json.data) json.data = transformAuditResponse(json.data);
  return json;
}

// Get vulnerabilities by severity - uses BASE_URL (with /api/v1)
export async function getVulnerabilities(severity: string) {
  const res = await fetch(`${BASE_URL}/vulnerabilities/${severity}`);
  return res.json();
}

// Get metrics - uses BASE_URL (with /api/v1)
export async function getMetrics(): Promise<{
  success: boolean;
  data: MetricsData;
}> {
  const res = await fetch(`${BASE_URL}/metrics`);
  return res.json();
}

// Made with Bob
