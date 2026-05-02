/**
 * Complete Audit Flow Example
 * Demonstrates the full workflow:
 * 1. Clone a repository
 * 2. Scan it for vulnerabilities
 * 3. Get remediation advice
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function completeAuditFlow() {
  console.log('=== Complete Audit Flow Example ===\n');

  try {
    // Step 1: Clone a repository
    console.log('Step 1: Cloning repository...');
    const cloneResponse = await axios.post(`${BASE_URL}/fetch-repo`, {
      repoUrl: 'https://github.com/OWASP/NodeGoat.git'
    });

    if (!cloneResponse.data.success) {
      throw new Error('Failed to clone repository');
    }

    const { workspacePath, workspaceId, fileCount } = cloneResponse.data.data;
    console.log(`✓ Repository cloned successfully`);
    console.log(`  Workspace ID: ${workspaceId}`);
    console.log(`  Workspace Path: ${workspacePath}`);
    console.log(`  Files: ${fileCount}\n`);

    // Step 2: Run security audit on cloned repository
    console.log('Step 2: Running security audit...');
    const auditResponse = await axios.post(`${BASE_URL}/audit/scan-repo`, {
      workspacePath: workspacePath,
      includeRemediation: false
    });

    if (!auditResponse.data.success) {
      throw new Error('Failed to run audit');
    }

    const auditData = auditResponse.data.data;
    console.log(`✓ Audit completed successfully`);
    console.log(`  Files Scanned: ${auditData.filesScanned}`);
    console.log(`  Overall Score: ${auditData.overallScore}/100`);
    console.log(`  Vulnerabilities Found: ${auditData.vulnerabilities.length}`);
    console.log(`  Critical: ${auditData.vulnerabilities.filter(v => v.severity === 'CRITICAL').length}`);
    console.log(`  High: ${auditData.vulnerabilities.filter(v => v.severity === 'HIGH').length}`);
    console.log(`  Medium: ${auditData.vulnerabilities.filter(v => v.severity === 'MEDIUM').length}`);
    console.log(`  Low: ${auditData.vulnerabilities.filter(v => v.severity === 'LOW').length}\n`);

    // Display sample vulnerabilities
    if (auditData.vulnerabilities.length > 0) {
      console.log('Sample Vulnerabilities:');
      auditData.vulnerabilities.slice(0, 3).forEach((vuln, idx) => {
        console.log(`  ${idx + 1}. [${vuln.severity}] ${vuln.type}`);
        console.log(`     File: ${vuln.file}:${vuln.line}`);
        console.log(`     Code: ${vuln.code.substring(0, 60)}...`);
      });
      console.log();
    }

    // Step 3: Run audit with remediation
    console.log('Step 3: Running audit with WatsonX remediation...');
    const remediationResponse = await axios.post(`${BASE_URL}/audit/scan-repo`, {
      workspacePath: workspacePath,
      includeRemediation: true
    });

    if (!remediationResponse.data.success) {
      throw new Error('Failed to run audit with remediation');
    }

    const remediationData = remediationResponse.data.data;
    console.log(`✓ Remediation analysis completed`);
    console.log(`  Total Remediation Items: ${remediationData.remediation.total_items}`);
    console.log(`  Estimated Effort: ${remediationData.remediation.estimated_effort_hours} hours\n`);

    // Display sample remediation items
    if (remediationData.remediation.items.length > 0) {
      console.log('Top Priority Remediation Items:');
      remediationData.remediation.items.slice(0, 3).forEach((item, idx) => {
        console.log(`  ${idx + 1}. [${item.severity}] ${item.type}`);
        console.log(`     File: ${item.file}:${item.line}`);
        console.log(`     Priority: ${item.priority}`);
        console.log(`     Estimated Time: ${item.estimated_time_minutes} minutes`);
        console.log(`     Bob Prompt Available: ${item.bob_prompt ? 'Yes' : 'No'}`);
      });
      console.log();
    }

    // Step 4: Cleanup workspace
    console.log('Step 4: Cleaning up workspace...');
    const cleanupResponse = await axios.delete(`${BASE_URL}/workspace/${workspaceId}`);
    
    if (cleanupResponse.data.success) {
      console.log(`✓ Workspace cleaned up successfully\n`);
    }

    console.log('=== Audit Flow Completed Successfully ===');
    
    return {
      success: true,
      summary: {
        filesScanned: auditData.filesScanned,
        overallScore: auditData.overallScore,
        vulnerabilitiesFound: auditData.vulnerabilities.length,
        remediationItems: remediationData.remediation.total_items,
        estimatedEffort: remediationData.remediation.estimated_effort_hours
      }
    };

  } catch (error) {
    console.error('\n❌ Error during audit flow:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Message: ${error.response.data.error || error.response.data.message}`);
    } else {
      console.error(`  ${error.message}`);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the example
if (require.main === module) {
  completeAuditFlow()
    .then(result => {
      if (result.success) {
        console.log('\n📊 Summary:', JSON.stringify(result.summary, null, 2));
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { completeAuditFlow };

// Made with Bob
