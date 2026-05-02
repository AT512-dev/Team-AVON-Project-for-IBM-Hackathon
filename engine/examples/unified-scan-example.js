/**
 * UNIFIED SCAN ENDPOINT - Usage Examples
 * 
 * This demonstrates how to use the new /api/v1/scan endpoint
 * that intelligently switches between Demo Mode and Live Mode
 * 
 * @author Team AVON - CodeGuard AI
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api/v1';

// ============================================
// EXAMPLE 1: DEMO MODE SCAN
// ============================================
async function runDemoScan() {
  console.log('\n=== DEMO MODE SCAN ===');
  console.log('Using mock vulnerable code for demonstration\n');
  
  try {
    const response = await axios.post(`${API_BASE}/scan`, {
      isDemoMode: true,
      includeRemediation: false
    });
    
    console.log('✅ Demo scan completed successfully!');
    console.log(`Mode: ${response.data.mode}`);
    console.log(`Files scanned: ${response.data.data.filesScanned}`);
    console.log(`Vulnerabilities found: ${response.data.data.vulnerabilities.length}`);
    console.log(`Overall score: ${response.data.data.overallScore}/100`);
    
    return response.data;
  } catch (error) {
    console.error('❌ Demo scan failed:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// EXAMPLE 2: LIVE MODE SCAN (Real Repository)
// ============================================
async function runLiveScan(repoUrl) {
  console.log('\n=== LIVE MODE SCAN ===');
  console.log(`Scanning real repository: ${repoUrl}\n`);
  
  try {
    const response = await axios.post(`${API_BASE}/scan`, {
      isDemoMode: false,
      repoUrl: repoUrl,
      includeRemediation: false
    });
    
    console.log('✅ Live scan completed successfully!');
    console.log(`Mode: ${response.data.mode}`);
    console.log(`Repository: ${response.data.metadata.repoUrl}`);
    console.log(`Files scanned: ${response.data.data.filesScanned}`);
    console.log(`Vulnerabilities found: ${response.data.data.vulnerabilities.length}`);
    console.log(`Overall score: ${response.data.data.overallScore}/100`);
    console.log(`AI-enhanced vulnerabilities: ${response.data.data.ai_analyzed_count || 0}`);
    
    return response.data;
  } catch (error) {
    console.error('❌ Live scan failed:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// EXAMPLE 3: LIVE MODE WITH AI REMEDIATION
// ============================================
async function runLiveScanWithRemediation(repoUrl) {
  console.log('\n=== LIVE MODE SCAN WITH AI REMEDIATION ===');
  console.log(`Scanning with full WatsonX AI remediation: ${repoUrl}\n`);
  
  try {
    const response = await axios.post(`${API_BASE}/scan`, {
      isDemoMode: false,
      repoUrl: repoUrl,
      includeRemediation: true
    });
    
    console.log('✅ Live scan with remediation completed!');
    console.log(`Mode: ${response.data.mode}`);
    console.log(`Files scanned: ${response.data.data.filesScanned}`);
    console.log(`Vulnerabilities found: ${response.data.data.vulnerabilities.length}`);
    console.log(`AI-powered remediations: ${response.data.data.ai_remediation_count || 0}`);
    console.log(`Overall score: ${response.data.data.overallScore}/100`);
    
    // Display AI remediations
    if (response.data.data.ai_remediations) {
      console.log('\n📋 AI-Powered Remediation Plans:');
      response.data.data.ai_remediations.forEach((rem, idx) => {
        console.log(`\n${idx + 1}. ${rem.vulnerability.type} in ${rem.vulnerability.file}`);
        console.log(`   Severity: ${rem.vulnerability.severity}`);
        console.log(`   AI-Powered: ${rem.ai_powered ? '✅' : '❌'}`);
        if (rem.ai_powered) {
          console.log(`   Remediation: ${rem.ai_remediation.substring(0, 100)}...`);
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Live scan with remediation failed:', error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// EXAMPLE 4: ERROR HANDLING - Invalid URL
// ============================================
async function testInvalidUrl() {
  console.log('\n=== ERROR HANDLING TEST ===');
  console.log('Testing with invalid URL\n');
  
  try {
    await axios.post(`${API_BASE}/scan`, {
      isDemoMode: false,
      repoUrl: 'not-a-valid-url',
      includeRemediation: false
    });
  } catch (error) {
    console.log('✅ Correctly rejected invalid URL');
    console.log(`Error: ${error.response?.data?.error}`);
    console.log(`Message: ${error.response?.data?.message}`);
  }
}

// ============================================
// EXAMPLE 5: ERROR HANDLING - Missing URL in Live Mode
// ============================================
async function testMissingUrl() {
  console.log('\n=== MISSING URL TEST ===');
  console.log('Testing live mode without URL\n');
  
  try {
    await axios.post(`${API_BASE}/scan`, {
      isDemoMode: false,
      includeRemediation: false
    });
  } catch (error) {
    console.log('✅ Correctly rejected missing URL');
    console.log(`Error: ${error.response?.data?.error}`);
    console.log(`Message: ${error.response?.data?.message}`);
  }
}

// ============================================
// MAIN EXECUTION
// ============================================
async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   CodeGuard AI - Unified Scan Endpoint Examples       ║');
  console.log('║   Demo Mode vs Live Mode with WatsonX Integration     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  try {
    // Test 1: Demo Mode
    await runDemoScan();
    
    // Test 2: Error Handling
    await testInvalidUrl();
    await testMissingUrl();
    
    // Test 3: Live Mode (uncomment and provide a real repo URL)
    // const testRepoUrl = 'https://github.com/your-username/your-repo.git';
    // await runLiveScan(testRepoUrl);
    
    // Test 4: Live Mode with Remediation (uncomment and provide a real repo URL)
    // await runLiveScanWithRemediation(testRepoUrl);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
}

// ============================================
// CURL EXAMPLES FOR REFERENCE
// ============================================
console.log('\n📝 CURL EXAMPLES:\n');
console.log('1. Demo Mode:');
console.log('curl -X POST http://localhost:3001/api/v1/scan \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"isDemoMode": true, "includeRemediation": false}\'\n');

console.log('2. Live Mode:');
console.log('curl -X POST http://localhost:3001/api/v1/scan \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"isDemoMode": false, "repoUrl": "https://github.com/user/repo.git", "includeRemediation": false}\'\n');

console.log('3. Live Mode with AI Remediation:');
console.log('curl -X POST http://localhost:3001/api/v1/scan \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"isDemoMode": false, "repoUrl": "https://github.com/user/repo.git", "includeRemediation": true}\'\n');

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  runDemoScan,
  runLiveScan,
  runLiveScanWithRemediation,
  testInvalidUrl,
  testMissingUrl
};

// Made with Bob
