// Quick test to verify scoring consistency fix
const { calculateScore } = require('./controller/utils/scoring');
const { calculateOverallScore } = require('./engine/services/auditService');

console.log('=== Testing Scoring Consistency Fix ===\n');

// Test data with UPPERCASE severity (as in live environment)
const uppercaseVulns = [
  { severity: 'CRITICAL', file: 'test.js', issue: 'Test' },
  { severity: 'HIGH', file: 'test.js', issue: 'Test' },
  { severity: 'MEDIUM', file: 'test.js', issue: 'Test' },
  { severity: 'LOW', file: 'test.js', issue: 'Test' },
];

// Test data with lowercase severity (old format)
const lowercaseVulns = [
  { severity: 'critical', file: 'test.js', issue: 'Test' },
  { severity: 'high', file: 'test.js', issue: 'Test' },
  { severity: 'medium', file: 'test.js', issue: 'Test' },
  { severity: 'low', file: 'test.js', issue: 'Test' },
];

// Test data with mixed case
const mixedVulns = [
  { severity: 'Critical', file: 'test.js', issue: 'Test' },
  { severity: 'High', file: 'test.js', issue: 'Test' },
  { severity: 'Medium', file: 'test.js', issue: 'Test' },
  { severity: 'Low', file: 'test.js', issue: 'Test' },
];

console.log('1. Testing UPPERCASE severity (live environment format):');
const controllerUpperScore = calculateScore(uppercaseVulns);
const engineUpperScore = calculateOverallScore(uppercaseVulns);
console.log(`   Controller score: ${controllerUpperScore}`);
console.log(`   Engine score: ${engineUpperScore}`);
console.log(`   ✅ Match: ${controllerUpperScore === engineUpperScore ? 'YES' : 'NO'}\n`);

console.log('2. Testing lowercase severity (old format):');
const controllerLowerScore = calculateScore(lowercaseVulns);
const engineLowerScore = calculateOverallScore(lowercaseVulns);
console.log(`   Controller score: ${controllerLowerScore}`);
console.log(`   Engine score: ${engineLowerScore}`);
console.log(`   ✅ Match: ${controllerLowerScore === engineLowerScore ? 'YES' : 'NO'}\n`);

console.log('3. Testing mixed case severity:');
const controllerMixedScore = calculateScore(mixedVulns);
const engineMixedScore = calculateOverallScore(mixedVulns);
console.log(`   Controller score: ${controllerMixedScore}`);
console.log(`   Engine score: ${engineMixedScore}`);
console.log(`   ✅ Match: ${controllerMixedScore === engineMixedScore ? 'YES' : 'NO'}\n`);

console.log('4. Verifying all formats produce same score:');
const allMatch = (
  controllerUpperScore === controllerLowerScore &&
  controllerLowerScore === controllerMixedScore &&
  engineUpperScore === engineLowerScore &&
  engineLowerScore === engineMixedScore
);
console.log(`   ✅ All formats consistent: ${allMatch ? 'YES' : 'NO'}\n`);

// Expected score calculation:
// CRITICAL: 30, HIGH: 15, MEDIUM: 7, LOW: 2
// Total deduction: 30 + 15 + 7 + 2 = 54
// Score: 100 - 54 = 46
const expectedScore = 46;
console.log(`5. Expected score: ${expectedScore}`);
console.log(`   Controller actual: ${controllerUpperScore}`);
console.log(`   Engine actual: ${engineUpperScore}`);
console.log(`   ✅ Correct: ${controllerUpperScore === expectedScore && engineUpperScore === expectedScore ? 'YES' : 'NO'}\n`);

if (allMatch && controllerUpperScore === expectedScore) {
  console.log('✅ ALL TESTS PASSED - Scoring is now consistent!\n');
  process.exit(0);
} else {
  console.log('❌ TESTS FAILED - Scoring inconsistency detected!\n');
  process.exit(1);
}

// Made with Bob
