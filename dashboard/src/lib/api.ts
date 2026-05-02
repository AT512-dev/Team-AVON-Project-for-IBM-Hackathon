const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')
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

  // ✨ NEW FIELDS - High-value engine data
  cvssScore?: number; // Impact score (0-10)
  cwe?: string; // CWE identifier
  dataFlow?: {
    // Taint path
    source: string;
    sink: string;
    taintedVariables?: string[];
  };
  remediation?: {
    // Enhanced AI fix
    priority?: string; // IMMEDIATE, HIGH, MEDIUM, LOW
    effort?: string; // LOW, MEDIUM, HIGH
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
 * Check if remediation text is code or plain text
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
 * Transform backend response to match frontend interface
 * Backend uses scan_summary, we use summary
 */
function transformAuditResponse(backendData: any): AuditData {
  // Handle both backend formats (scan_summary and summary)
  const scanSummary = backendData.scan_summary || backendData.summary;
  const totalIssues = scanSummary?.total_issues ?? scanSummary?.total ?? 0;

  // Calculate impact metrics
  const estimatedSavings = backendData.impact?.estimated_savings_usd || 18500;
  const manualMinutes = totalIssues * 15;
  const automatedMinutes = 2;
  const savedMinutes = manualMinutes - automatedMinutes;

  return {
    vulnerabilities: (backendData.vulnerabilities || []).map((v: any) => ({
      ...v,
      // Preserve new high-value fields from engine
      cvssScore: v.cvssScore,
      cwe: v.cwe,
      dataFlow: v.dataFlow,
      remediation: v.remediation,
    })),
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
      savings: `$${Math.round(manualMinutes * 2.5 - 5)}`,
    },
    overallScore: backendData.overallScore || 92,
    auditTimestamp: backendData.auditTimestamp || new Date().toISOString(),
    remediation: backendData.remediation,
  };
}

// Health check - uses SERVER_URL (without /api/v1)
export async function checkHealth() {
  const res = await fetch(`${SERVER_URL}/health`);
  return res.json();
}

// Run audit - uses BASE_URL (with /api/v1)
export async function runAudit(files: FileInput[]): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  const json = await res.json();

  if (json.success && json.data) {
    json.data = transformAuditResponse(json.data);
  }

  return json;
}

// Run audit with remediation - uses BASE_URL (with /api/v1)
export async function runAuditWithRemediation(
  files: FileInput[],
): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/audit/remediation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  });
  const json = await res.json();

  if (json.success && json.data) {
    json.data = transformAuditResponse(json.data);
  }

  return json;
}

// Get demo audit - uses BASE_URL (with /api/v1)
export async function getDemoAudit(): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/demo`);
  const json = await res.json();

  if (json.success && json.data) {
    json.data = transformAuditResponse(json.data);
  }

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