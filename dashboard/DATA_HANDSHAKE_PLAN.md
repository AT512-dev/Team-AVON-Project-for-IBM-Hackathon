# Phase 4: Data Handshake - High-Value Engine Data Integration

**Duration:** 2-3 hours  
**Priority:** CRITICAL (Team Lead Request)  
**Status:** 🟡 In Progress

---

## 📋 Background

The engine (Harshal's work) now produces high-value data that isn't displayed in the UI yet. These are the **"wow factors"** for judges:

1. **`taintPath`** (Data Flow Tracking) - Shows how untrusted data flows through code
2. **`impactScore`** (CVSS Score) - Numerical severity rating (0-10)
3. **Enhanced AI Remediation** - Can be text or code blocks

---

## 🎯 Tasks Breakdown

### Task 1: Update TypeScript Interfaces

**File:** `dashboard/src/lib/api.ts`

**Changes needed:**

```typescript
export interface Vulnerability {
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  file: string;
  line: number;
  code: string;
  description: string;
  fix_suggestion: string;
  confidence: number;

  // ✨ NEW FIELDS - Add these:
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
```

**Helper function to add:**

```typescript
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
```

---

### Task 2: Enhance Vulnerabilities Table

**File:** `dashboard/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx`

**Changes needed:**

1. **Add CVSS Score Column:**
   - Display as color-coded badge
   - 9.0-10.0: Red "CRITICAL 9.8"
   - 7.0-8.9: Orange "HIGH 8.1"
   - 4.0-6.9: Yellow "MEDIUM 5.5"
   - 0.0-3.9: Gray "LOW 2.3"
   - Make sortable

2. **Add Expandable Taint Path Section:**
   - Show when row is expanded
   - Display data flow visualization:
     ```
     Source: req.params.id (Line 17)
        ↓
     Tainted: userId, query
        ↓
     Sink: db.query (Line 20)
     ```
   - Use color coding:
     - Source: Green
     - Tainted Variables: Yellow
     - Sink: Red

---

### Task 3: Update PR Cards

**File:** `dashboard/src/components/PRCards/PRCards.tsx`

**Changes needed:**

1. **Smart Remediation Display:**

   ```typescript
   import { isCodeBlock } from "../../lib/api";

   // In component:
   const remediationText =
     vuln.remediation?.suggestedFix || vuln.fix_suggestion;
   const isCode = isCodeBlock(remediationText);
   ```

2. **Conditional Rendering:**

   ```tsx
   {
     isCode ? (
       <pre
         style={{
           background: "rgba(0,0,0,0.4)",
           padding: "1rem",
           borderRadius: "0.5rem",
           overflow: "auto",
           fontSize: "0.75rem",
           color: "#6ee7b7",
           fontFamily: "JetBrains Mono, monospace",
         }}
       >
         {remediationText}
       </pre>
     ) : (
       <p style={{ color: "#d1d5db", fontSize: "0.875rem" }}>
         {remediationText}
       </p>
     );
   }
   ```

3. **Add Priority & Effort Badges:**
   ```tsx
   {
     vuln.remediation?.priority && (
       <span
         style={{
           fontSize: "0.7rem",
           padding: "2px 8px",
           borderRadius: 9999,
           fontWeight: 600,
           background: getPriorityColor(vuln.remediation.priority),
         }}
       >
         {vuln.remediation.priority}
       </span>
     );
   }
   ```

---

### Task 4: Update Transform Function

**File:** `dashboard/src/lib/api.ts` (transformAuditResponse function)

**Changes needed:**

Ensure the transform function preserves new fields:

```typescript
function transformAuditResponse(backendData: any): AuditData {
  // ... existing code ...

  return {
    vulnerabilities: (backendData.vulnerabilities || []).map((v: any) => ({
      ...v,
      // Preserve new fields
      cvssScore: v.cvssScore,
      cwe: v.cwe,
      dataFlow: v.dataFlow,
      remediation: v.remediation,
    })),
    // ... rest of the code ...
  };
}
```

---

## 📊 Visual Examples

### CVSS Score Badge

```
┌─────────────────┐
│ CRITICAL 9.8 🔴 │
└─────────────────┘
```

### Taint Path Visualization

```
┌──────────────────────────────────┐
│ 🟢 Source: req.params.id (L17)  │
│         ↓                        │
│ 🟡 Tainted: userId, query        │
│         ↓                        │
│ 🔴 Sink: db.query (L20)          │
└──────────────────────────────────┘
```

### Code vs Text Remediation

```
CODE:
┌────────────────────────────────────┐
│ const query = 'SELECT * FROM...'; │
│ db.query(query, [userId], ...);   │
└────────────────────────────────────┘

TEXT:
Use parameterized queries to prevent SQL injection
```

---

## ✅ Success Criteria

- [ ] CVSS scores visible in vulnerabilities table
- [ ] Taint path shows in expandable rows
- [ ] AI remediation displays code with syntax highlighting
- [ ] Text remediation displays as formatted paragraph
- [ ] Priority and effort badges show on PR cards
- [ ] All new fields are TypeScript type-safe
- [ ] Backward compatible with existing data (optional fields)
- [ ] No breaking changes to existing functionality

---

## 🧪 Testing Checklist

- [ ] Test with sample data containing all new fields
- [ ] Test with sample data missing new fields (backward compatibility)
- [ ] Test CVSS score sorting
- [ ] Test taint path expansion/collapse
- [ ] Test code block detection (various code patterns)
- [ ] Test text remediation display
- [ ] Verify color coding is accessible (contrast ratios)
- [ ] Test on mobile devices

---

## 📝 Implementation Order

1. ✅ Update `api.ts` interfaces and helper function
2. ✅ Update `transformAuditResponse()` to preserve fields
3. ✅ Add CVSS column to VulnerabilitiesTable
4. ✅ Add taint path expandable section
5. ✅ Update PR Cards remediation display
6. ✅ Add priority/effort badges
7. ✅ Test with real engine data
8. ✅ Commit and push changes

---

## 🔗 Related Files

- [`dashboard/src/lib/api.ts`](../src/lib/api.ts) - TypeScript interfaces
- [`dashboard/src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx`](../src/components/VulnerabilitiesTable/VulnerabilitiesTable.tsx) - Table component
- [`dashboard/src/components/PRCards/PRCards.tsx`](../src/components/PRCards/PRCards.tsx) - PR cards component
- [`demo_samples/sample_audit_report.json`](../../demo_samples/sample_audit_report.json) - Sample data with new fields

---

**Last Updated:** 2026-05-02  
**Assigned To:** Ali (Dashboard UI Developer)  
**Requested By:** Team Lead  
**Status:** Ready to implement 🚀
