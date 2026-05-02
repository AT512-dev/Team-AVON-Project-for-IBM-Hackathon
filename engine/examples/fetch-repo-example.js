'use strict';

/**
 * Example: How to use the Git Service to fetch repositories
 * 
 * This file demonstrates the proper usage of the repository fetching service
 * for the CodeGuard AI security audit system.
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api/v1';

/**
 * Example 1: Fetch a public GitHub repository
 */
async function fetchGitHubRepo() {
  console.log('\n=== Example 1: Fetch GitHub Repository ===\n');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/fetch-repo`, {
      repoUrl: 'https://github.com/expressjs/express.git'
    });

    console.log('✅ Success!');
    console.log('Workspace ID:', response.data.workspaceId);
    console.log('Workspace Path:', response.data.workspacePath);
    console.log('File Count:', response.data.fileCount);
    console.log('Timestamp:', response.data.timestamp);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Example 2: Handle invalid URL
 */
async function handleInvalidUrl() {
  console.log('\n=== Example 2: Handle Invalid URL ===\n');
  
  try {
    await axios.post(`${API_BASE_URL}/fetch-repo`, {
      repoUrl: 'https://github.com/user/repo.git; rm -rf /'
    });
  } catch (error) {
    console.log('✅ Correctly rejected malicious URL');
    console.log('Error:', error.response?.data?.message);
  }
}

/**
 * Example 3: Cleanup workspace after use
 */
async function cleanupWorkspace(workspaceId) {
  console.log('\n=== Example 3: Cleanup Workspace ===\n');
  
  try {
    const response = await axios.delete(`${API_BASE_URL}/workspace/${workspaceId}`);
    console.log('✅ Workspace cleaned up successfully');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Cleanup error:', error.response?.data || error.message);
  }
}

/**
 * Example 4: Check Git service health
 */
async function checkGitHealth() {
  console.log('\n=== Example 4: Check Git Service Health ===\n');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/git/health`);
    console.log('✅ Git service is healthy');
    console.log('Git available:', response.data.git.available);
    console.log('Git version:', response.data.git.version);
  } catch (error) {
    console.error('❌ Health check failed:', error.response?.data || error.message);
  }
}

/**
 * Example 5: Complete workflow - Fetch, Process, Cleanup
 */
async function completeWorkflow() {
  console.log('\n=== Example 5: Complete Workflow ===\n');
  
  let workspaceId = null;
  
  try {
    // Step 1: Fetch repository
    console.log('Step 1: Fetching repository...');
    const fetchResult = await axios.post(`${API_BASE_URL}/fetch-repo`, {
      repoUrl: 'https://github.com/lodash/lodash.git'
    });
    
    workspaceId = fetchResult.data.workspaceId;
    console.log(`✅ Repository fetched: ${workspaceId}`);
    console.log(`   Files: ${fetchResult.data.fileCount}`);
    console.log(`   Path: ${fetchResult.data.workspacePath}`);
    
    // Step 2: Process repository (simulate audit)
    console.log('\nStep 2: Processing repository...');
    console.log('   (In production, this would trigger the security audit)');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    console.log('✅ Processing complete');
    
    // Step 3: Cleanup workspace
    console.log('\nStep 3: Cleaning up workspace...');
    await axios.delete(`${API_BASE_URL}/workspace/${workspaceId}`);
    console.log('✅ Workspace cleaned up');
    
  } catch (error) {
    console.error('❌ Workflow error:', error.response?.data || error.message);
    
    // Attempt cleanup even on error
    if (workspaceId) {
      try {
        await axios.delete(`${API_BASE_URL}/workspace/${workspaceId}`);
        console.log('✅ Cleanup successful despite error');
      } catch (cleanupError) {
        console.error('❌ Cleanup also failed:', cleanupError.message);
      }
    }
  }
}

/**
 * Example 6: Cleanup old workspaces
 */
async function cleanupOldWorkspaces() {
  console.log('\n=== Example 6: Cleanup Old Workspaces ===\n');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/cleanup-old-workspaces`, {
      hoursOld: 24
    });
    
    console.log('✅ Old workspaces cleaned');
    console.log('Cleaned:', response.data.cleaned);
    console.log('Threshold:', response.data.threshold);
  } catch (error) {
    console.error('❌ Cleanup error:', error.response?.data || error.message);
  }
}

/**
 * Example 7: Error handling patterns
 */
async function errorHandlingPatterns() {
  console.log('\n=== Example 7: Error Handling Patterns ===\n');
  
  const testCases = [
    {
      name: 'Missing repoUrl',
      data: {}
    },
    {
      name: 'Empty repoUrl',
      data: { repoUrl: '' }
    },
    {
      name: 'Invalid URL format',
      data: { repoUrl: 'not-a-valid-url' }
    },
    {
      name: 'Command injection attempt',
      data: { repoUrl: 'https://github.com/user/repo.git && whoami' }
    }
  ];
  
  for (const testCase of testCases) {
    try {
      await axios.post(`${API_BASE_URL}/fetch-repo`, testCase.data);
      console.log(`❌ ${testCase.name}: Should have failed but didn't`);
    } catch (error) {
      console.log(`✅ ${testCase.name}: Correctly rejected`);
      console.log(`   Error: ${error.response?.data?.message}`);
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     CodeGuard AI - Git Service Usage Examples             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  try {
    // Check if server is running
    await checkGitHealth();
    
    // Run examples
    await handleInvalidUrl();
    await errorHandlingPatterns();
    
    // Uncomment to run full workflow (requires network access)
    // await completeWorkflow();
    
    // Uncomment to cleanup old workspaces
    // await cleanupOldWorkspaces();
    
    console.log('\n✅ All examples completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Example execution failed:', error.message);
    console.error('\nMake sure the CodeGuard AI Engine is running:');
    console.error('  cd engine && npm start\n');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  fetchGitHubRepo,
  handleInvalidUrl,
  cleanupWorkspace,
  checkGitHealth,
  completeWorkflow,
  cleanupOldWorkspaces,
  errorHandlingPatterns
};

// Made with Bob
