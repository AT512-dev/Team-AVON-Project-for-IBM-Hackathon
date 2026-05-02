# CodeGuard AI - Project Report
**Team AVON | IBM Bob Hackathon 2026**

## Executive Summary

CodeGuard AI is a static code analysis engine with automated vulnerability detection and AI-powered remediation capabilities. The system performs deterministic pattern-based analysis to identify OWASP Top 10 vulnerabilities, tracks data flows across file boundaries, and generates remediation strategies using IBM WatsonX.

**Key Metrics:**
- **Detection Coverage:** 29 vulnerability types
- **Test Suite:** 106 passing tests (100% success rate)
- **Performance:** ~4s for static analysis, ~8s with AI remediation
- **API Endpoints:** 7 production endpoints
- **Output Formats:** JSON, HTML, Markdown

---

## Core Capabilities

### 1. Vulnerability Detection
- **SQL Injection:** Parameterized query violations, string concatenation
- **NoSQL Injection:** $where, $regex exploitation patterns
- **Command Injection:** exec, spawn, shell=true usage
- **XSS:** innerHTML, dangerouslySetInnerHTML
- **Authentication Failures:** Weak passwords, missing JWT expiry
- **Cryptographic Failures:** MD5, SHA1, hardcoded secrets
- **SSRF:** Unvalidated URL fetching
- **Code Injection:** eval, Function constructor
- **Access Control:** Missing auth checks, IDOR
- **Security Misconfigurations:** CORS wildcards, disabled SSL

### 2. Advanced Analysis Features
- **Cross-File Data Flow Tracking:** Taint analysis across module boundaries
- **Dependency Graph Construction:** Function call tracing and impact analysis
- **CVSS Scoring:** Automated severity calculation with CWE mapping
- **Impact Metrics:** Estimated time saved, risk scoring
- **Automated Remediation:** AI-generated fix suggestions (optional)

---

## Architecture Overview

### System Components

**Engine (Node.js/Express)**
- `server.js` - Express server entry point
- `auditService.js` - Main orchestration layer
- `dataFlowTracker.js` - Cross-file taint analysis
- `dependencyAnalyzer.js` - Dependency graph construction
- `bobOrchestrator.js` - IBM WatsonX integration
- `security_rules/` - 29 vulnerability detection patterns

**Dashboard (Next.js/React)** *(Optional)*
- Real-time scan visualization
- Interactive vulnerability explorer
- Metrics dashboard
- Export functionality

**Database Layer**
- SQLite for audit history
- In-memory caching for performance

---

## Sample Detection Results

### Demo Scan Analysis (2 files, 12 vulnerabilities)

**Severity Breakdown:**
- Critical: 4 (33%)
- High: 5 (42%)
- Medium: 2 (17%)
- Low: 1 (8%)

**Top Critical Findings:**

1. **SQL Injection (CVSS 9.8)**
   - File: `vulnerable_app.js:18`
   - Issue: Direct string concatenation in query
   - Data Flow: `req.params.id → userId → db.query`
   - Fix: Use parameterized queries

2. **Command Injection (CVSS 9.8)**
   - File: `vulnerable_app.js:29`
   - Issue: User input in exec() call
   - Data Flow: `req.body.filename → exec()`
   - Fix: Use spawn() with array arguments

3. **Privilege Escalation (CVSS 9.1)**
   - File: `user_service.js:23`
   - Issue: No authorization on role update
   - Impact: Any user can become admin
   - Fix: Implement RBAC checks

4. **Hardcoded Credentials (CVSS 9.1)**
   - File: `vulnerable_app.js:11`
   - Issue: Database password in source code
   - Fix: Use environment variables

**Cross-File Vulnerabilities:**
- Weak password hash propagation (MD5 → Database → Auth)
- Privilege escalation chain (missing auth + role update)

**Overall Security Grade:** F (Risk Score: 8.7/10)

---

## Testing & Quality Assurance

### Test Coverage
```
✓ Security Rules: 39 tests
✓ Data Flow Tracker: 35 tests
✓ Dependency Analyzer: 32 tests
✓ Total: 106 tests passing
✓ Execution Time: <1 second
✓ Success Rate: 100%
```

### Test Methodology
- TDD approach with integration-style validation
- Public interface testing
- Edge case coverage for all vulnerability types
- Performance benchmarking

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/audit` | POST | Run security audit |
| `/api/v1/audit/remediation` | POST | Audit with AI fixes |
| `/api/v1/demo` | GET | Demo scan (29 vulns) |
| `/api/v1/metrics` | GET | Time-saved metrics |
| `/api/v1/vulnerabilities/:severity` | GET | Filter by severity |
| `/health` | GET | Health check |

---

## Performance Benchmarks

**100-File Repository:**
- Dependency graph: ~1.2s
- Data flow detection: ~2.5s
- Static analysis: ~4s
- With AI remediation: ~8s

**Memory Usage:**
- Baseline: ~80MB
- Per file: +500KB

---

## IBM WatsonX Integration

**Status:** Optional (system works without it)

**Configuration:**
- Model: `ibm/granite-13b-chat-v2`
- Purpose: AI-powered remediation suggestions
- Fallback: Static analysis only

**Setup Required:**
1. IBM Cloud API key
2. WatsonX Project ID
3. Environment configuration

---

## Compliance Coverage

### OWASP Top 10 2021
- ✓ A01: Broken Access Control
- ✓ A03: Injection
- ✓ A07: Identification and Authentication Failures
- ✓ A02: Cryptographic Failures
- ✓ A05: Security Misconfiguration

### CWE Top 25
- ✓ CWE-89: SQL Injection
- ✓ CWE-78: OS Command Injection
- ✓ CWE-798: Hard-coded Credentials
- ✓ CWE-327: Weak Cryptography
- ✓ CWE-306: Missing Authentication

---

## Current Status

### ✅ Completed Features
- Core vulnerability detection (29 types)
- Cross-file data flow analysis
- Dependency graph construction
- CVSS scoring and CWE mapping
- REST API with 7 endpoints
- Comprehensive test suite (106 tests)
- HTML/JSON/Markdown export
- IBM WatsonX integration
- Dashboard UI (optional)

### 📋 Deployment Options
1. **One-Click Windows:** `start-codeguard.bat`
2. **Manual:** Separate engine + dashboard terminals
3. **API-Only:** Engine without dashboard

### 🔧 Configuration
- Works offline (static analysis)
- Optional IBM credentials for AI features
- Environment-based configuration
- No external dependencies for core features

---

## Recommendations

### Immediate Actions
1. Deploy to production environment
2. Configure IBM WatsonX for AI remediation
3. Set up CI/CD integration
4. Enable automated scanning

### Future Enhancements
1. Support for additional languages (Python, Java, Go)
2. Real-time IDE integration
3. Custom rule creation interface
4. Team collaboration features
5. Historical trend analysis

---

## Security Considerations

- Never commit `.env` files
- API keys server-side only
- Rotate keys every 90 days
- Separate keys per environment
- Monitor IBM Cloud usage

---

## Quick Start

```bash
# Install dependencies
cd engine && npm install

# Configure (optional)
cp .env.example .env
# Add IBM credentials if needed

# Start engine
node server.js

# Verify
curl http://localhost:3001/health
```

**Dashboard (optional):**
```bash
cd dashboard && npm install
npm run dev
```

---

## Support & Documentation

- **Architecture:** See `ARCHITECTURE.md`
- **API Docs:** See `ARCHITECTURE.md` for schemas
- **Cross-File Analysis:** See `CROSS_FILE_VULNERABILITY_DETECTION.md`
- **Demo Samples:** See `demo_samples/` directory

---

## Conclusion

CodeGuard AI successfully delivers enterprise-grade static analysis with:
- Comprehensive OWASP Top 10 coverage
- Advanced cross-file vulnerability detection
- Flexible deployment options
- Flexible deployment options