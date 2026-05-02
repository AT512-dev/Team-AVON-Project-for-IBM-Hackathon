'use strict';

/**
 * ============================================================
 * CodeGuard AI — auditService.js
 * ============================================================
 * Dynamic, real-time analysis engine.
 *
 * LIVE mode flow:
 *   1. Walk the cloned repo → extract source files
 *   2. Batch files (≤ BATCH_CHAR_LIMIT chars per call)
 *   3. Send each batch to WatsonX granite-13b-chat-v2 with the
 *      OWASP system prompt — model returns structured JSON
 *   4. Validate & merge JSON results
 *   5. OWASP static scan runs in parallel as a safety net
 *   6. Return merged, deduplicated findings
 *
 * DEMO mode → pass-through to mock repo (no WatsonX call).
 * Empty repo → clean state { vulnerabilities: [] }.
 * ============================================================
 */

const path = require('path');
const fs   = require('fs').promises;

const { runAudit }               = require('./runAudit');
const { runAuditWithRemediation} = require('./runAuditWithRemediation');
const ibmBobClient               = require('../config/ibmBobClient');

// ── Constants ──────────────────────────────────────────────────────────────────

/** File extensions the live engine reads */
const LIVE_EXTENSIONS = new Set(['.js', '.py', '.ts', '.java', '.go']);

/** Dirs that are always skipped during the FS walk */
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next',
  'coverage', 'vendor', '__pycache__', '.cache', 'tmp'
]);

/** Max chars sent per WatsonX API call (≈ 45 kB of text) */
const BATCH_CHAR_LIMIT = 45_000;

/** Max files included in a single batch */
const BATCH_FILE_LIMIT = 20;

/** Max individual file size read (files larger than this are skipped) */
const MAX_FILE_BYTES = 150_000;

// ── OWASP 29 vulnerability categories (for the system prompt) ─────────────────
const OWASP_CATEGORIES = [
  'A01-Broken Access Control', 'A02-Cryptographic Failures',
  'A03-Injection (SQL/Command/LDAP/XPath)', 'A04-Insecure Design',
  'A05-Security Misconfiguration', 'A06-Vulnerable Components',
  'A07-Authentication Failures', 'A08-Integrity Failures',
  'A09-Logging Failures', 'A10-SSRF',
  'Hardcoded Secrets/Credentials', 'XSS (Reflected/Stored/DOM)',
  'Path Traversal', 'XML External Entities (XXE)', 'Insecure Deserialization',
  'Race Condition', 'Use-After-Free', 'Buffer Overflow',
  'Integer Overflow', 'Format String', 'Open Redirect',
  'CORS Misconfiguration', 'Prototype Pollution', 'ReDoS',
  'Template Injection', 'Weak Hashing Algorithm',
  'Timing Attack', 'Mass Assignment', 'Unvalidated Redirects'
].join(', ');

// ─────────────────────────────────────────────────────────────────────────────
// 1. Recursive file reader
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Walk a cloned repo directory and return file objects for supported extensions.
 * Skips noise directories, binary-like files, and files exceeding MAX_FILE_BYTES.
 *
 * @param {string} rootDir - Absolute path to the cloned repo
 * @returns {Promise<Array<{file: string, content: string, byteSize: number}>>}
 */
async function readRepoFiles(rootDir) {
  const results = [];

  async function walk(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
      console.warn(`[FILE-READER] Cannot read dir ${dir}: ${err.message}`);
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) {
          await walk(path.join(dir, entry.name));
        }
        continue;
      }

      if (!entry.isFile()) continue;

      const ext = path.extname(entry.name).toLowerCase();
      if (!LIVE_EXTENSIONS.has(ext)) continue;

      const fullPath = path.join(dir, entry.name);

      let stat;
      try { stat = await fs.stat(fullPath); } catch { continue; }
      if (stat.size > MAX_FILE_BYTES) {
        console.warn(`[FILE-READER] Skipping oversized file (${stat.size} B): ${fullPath}`);
        continue;
      }

      let content;
      try {
        content = await fs.readFile(fullPath, 'utf-8');
      } catch (err) {
        console.warn(`[FILE-READER] Cannot read ${fullPath}: ${err.message}`);
        continue;
      }

      results.push({
        file:     path.relative(rootDir, fullPath).replace(/\\/g, '/'),
        content,
        byteSize: stat.size
      });
    }
  }

  await walk(rootDir);
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Batch builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split files into batches small enough for one WatsonX call.
 *
 * @param {Array} files
 * @returns {Array<Array>} - Array of batches
 */
function buildBatches(files) {
  const batches = [];
  let current   = [];
  let charCount  = 0;

  for (const f of files) {
    const size = f.content.length;

    // If a single file is already too big, send it alone
    if (size > BATCH_CHAR_LIMIT) {
      if (current.length) { batches.push(current); current = []; charCount = 0; }
      batches.push([f]);
      continue;
    }

    if (charCount + size > BATCH_CHAR_LIMIT || current.length >= BATCH_FILE_LIMIT) {
      if (current.length) batches.push(current);
      current   = [f];
      charCount  = size;
    } else {
      current.push(f);
      charCount += size;
    }
  }

  if (current.length) batches.push(current);
  return batches;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. WatsonX prompt builder & response parser
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the structured system prompt for a batch of files.
 *
 * @param {Array} batch - Array of file objects
 * @returns {string}
 */
function buildSystemPrompt(batch) {
  const codeSection = batch
    .map(f => `// ===== FILE: ${f.file} =====\n${f.content}`)
    .join('\n\n');

  return (
    `You are a professional security auditor. Analyze the provided source code ` +
    `for the 29 OWASP vulnerability types: ${OWASP_CATEGORIES}.\n\n` +

    `Return ONLY valid JSON — no markdown, no explanation outside JSON.\n` +
    `If no vulnerabilities are found return: {"vulnerabilities":[]}\n\n` +

    `Required JSON schema for each finding:\n` +
    `{\n` +
    `  "vulnerabilities": [\n` +
    `    {\n` +
    `      "type":           "<OWASP category name>",\n` +
    `      "severity":       "CRITICAL|HIGH|MEDIUM|LOW",\n` +
    `      "file":           "<relative file path exactly as shown>",\n` +
    `      "line":           <exact line number integer>,\n` +
    `      "code":           "<the tainted code snippet from the file>",\n` +
    `      "description":    "<concise explanation of the vulnerability>",\n` +
    `      "fix_suggestion": "<concrete remediation using only logic found in the scanned code>",\n` +
    `      "confidence":     <float 0.0-1.0>\n` +
    `    }\n` +
    `  ]\n` +
    `}\n\n` +

    `IMPORTANT RULES:\n` +
    `- "line" must be the exact line number where the vulnerable code appears.\n` +
    `- "code" must be the literal tainted code snippet copied from the source.\n` +
    `- "fix_suggestion" must be grounded in the actual code — no generic advice.\n` +
    `- Do NOT invent vulnerabilities that are not present in the code.\n` +
    `- Do NOT hallucinate files or line numbers not in the provided code.\n\n` +

    `SOURCE CODE TO ANALYZE:\n\n${codeSection}`
  );
}

/**
 * Parse WatsonX raw text response into an array of vulnerability objects.
 * Gracefully handles truncated or partially-formatted JSON.
 *
 * @param {string} rawText
 * @returns {Array}
 */
function parseWatsonXResponse(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  // Extract the first JSON object from the response
  const jsonStart = rawText.indexOf('{');
  const jsonEnd   = rawText.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return [];

  const jsonStr = rawText.slice(jsonStart, jsonEnd + 1);

  try {
    const parsed = JSON.parse(jsonStr);
    const vulns  = parsed.vulnerabilities;

    if (!Array.isArray(vulns)) return [];

    // Validate & normalise each finding
    return vulns
      .filter(v => v && typeof v === 'object' && v.type && v.file)
      .map(v => ({
        type:           String(v.type).trim(),
        severity:       ['CRITICAL','HIGH','MEDIUM','LOW'].includes(String(v.severity).toUpperCase())
                          ? String(v.severity).toUpperCase()
                          : 'MEDIUM',
        file:           String(v.file).trim(),
        line:           Number.isInteger(Number(v.line)) && Number(v.line) > 0
                          ? Number(v.line)
                          : 1,
        code:           String(v.code || '').trim(),
        description:    String(v.description || '').trim(),
        fix_suggestion: String(v.fix_suggestion || '').trim(),
        confidence:     typeof v.confidence === 'number'
                          ? Math.min(1, Math.max(0, v.confidence))
                          : 0.8,
        source:         'watsonx-ai'
      }));
  } catch (err) {
    console.warn('[WATSON-PARSER] JSON parse failed:', err.message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4a. Pre-scan WatsonX Heartbeat
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the WatsonX heartbeat reflector BEFORE the real scan.
 * Sends the first 10 characters of actual cloned code as the probe string.
 * This proves WatsonX is reading the current repo — not cached/old data.
 *
 * Throws AI_INTEGRATION_FAILED if the connection is completely dead.
 * Logs a warning (non-fatal) if the echo doesn't match.
 *
 * @param {Array} repoFiles - Files read from the cloned repo
 */
async function runHeartbeatCheck(repoFiles) {
  // Grab first 10 chars of the first file's content as the unique probe
  const firstFile    = repoFiles[0];
  const codeSnippet  = firstFile ? firstFile.content.slice(0, 10) : 'CODEGUARD';

  console.log('[HEARTBEAT] ── Pre-Scan Diagnostic ───────────────────────');
  console.log(`[HEARTBEAT] Using code probe from: "${firstFile?.file}"`);
  console.log(`[HEARTBEAT] Code probe (first 10 chars): "${codeSnippet}"`);

  const hb = await ibmBobClient.heartbeat(codeSnippet);

  if (!hb.alive) {
    // Hard failure — WatsonX is completely unreachable
    const err = new Error(
      `AI_INTEGRATION_FAILED: WatsonX heartbeat failed before scan. ` +
      `IBM Cloud may be unreachable or credentials are invalid. ` +
      `Detail: ${hb.error || 'no response'}`
    );
    err.code = 'AI_INTEGRATION_FAILED';
    throw err;
  }

  if (!hb.echoMatch) {
    // Soft warning — connected but model output looks off
    console.warn(
      `[HEARTBEAT] ⚠  Echo mismatch — WatsonX responded but did not echo 'READY'. ` +
      `Raw: "${hb.raw.slice(0, 80)}". Proceeding with caution.`
    );
  } else {
    console.log(`[HEARTBEAT] ✓  WatsonX confirmed active — ${hb.latencyMs}ms, echo matched.`);
  }

  console.log('[HEARTBEAT] ────────────────────────────────────────────────\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4b. Hallucination filter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Remove any AI finding whose "file" path does not exist in the actual repo.
 * If WatsonX mentions a file that wasn't cloned, it's hallucinating.
 *
 * @param {Array} aiVulns   - Findings returned by WatsonX
 * @param {Array} repoFiles - Files actually read from the cloned repo
 * @returns {Array} Filtered, verified findings
 */
function filterHallucinatedFindings(aiVulns, repoFiles) {
  const realPaths = new Set(repoFiles.map(f => f.file));
  const verified  = [];
  const rejected  = [];

  for (const vuln of aiVulns) {
    if (realPaths.has(vuln.file)) {
      verified.push(vuln);
    } else {
      rejected.push(vuln);
    }
  }

  if (rejected.length > 0) {
    console.warn(
      `[HALLUCINATION-GUARD] ✗ Rejected ${rejected.length} AI finding(s) ` +
      `referencing non-existent files:`
    );
    rejected.forEach(v =>
      console.warn(`  → "${v.file}" (line ${v.line}) — NOT in cloned repo manifest`)
    );
  }

  console.log(
    `[HALLUCINATION-GUARD] ✓ ${verified.length}/${aiVulns.length} AI findings ` +
    `passed file-path verification.`
  );

  return verified;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4c. Core WatsonX batch scanner (with payload logging & response validation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send one batch of files to WatsonX and return parsed, validated findings.
 *
 * Logging:   Prints the EXACT prompt payload so you can see real code is inside.
 * Validation: Throws AI_INTEGRATION_FAILED if response is empty, an error
 *             string, or generic non-JSON text (not a real analysis).
 *
 * @param {Array}  batch
 * @param {number} batchIndex
 * @returns {Promise<Array>}
 */
async function scanBatchWithWatsonX(batch, batchIndex) {
  const fileList = batch.map(f => f.file).join(', ');

  // ── Build the prompt ────────────────────────────────────────────────────
  const prompt = buildSystemPrompt(batch);

  // ── PAYLOAD LOG — proves real code is in the message ───────────────────
  console.log(
    `\n[WATSONX-PAYLOAD] ═══ Batch ${batchIndex + 1} ═══════════════════════════════`
  );
  console.log(`[WATSONX-PAYLOAD] Files   : [${fileList}]`);
  console.log(`[WATSONX-PAYLOAD] Chars   : ${prompt.length}`);
  console.log(`[WATSONX-PAYLOAD] Model   : ibm/granite-13b-chat-v2`);
  // Print the first 500 chars of the prompt — enough to confirm real code is present
  console.log(
    `[WATSONX-PAYLOAD] Prompt preview (first 500 chars):\n` +
    `${'─'.repeat(60)}\n` +
    `${prompt.slice(0, 500)}\n` +
    `${'─'.repeat(60)}`
  );
  console.log(`[WATSONX-PAYLOAD] ════════════════════════════════════════════\n`);

  // ── Send to WatsonX ─────────────────────────────────────────────────────
  const response = await ibmBobClient.scan({
    prompt,
    options: {
      max_tokens:  2000,
      temperature: 0.1   // Low temp → deterministic, less hallucination
    }
  });

  // ── RESPONSE VALIDATION ─────────────────────────────────────────────────
  if (!response.success) {
    // IBM client returned a network/auth failure
    const err = new Error(
      `AI_INTEGRATION_FAILED: WatsonX batch ${batchIndex + 1} returned an error. ` +
      `Detail: ${response.error || response.message || 'unknown'}`
    );
    err.code = 'AI_INTEGRATION_FAILED';
    throw err;
  }

  const rawText = typeof response.data === 'string' ? response.data : '';

  // Detect empty response
  if (!rawText || rawText.trim().length === 0) {
    const err = new Error(
      `AI_INTEGRATION_FAILED: WatsonX batch ${batchIndex + 1} returned an empty response.`
    );
    err.code = 'AI_INTEGRATION_FAILED';
    throw err;
  }

  // Detect generic/error text — model should always return JSON
  const isGenericError = (
    rawText.trim().startsWith('Error') ||
    rawText.trim().startsWith('Sorry') ||
    rawText.trim().startsWith('I cannot') ||
    rawText.trim().startsWith('I am unable') ||
    (!rawText.includes('{') && !rawText.includes('vulnerabilities'))
  );

  if (isGenericError) {
    const err = new Error(
      `AI_INTEGRATION_FAILED: WatsonX batch ${batchIndex + 1} returned non-JSON output. ` +
      `The model did not perform a security analysis. ` +
      `Raw (first 200 chars): "${rawText.slice(0, 200)}"`
    );
    err.code = 'AI_INTEGRATION_FAILED';
    throw err;
  }

  // ── Parse and log results ───────────────────────────────────────────────
  const findings = parseWatsonXResponse(rawText);
  console.log(
    `[WATSONX] Batch ${batchIndex + 1}: ${findings.length} finding(s) parsed ` +
    `from ${rawText.length} char response.`
  );

  return findings;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Deduplication
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge static OWASP findings with WatsonX AI findings.
 * Static findings enriched by AI duplicates (same file+line) are merged.
 * AI-only findings are appended.
 *
 * @param {Array} staticVulns  - From OWASP regex scanner
 * @param {Array} aiVulns      - From WatsonX
 * @returns {Array}
 */
function mergeFindings(staticVulns, aiVulns) {
  const key    = v => `${v.file}:${v.line}`;
  const merged = [...staticVulns];
  const seen   = new Set(staticVulns.map(key));

  for (const av of aiVulns) {
    const k = key(av);
    if (seen.has(k)) {
      // Enrich existing static finding with AI description
      const idx = merged.findIndex(v => key(v) === k);
      if (idx !== -1 && av.description) {
        merged[idx] = {
          ...merged[idx],
          description:    av.description || merged[idx].description,
          fix_suggestion: av.fix_suggestion || merged[idx].fix_suggestion,
          ai_enhanced:    true
        };
      }
    } else {
      seen.add(k);
      merged.push({ ...av, ai_enhanced: true });
    }
  }

  // Sort: CRITICAL → HIGH → MEDIUM → LOW
  const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  merged.sort((a, b) =>
    (order[a.severity] ?? 4) - (order[b.severity] ?? 4)
  );

  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Score & summary helpers
// ─────────────────────────────────────────────────────────────────────────────

function calculateOverallScore(vulnerabilities) {
  const WEIGHTS = { CRITICAL: 30, HIGH: 15, MEDIUM: 7, LOW: 2 };
  const deduction = vulnerabilities.reduce((sum, v) => {
    return sum + (WEIGHTS[v.severity?.toUpperCase()] ?? 0);
  }, 0);
  return Math.round(Math.max(0, 100 - Math.min(deduction, 100)));
}

function buildScanSummary(vulnerabilities) {
  return {
    total_issues: vulnerabilities.length,
    critical: vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
    high:     vulnerabilities.filter(v => v.severity === 'HIGH').length,
    medium:   vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
    low:      vulnerabilities.filter(v => v.severity === 'LOW').length
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAIN LIVE AUDIT FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Full live audit engine:
 *   read real files → batch → WatsonX AI scan → OWASP static scan → merge
 *
 * Constraint: empty repo returns { vulnerabilities: [] } — never hallucinates.
 *
 * @param {string} repoPath - Absolute path to the cloned repository
 * @returns {Promise<Object>} Audit result object
 */
async function performAuditLive(repoPath) {
  console.log('\n[LIVE AUDIT] ══════════════════════════════════════════════');
  console.log(`[LIVE AUDIT] Starting real-time scan: ${repoPath}`);

  // ── Step 1: Read all supported source files ───────────────────────────────
  const repoFiles = await readRepoFiles(repoPath);

  if (!repoFiles || repoFiles.length === 0) {
    console.log('[LIVE AUDIT] No supported files found — returning clean state');
    return buildCleanResult(repoPath);
  }

  console.log(`[LIVE AUDIT] Found ${repoFiles.length} source file(s): [${
    repoFiles.map(f => f.file).join(', ')
  }]`);

  // ── Step 2: WatsonX Heartbeat — BEFORE sending any real code ─────────────
  // Sends the first 10 chars of real cloned code as a probe.
  // Throws AI_INTEGRATION_FAILED immediately if WatsonX is unreachable.
  await runHeartbeatCheck(repoFiles);

  // ── Step 3: OWASP static analysis (guaranteed baseline, all files) ────────
  const staticResult = runAudit(repoFiles);
  const staticVulns  = staticResult.vulnerabilities ?? [];
  console.log(`[STATIC]     ${staticVulns.length} OWASP static finding(s)`);

  // ── Step 4: WatsonX AI contextual analysis (batched, with payload logging) ─
  const batches = buildBatches(repoFiles);
  console.log(`[WATSONX]    Sending ${batches.length} batch(es) to granite-13b-chat-v2`);

  // Use allSettled so one bad batch doesn't kill the whole scan.
  // AI_INTEGRATION_FAILED errors from individual batches are logged but the
  // static results are still returned — engineer can see exactly which batch
  // failed from the console output.
  const batchResults = await Promise.allSettled(
    batches.map((batch, i) => scanBatchWithWatsonX(batch, i))
  );

  let aiIntegrationFailed = false;
  const rawAiVulns = batchResults.flatMap(r => {
    if (r.status === 'rejected') {
      const isAiFailure = r.reason?.code === 'AI_INTEGRATION_FAILED';
      if (isAiFailure) aiIntegrationFailed = true;
      console.error(`[WATSONX] Batch error: ${r.reason?.message}`);
      return [];
    }
    return r.value;
  });
  console.log(`[WATSONX]    ${rawAiVulns.length} raw AI finding(s) received`);

  // ── Step 5: Hallucination filter ─────────────────────────────────────────
  // Cross-check every AI-reported file path against the real repo manifest.
  // Findings referencing non-existent files are rejected as hallucinations.
  const verifiedAiVulns = filterHallucinatedFindings(rawAiVulns, repoFiles);

  // ── Step 6: Merge & deduplicate ───────────────────────────────────────────
  const allVulnerabilities = mergeFindings(staticVulns, verifiedAiVulns);
  console.log(`[LIVE AUDIT] ${allVulnerabilities.length} merged finding(s) (after dedup)`);

  // ── Step 7: Assemble final result ─────────────────────────────────────────
  const aiEnhancedCount = allVulnerabilities.filter(v => v.ai_enhanced).length;

  const result = {
    ...staticResult,
    vulnerabilities:    allVulnerabilities,
    scan_summary:       buildScanSummary(allVulnerabilities),
    overallScore:       calculateOverallScore(allVulnerabilities),
    auditTimestamp:     new Date().toISOString(),
    filesScanned:       repoFiles.length,
    scanMode:           'live',
    ai_powered:         true,
    ai_enhanced_count:  aiEnhancedCount,
    ai_integration_ok:  !aiIntegrationFailed,
    watsonx_batches:    batches.length,
    meta: {
      engine:  'CodeGuard AI',
      version: '2.0',
      mode:    'WatsonX + OWASP Static Analysis',
      model:   'ibm/granite-13b-chat-v2'
    }
  };

  console.log(
    `[LIVE AUDIT] ✓ Complete — ${allVulnerabilities.length} findings, ` +
    `score ${result.overallScore}/100, AI ok: ${result.ai_integration_ok}`
  );
  console.log('[LIVE AUDIT] ══════════════════════════════════════════════\n');

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. LIVE AUDIT + REMEDIATION (deep WatsonX remediation for critical findings)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Live audit with additional per-vulnerability deep remediation from WatsonX.
 *
 * @param {string} repoPath
 * @returns {Promise<Object>}
 */
async function performAuditWithRemediationLive(repoPath) {
  console.log('[LIVE AUDIT] Starting real scan with WatsonX deep remediation');

  // Run the base live audit first
  const baseResult = await performAuditLive(repoPath);

  // Re-read files (already cached in the OS — fast)
  const repoFiles = await readRepoFiles(repoPath);

  // Request deep remediation for up to 5 CRITICAL/HIGH findings
  const priority = baseResult.vulnerabilities
    .filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH')
    .slice(0, 5);

  const aiRemediations = await Promise.all(
    priority.map(async (vuln) => {
      try {
        const fileObj    = repoFiles.find(f => f.file === vuln.file);
        const lines      = fileObj ? fileObj.content.split('\n') : [];
        const start      = Math.max(0, vuln.line - 5);
        const end        = Math.min(lines.length, vuln.line + 5);
        const codeBlock  = lines.slice(start, end).join('\n');

        const prompt =
          `Analyze the following code for security vulnerabilities and provide remediation:\n\n` +
          `File: ${vuln.file}\n` +
          `Type: ${vuln.type}\n` +
          `Severity: ${vuln.severity}\n` +
          `Description: ${vuln.description}\n\n` +
          `\`\`\`\n${codeBlock}\n\`\`\`\n\n` +
          `Provide: 1. Root cause  2. Step-by-step fix  ` +
          `3. Secure code replacement  4. Test recommendations`;

        const resp = await ibmBobClient.scan({
          prompt,
          options: { max_tokens: 1500, temperature: 0.2 }
        });

        return {
          vulnerability:  vuln,
          ai_remediation: resp.success ? resp.data : null,
          ai_powered:     resp.success
        };
      } catch (err) {
        console.error(`[LIVE AUDIT] Remediation call failed for ${vuln.file}:`, err.message);
        return { vulnerability: vuln, ai_remediation: null, ai_powered: false };
      }
    })
  );

  return {
    ...baseResult,
    scanMode:             'live_with_remediation',
    ai_remediations:      aiRemediations,
    ai_remediation_count: aiRemediations.filter(r => r.ai_powered).length
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. DEMO / LEGACY helpers (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return a clean (no findings) result — used when the repo has no scannable files.
 */
function buildCleanResult(repoPath) {
  return {
    vulnerabilities: [],
    scan_summary:    buildScanSummary([]),
    overallScore:    100,
    auditTimestamp:  new Date().toISOString(),
    filesScanned:    0,
    scanMode:        'live',
    ai_powered:      true,
    message:         'No supported source files found in repository — clean state.',
    meta: {
      engine:  'CodeGuard AI',
      version: '2.0',
      mode:    'WatsonX + OWASP Static Analysis',
      model:   'ibm/granite-13b-chat-v2'
    }
  };
}

/**
 * DEMO / legacy audit (uses mock repo or pre-supplied files, no WatsonX call).
 */
async function performAudit(repoPath, options = {}) {
  const repoFiles = Array.isArray(repoPath)
    ? repoPath
    : await parseRepoFiles(repoPath);

  if (!repoFiles || repoFiles.length === 0) {
    throw new Error('No files found to audit.');
  }

  const auditResult         = runAudit(repoFiles);
  auditResult.overallScore  = calculateOverallScore(auditResult.vulnerabilities);
  auditResult.auditTimestamp = new Date().toISOString();
  auditResult.filesScanned  = repoFiles.length;
  return auditResult;
}

/**
 * DEMO audit with remediation (no WatsonX).
 */
async function performAuditWithRemediation(repoPath) {
  const repoFiles = Array.isArray(repoPath)
    ? repoPath
    : await parseRepoFiles(repoPath);

  if (!repoFiles || repoFiles.length === 0) {
    throw new Error('No files found to audit.');
  }

  const auditResult         = await runAuditWithRemediation(repoFiles);
  auditResult.overallScore  = calculateOverallScore(auditResult.vulnerabilities);
  auditResult.auditTimestamp = new Date().toISOString();
  auditResult.filesScanned  = repoFiles.length;
  return auditResult;
}

/**
 * Parse a directory path into an array of file objects (used by demo/legacy paths).
 */
async function parseRepoFiles(repoPath) {
  if (!repoPath || typeof repoPath !== 'string') {
    throw new Error('Invalid repository path');
  }

  const stats = await fs.stat(repoPath).catch(err => {
    throw new Error(`Cannot access repository path: ${err.message}`);
  });

  if (!stats.isDirectory()) {
    throw new Error('Repository path is not a directory');
  }

  // Import the broader scanner (used by demo mode — supports more extensions)
  const { scanDirectory } = require('./utils/fileScanner');
  const files = await scanDirectory(repoPath);

  if (files.length === 0) {
    throw new Error('No supported files found in repository.');
  }

  return files;
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // Live AI-powered functions (used by /api/v1/scan in live mode)
  performAuditLive,
  performAuditWithRemediationLive,

  // Demo / legacy functions (used by /api/v1/scan in demo mode)
  performAudit,
  performAuditWithRemediation,

  // Utility — used by other services
  calculateOverallScore,

  // Exposed for testing
  readRepoFiles,
  buildBatches,
  parseWatsonXResponse,
  mergeFindings,
  filterHallucinatedFindings,
  runHeartbeatCheck
};
