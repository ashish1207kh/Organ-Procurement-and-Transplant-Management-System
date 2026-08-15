const { initDb, query } = require('../config/db');
const { calculateMatchScore, runAutomaticMatching } = require('../services/matchingService');
const { getRecipientWaitingRank } = require('../services/waitingListService');

async function testSuite() {
  console.log('🧪 Starting OPTM Backend Verification Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    await initDb();

    // 1. Verify Users & Admin seed
    const users = await query('SELECT * FROM users WHERE role = "ADMIN"');
    assert(users.length > 0 && users[0].email === 'admin@optm.org', 'Admin user present in database');

    // 2. Test Waiting Rank Algorithm
    const rankInfo = await getRecipientWaitingRank(1); // Arun Kumar
    assert(rankInfo.rank > 0 && rankInfo.organ === 'Kidney', 'Waiting rank service returned valid rank structure');

    // 3. Test Match Calculation
    const organ = { id: 1, organ_type: 'Kidney', blood_group: 'O+', location: 'Springfield' };
    const recipient = { id: 1, required_organ: 'Kidney', blood_group: 'O+', urgency_level: 'HIGH', hospital: 'Springfield General', city: 'Springfield', created_at: new Date() };
    const match = calculateMatchScore(organ, recipient);
    assert(match !== null && match.matchScore >= 80.0, 'Organ matching score calculated high score for compatible O+ Kidney match');

    // 4. Test Automatic Matching Pipeline
    const newMatches = await runAutomaticMatching();
    assert(Array.isArray(newMatches), 'Automatic matching pipeline executed cleanly');

    // 5. Test Donor Consent query
    const donors = await query('SELECT * FROM donors WHERE consent_status = "ACCEPTED"');
    assert(donors.length > 0, 'Donors with accepted consent status fetched successfully');

    console.log(`\n=======================================================`);
    console.log(`📊 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`=======================================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

testSuite();
