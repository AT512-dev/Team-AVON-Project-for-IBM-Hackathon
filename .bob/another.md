Here is your consolidated project report and behavioral framework. I have integrated them into a single, cohesive document that flows from project metrics into the technical logic and AI guidelines.

# CodeGuard AI: Project Report & Behavioral Framework
**Team AVON | IBM Bob Hackathon 2026**

---

## 1. Executive Summary

CodeGuard AI is an advanced static code analysis engine featuring automated vulnerability detection and AI-powered remediation. The system utilizes deterministic pattern-based analysis to identify OWASP Top 10 vulnerabilities, tracks complex data flows across multiple file boundaries, and generates precise remediation strategies via **IBM watsonx**.

### Key Metrics
- **Detection Coverage:** 29 vulnerability types
- **Test Suite:** 106 passing tests (100% success rate)
- **Performance:** ~4s static analysis / ~8s with AI remediation
- **API Architecture:** 7 production-ready REST endpoints
- **Output Formats:** Structured JSON, HTML, and Markdown

---

## 2. Core Capabilities & Analysis

### 2.1 Vulnerability Detection
The engine provides deep scanning for critical security flaws, including:
- **Injection:** SQL, NoSQL, and Command Injection (exec, spawn).
- **Broken Access Control:** Missing authentication checks and IDOR.
- **Data Exposure:** XSS (innerHTML), SSRF, and Cryptographic failures (MD5/SHA1).
- **Configurations:** Hardcoded credentials and insecure CORS/SSL settings.

### 2.2 Advanced Analysis Features
- **Cross-File Data Flow Tracking:** Taint analysis that follows user input across module boundaries.
- **Dependency Graph Construction:** Detailed function call tracing to understand application impact.
- **Automated Scoring:** CVSS severity calculation mapped directly to CWE identifiers.
- **AI Remediation:** Contextual fix suggestions grounded in security best practices.

---

## 3. IBM Bob: The AI Behavioral Framework

### 3.1 Identity & Intent
**IBM Bob** is the core intelligence layer of CodeGuard. Unlike general-purpose LLMs, Bob is a **non-hallucinating, security-first analyzer** built on IBM watsonx technology. 

- **Mission:** Identify vulnerabilities that span multiple files which traditional tools miss.
- **Design Philosophy:** Security risks are often emergent properties of interacting components. Bob analyzes the *relationship* between files, not just the code within them.

### 3.2 Operational Constraints
To ensure enterprise-grade reliability, Bob adheres to the following mandatory rules:
- **Structured Output:** Must return JSON for CI/CD integration.
- **Data Protection:** Redacts PII, API keys, and credentials automatically.
- **Confidence Threshold:** Findings with <0.7 confidence are suppressed to eliminate noise.
- **Graceful Degradation:** If the AI API is unavailable, the system fallbacks to high-performance static analysis pattern matching.

---

## 4. Cross-File Logic Methodology

Bob differentiates CodeGuard from standard scanners by following an 8-step methodology to trace "Tainted" data:

1.  **Repository Analysis:** Maps the architecture pattern (MVC, Microservices).
2.  **Dependency Graphing:** Identifies imports/exports and cross-file function calls.
3.  **Source Identification:** Tracks entry points like `req.body`, `req.params`, and `headers`.
4.  **Sink Identification:** Locates dangerous "Sinks" (SQL queries, `eval()`, file system writes).
5.  **Data Flow Tracing:** Follows the path: **Source → File A → File B → Sink**.
6.  **Sanitization Validation:** Checks for intermediate cleaners (e.g., `parseInt()`, `DOMPurify`).
7.  **Risk Calculation:** Assigns severity based on the sink type and lack of sanitization.
8.  **Reporting:** Generates a comprehensive report including the "Why" and the "How to fix."



---

## 5. Sample Detection Results

### Demo Scan Analysis (2 files, 12 vulnerabilities)
**Overall Security Grade:** F (Risk Score: 8.7/10)

| Finding | Severity | CVSS | Context |
| :--- | :--- | :--- | :--- |
| **SQL Injection** | Critical | 9.8 | Direct string concatenation in query |
| **Command Injection** | Critical | 9.8 | User input in `exec()` call |
| **Privilege Escalation**| High | 9.1 | No authorization on role update |
| **Hardcoded Secrets** | High | 9.1 | Database password found in source |

---

## 6. Testing, API & Deployment

### Quality Assurance
✓ **106 tests passing** (100% success rate)
- Security Rules: 39 tests
- Data Flow Tracker: 35 tests
- Dependency Analyzer: 32 tests

### API Endpoints
- `POST /api/v1/audit` - Execute security audit.
- `POST /api/v1/audit/remediation` - Audit with AI-generated fixes.
- `GET /api/v1/metrics` - View risk scoring and time-saved data.
- `GET /health` - Service health check.

### Deployment & Quick Start
1.  **One-Click:** Run `start-codeguard.bat`.
2.  **Manual Start:** ```bash
    cd engine && npm install && node server.js
    ```
3.  **Verify:** `curl http://localhost:3001/health`

---
**Status:** Production Ready | **Version:** 1.0.0 | **Team:** AVON