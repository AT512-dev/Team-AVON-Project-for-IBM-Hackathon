# 🛡️ CodeGuard AI - Intelligent Security Audit Engine

**Team AVON** | IBM Bob Hackathon 2026

> AI-powered static code analysis with automated vulnerability detection and remediation suggestions powered by IBM Bob.

---

## 🚀 Quick Start

```bash
cd engine
npm install
npm start
```

Server runs on **http://localhost:3000**

---

## 📡 API Endpoints

### Core Audit Endpoints

#### POST `/api/v1/audit`
Run security audit on provided code files.

**Request:**
```json
{
  "files": [
    {
      "file": "auth.js",
      "content": "const query = 'SELECT * FROM users WHERE id = ' + req.body.id;"
    }
  ]
}
```

**Response:**
```json
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
```

#### POST `/api/v1/audit/remediation`
Run audit with IBM Bob remediation suggestions.

**Response includes:**
- All vulnerability details
- Bob-ready prompts for automated fixes
- Test case templates
- Priority scoring
- Estimated effort

---

### Demo & Utility Endpoints

#### GET `/api/v1/demo`
Instant demo with pre-loaded vulnerable code (29 vulnerabilities).

#### GET `/api/v1/metrics`
Time-saved calculations and efficiency metrics.

**Response:**
```json
{
  "total_vulnerabilities": 29,
  "manual_review_time_minutes": 435,
  "automated_scan_time_minutes": 2,
  "time_saved_minutes": 433,
  "time_saved_hours": 7.2,
  "efficiency_improvement": "100%"
}
```

#### GET `/api/v1/vulnerabilities/:severity`
Filter vulnerabilities by severity (CRITICAL, HIGH, MEDIUM, LOW).

---

## 🔍 Detection Capabilities

### OWASP Top 10 Coverage

- ✅ **A01: Broken Access Control** - Missing authentication, exposed admin routes
- ✅ **A02: Cryptographic Failures** - Weak hashing (MD5, SHA1), hardcoded secrets
- ✅ **A03: Injection** - SQL, NoSQL, Command, Code injection
- ✅ **A04: Insecure Design** - Missing rate limiting, weak session tokens
- ✅ **A05: Security Misconfiguration** - CORS wildcards, disabled SSL verification
- ✅ **A06: Vulnerable Components** - Outdated dependencies
- ✅ **A07: Authentication Failures** - Weak passwords, missing JWT expiry
- ✅ **A08: Software & Data Integrity** - eval(), unsafe deserialization
- ✅ **A09: Logging Failures** - Missing error handling
- ✅ **A10: SSRF** - Unvalidated URL fetching

### Detection Features

- **Confidence Scoring** (0.0-1.0) for each finding
- **Risk-Adjusted Impact** calculation
- **Fix Suggestions** for every vulnerability
- **Security Explanations** ("Why it matters")
- **Line-level Detection** with file and line numbers

---

## 🏗️ Architecture

```
main-repo/
├── engine/                      # Backend API
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── controllers/            # Request handlers
│   │   └── auditController.js # 5 endpoint controllers
│   ├── routes/                 # API routes
│   │   └── audit.js           # Route definitions
│   ├── services/               # Business logic
│   │   ├── auditService.js    # Main audit orchestrator
│   │   ├── runAudit.js        # Core audit pipeline
│   │   ├── runAuditWithRemediation.js
│   │   ├── formatResponse.js  # Response formatter
│   │   ├── remediation.js     # Bob prompt generator
│   │   └── mockRepo.js        # Demo data
│   ├── middleware/             # Express middleware
│   └── config/                 # Configuration
├── security_rules/             # OWASP Detection Engine
│   ├── index.js               # 800+ lines of detection logic
│   └── impact.js              # Impact calculator
└── README.md                   # This file
```

---

## 🎯 Key Features

### 1. Real Static Analysis
- Pattern-based detection (not AI guessing)
- 29 vulnerability types detected
- Deterministic and explainable results

### 2. Business Impact Metrics
- **$18,500** estimated savings (demo data)
- **7.2 hours** time saved per scan
- Risk-adjusted scoring

### 3. IBM Bob Integration
- Structured prompts for automated fixes
- Test case generation
- Priority and effort estimation

### 4. Production-Ready API
- RESTful design
- Helmet security middleware
- Morgan logging
- Error handling
- Request validation

---

## 🧪 Testing

```bash
# Health check
curl http://localhost:3000/health

# Demo scan
curl http://localhost:3000/api/v1/demo | jq '.'

# Metrics
curl http://localhost:3000/api/v1/metrics | jq '.'

# Critical vulnerabilities
curl http://localhost:3000/api/v1/vulnerabilities/CRITICAL | jq '.'
```

---

## 📊 Demo Results

**Mock Repository Analysis:**
- **29 vulnerabilities** detected
- **2 CRITICAL** (SSRF, Command Injection)
- **14 HIGH** (SQL Injection, XSS, etc.)
- **13 MEDIUM** (Weak crypto, misconfigurations)
- **Overall Security Score:** 42/100

---

## 🛠️ Tech Stack

- **Node.js** 18+
- **Express.js** - Web framework
- **Helmet** - Security headers
- **Morgan** - HTTP logging
- **Custom OWASP Engine** - Static analysis

---

## 👥 Team AVON

Built for IBM Bob Hackathon 2026

**Mission:** Make security audits instant, automated, and actionable.

