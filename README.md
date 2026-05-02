# CodeGuard AI - Intelligent Security Audit Engine

Team AVON | IBM Bob Hackathon 2026

AI-powered static code analysis with automated vulnerability detection and remediation suggestions powered by IBM Bob.

---

## Quick Start

cd engine
npm install
npm start

Server runs on:
http://localhost:3000

---

## API Endpoints

### Core Audit Endpoints

POST /api/v1/audit

Run a security audit on provided code files.

Request
{
  "files": [
    {
      "file": "auth.js",
      "content": "const query = 'SELECT * FROM users WHERE id = ' + req.body.id;"
    }
  ]
}

Response
{
  "success": true,
  "data": {
    "scan_summary": {
      "total_issues": 29,
      "critical": 2,
      "high": 14,
      "medium": 13,
      "low": 0
    },
    "vulnerabilities": [...],
    "impact": {
      "estimated_savings_usd": 18500,
      "risk_score_total": 24.3
    },
    "overallScore": 42
  }
}

---

POST /api/v1/audit/remediation

Run audit with IBM Bob remediation suggestions.

Response includes:
- Full vulnerability breakdown
- IBM Bob-ready remediation prompts
- Test case templates
- Priority scoring
- Estimated effort

---

### Demo and Utility Endpoints

GET /api/v1/demo

Instant demo with pre-loaded vulnerable code (29 vulnerabilities).

---

GET /api/v1/metrics

Time-saved calculations and efficiency metrics.

Response
{
  "total_vulnerabilities": 29,
  "manual_review_time_minutes": 435,
  "automated_scan_time_minutes": 2,
  "time_saved_minutes": 433,
  "time_saved_hours": 7.2,
  "efficiency_improvement": "100%"
}

---

GET /api/v1/vulnerabilities/:severity

Filter vulnerabilities by severity:
CRITICAL, HIGH, MEDIUM, LOW

---

## Detection Capabilities

### OWASP Top 10 Coverage

- A01: Broken Access Control — Missing authentication, exposed admin routes
- A02: Cryptographic Failures — Weak hashing (MD5, SHA1), hardcoded secrets
- A03: Injection — SQL, NoSQL, command, and code injection
- A04: Insecure Design — Missing rate limiting, weak session tokens
- A05: Security Misconfiguration — CORS wildcards, disabled SSL verification
- A06: Vulnerable Components — Outdated dependencies
- A07: Authentication Failures — Weak passwords, missing JWT expiry
- A08: Software and Data Integrity — eval(), unsafe deserialization
- A09: Logging Failures — Missing error handling
- A10: SSRF — Unvalidated URL fetching

### Detection Features

- Confidence scoring (0.0–1.0) for each finding
- Risk-adjusted impact calculation
- Fix suggestions for every vulnerability
- Security explanations ("Why it matters")
- Line-level detection with file and line numbers

---

## Architecture

main-repo/
├── engine/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   │   └── auditController.js
│   ├── routes/
│   │   └── audit.js
│   ├── services/
│   │   ├── auditService.js
│   │   ├── runAudit.js
│   │   ├── runAuditWithRemediation.js
│   │   ├── formatResponse.js
│   │   ├── remediation.js
│   │   └── mockRepo.js
│   ├── middleware/
│   └── config/
├── security_rules/
│   ├── index.js
│   └── impact.js
└── README.md

---

## Key Features

1. Real Static Analysis
- Pattern-based detection (not AI guessing)
- 29 vulnerability types detected
- Deterministic and explainable results

2. Business Impact Metrics
- $18,500 estimated savings (demo data)
- 7.2 hours time saved per scan
- Risk-adjusted scoring

3. IBM Bob Integration
- Structured prompts for automated fixes
- Test case generation
- Priority and effort estimation

4. Production-Ready API
- RESTful design
- Helmet security middleware
- Morgan logging
- Error handling
- Request validation

---

## Testing

# Health check
curl http://localhost:3000/health

# Demo scan
curl http://localhost:3000/api/v1/demo

# Metrics
curl http://localhost:3000/api/v1/metrics

# Critical vulnerabilities
curl http://localhost:3000/api/v1/vulnerabilities/CRITICAL

---

## Demo Results

Mock Repository Analysis:
- 29 vulnerabilities detected
- 2 CRITICAL (SSRF, Command Injection)
- 14 HIGH (SQL Injection, XSS, etc.)
- 13 MEDIUM (Weak crypto, misconfigurations)
- Overall Security Score: 42/100

---

## Tech Stack

- Node.js 18+
- Express.js
- Helmet
- Morgan
- Custom OWASP Engine

---

## Team AVON

Built for IBM Bob Hackathon 2026

Mission:
Make security audits instant, automated, and actionable.
