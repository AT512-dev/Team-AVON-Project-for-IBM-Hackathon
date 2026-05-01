# CodeGuard AI Engine - API Documentation

**Version**: 1.0.0  
**Base URL**: `http://localhost:3000/api/v1`  
**Team**: AVON - IBM Hackathon

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
4. [Request/Response Examples](#examples)
5. [Error Handling](#error-handling)

---

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- IBM Cloud API Key
- WatsonX Project ID

### Installation
```bash
cd engine
npm install
```

### Configuration
Create a `.env` file with:
```env
IBM_CLOUD_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
IBM_CLOUD_URL=https://us-south.ml.cloud.ibm.com
MODEL_ID=ibm/granite-13b-chat-v2
PORT=3000
NODE_ENV=development
```

### Start Server
```bash
npm start          # Production
npm run dev        # Development with auto-reload
```

---

## Authentication

Currently, the API is open for development. In production, add authentication headers:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN',
  'Content-Type': 'application/json'
}
```

---

## Endpoints

### 1. Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "service": "CodeGuard AI Engine",
  "version": "1.0.0",
  "timestamp": "2024-05-01T18:00:00.000Z"
}
```

---

### 2. Run Security Audit
**POST** `/api/v1/audit`

Perform a security audit on repository files.

**Request Body:**
```json
{
  "files": [
    {
      "file": "routes/user.js",
      "content": "const express = require('express');\n// ... your code"
    },
    {
      "file": "services/userService.js",
      "content": "// ... your code"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vulnerabilities": [
      {
        "type": "SQL_INJECTION",
        "severity": "CRITICAL",
        "file": "services/userService.js",
        "line": 42,
        "code": "db.query(`SELECT * FROM users WHERE id = '${userId}'`)",
        "description": "SQL injection vulnerability detected",
        "fix_suggestion": "Use parameterized queries",
        "confidence": 0.95
      }
    ],
    "summary": {
      "total": 5,
      "critical": 2,
      "high": 2,
      "medium": 1,
      "low": 0
    },
    "impact": {
      "time_saved_minutes": 75,
      "time_saved_hours": 1.3,
      "manual_review_cost": "$187.50",
      "automated_cost": "$0.50",
      "savings": "$187.00"
    },
    "overallScore": 42,
    "auditTimestamp": "2024-05-01T18:00:00.000Z"
  }
}
```

---

### 3. Run Audit with AI Remediation
**POST** `/api/v1/audit/remediation`

Perform audit with IBM WatsonX AI-powered remediation suggestions.

**Request Body:**
```json
{
  "files": [
    {
      "file": "routes/user.js",
      "content": "// ... your code"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vulnerabilities": [...],
    "summary": {...},
    "impact": {...},
    "remediation": {
      "total_items": 5,
      "estimated_effort_minutes": 150,
      "estimated_effort_hours": 2.5,
      "items": [
        {
          "vulnerability_id": "services/userService.js:42",
          "type": "SQL_INJECTION",
          "severity": "CRITICAL",
          "file": "services/userService.js",
          "line": 42,
          "priority": 1,
          "estimated_time_minutes": 30,
          "bob_prompt": "Fix SQL injection in userService.js line 42...",
          "test_cases": [
            "Test with malicious input: 1' OR '1'='1",
            "Verify parameterized query works correctly"
          ]
        }
      ]
    }
  }
}
```

---

### 4. Get Demo Audit
**GET** `/api/v1/demo`

Get demo audit results using mock vulnerable code.

**Response:**
```json
{
  "success": true,
  "data": {
    "vulnerabilities": [...],
    "summary": {...},
    "impact": {...}
  },
  "note": "Demo results using mock vulnerable code"
}
```

---

### 5. Get Vulnerabilities by Severity
**GET** `/api/v1/vulnerabilities/:severity`

Filter vulnerabilities by severity level.

**Parameters:**
- `severity`: `CRITICAL` | `HIGH` | `MEDIUM` | `LOW`

**Example:** `GET /api/v1/vulnerabilities/CRITICAL`

**Response:**
```json
{
  "success": true,
  "data": {
    "severity": "CRITICAL",
    "count": 2,
    "vulnerabilities": [
      {
        "type": "SQL_INJECTION",
        "severity": "CRITICAL",
        "file": "services/userService.js",
        "line": 42,
        "description": "SQL injection vulnerability"
      }
    ]
  }
}
```

---

### 6. Get Metrics
**GET** `/api/v1/metrics`

Get time-saved and efficiency metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_vulnerabilities": 5,
    "manual_review_time_minutes": 75,
    "automated_scan_time_minutes": 2,
    "time_saved_minutes": 73,
    "time_saved_hours": 1.2,
    "efficiency_improvement": "97%"
  }
}
```

---

## Request/Response Examples

### Frontend Integration (React/Vue/Angular)

```javascript
// Example: Run security audit
async function runSecurityAudit(files) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ files })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Vulnerabilities found:', result.data.vulnerabilities);
      console.log('Security score:', result.data.overallScore);
      console.log('Time saved:', result.data.impact.time_saved_hours, 'hours');
    }
    
    return result;
  } catch (error) {
    console.error('Audit failed:', error);
    throw error;
  }
}

// Example: Get demo results
async function getDemoResults() {
  const response = await fetch('http://localhost:3000/api/v1/demo');
  return await response.json();
}

// Example: Get metrics
async function getMetrics() {
  const response = await fetch('http://localhost:3000/api/v1/metrics');
  return await response.json();
}
```

### cURL Examples

```bash
# Health check
curl http://localhost:3000/health

# Run audit
curl -X POST http://localhost:3000/api/v1/audit \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {
        "file": "test.js",
        "content": "const userId = req.params.id; db.query(`SELECT * FROM users WHERE id = ${userId}`);"
      }
    ]
  }'

# Get demo
curl http://localhost:3000/api/v1/demo

# Get critical vulnerabilities
curl http://localhost:3000/api/v1/vulnerabilities/CRITICAL

# Get metrics
curl http://localhost:3000/api/v1/metrics
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message here",
  "details": "Additional error details"
}
```

### Common HTTP Status Codes
- `200 OK` - Request successful
- `400 Bad Request` - Invalid request body or parameters
- `404 Not Found` - Endpoint not found
- `500 Internal Server Error` - Server error

### Error Examples

**Missing required fields:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": "Request body must contain 'files' array"
}
```

**Invalid file format:**
```json
{
  "success": false,
  "error": "Invalid file format",
  "details": "Each file must have 'file' and 'content' properties"
}
```

**IBM WatsonX API error:**
```json
{
  "success": false,
  "error": "IBM WatsonX API unavailable",
  "details": "Using static analysis fallback"
}
```

---

## Rate Limiting

Currently no rate limiting. In production:
- 100 requests per 15 minutes per IP
- 429 status code when limit exceeded

---

## CORS Configuration

The API accepts requests from:
- Development: `*` (all origins)
- Production: Configure `FRONTEND_URL` in `.env`

---

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

---

## Support

**Team AVON**  
**IBM Hackathon 2024**

For issues or questions:
- GitHub Issues: [Repository Link]
- Email: team-avon@example.com

---

## Changelog

### Version 1.0.0 (2024-05-01)
- Initial release
- Core audit functionality
- IBM WatsonX integration
- Remediation suggestions
- Demo endpoints
- Metrics tracking

---

**Last Updated**: May 1, 2024