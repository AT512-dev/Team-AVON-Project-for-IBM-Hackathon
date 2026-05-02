'use strict';

const app          = require('./app');
const ibmBobClient = require('./config/ibmBobClient');

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`\nCodeGuard AI Engine running on http://localhost:${PORT}`);
  console.log(`   Health:     http://localhost:${PORT}/health`);
  console.log(`   Git Health: http://localhost:${PORT}/api/v1/git/health`);
  console.log(`   Fetch Repo: POST http://localhost:${PORT}/api/v1/fetch-repo`);
  console.log(`   Audit:      POST http://localhost:${PORT}/api/v1/audit\n`);

  // ── WatsonX Heartbeat — runs once on server startup ───────────────────────
  // This verifies:
  //   1. IBM_CLOUD_API_KEY is valid (IAM token exchange succeeds)
  //   2. WATSONX_PROJECT_ID is correct (model can be invoked)
  //   3. granite-13b-chat-v2 is reachable and responding
  //   4. The reflector echo is recognised (model is not returning garbage)
  console.log('[SERVER] Running WatsonX startup heartbeat…');

  try {
    const hb = await ibmBobClient.heartbeat();

    if (!hb.alive) {
      console.warn('[SERVER] ⚠  WatsonX heartbeat FAILED — live scans will fall back to static analysis only.');
      console.warn(`[SERVER]    Error: ${hb.error || 'unknown'}`);
    } else if (!hb.echoMatch) {
      console.warn(`[SERVER] ⚠  WatsonX is alive (${hb.latencyMs}ms) but echo check failed.`);
      console.warn(`[SERVER]    Raw response: "${hb.raw.slice(0, 80)}"`);
      console.warn('[SERVER]    Model may be returning unexpected output — monitor live scan quality.');
    } else {
      console.log(`[SERVER] ✓  WatsonX heartbeat OK — ${hb.latencyMs}ms latency, echo confirmed.`);
    }
  } catch (err) {
    // Non-fatal: heartbeat errors never crash the server
    console.warn('[SERVER] ⚠  Heartbeat threw unexpectedly:', err.message);
  }

  console.log('[SERVER] Ready to accept scan requests.\n');
});
