const { query } = require('../config/db');

// ABO Blood Group Compatibility Mapping: donorBlood -> allowed recipient bloods
const BLOOD_COMPATIBILITY = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

const checkBloodCompatibility = (donorBlood, recipientBlood) => {
  if (donorBlood === recipientBlood) return { compatible: true, exact: true, score: 30.0 };
  const allowed = BLOOD_COMPATIBILITY[donorBlood] || [];
  if (allowed.includes(recipientBlood)) {
    return { compatible: true, exact: false, score: 25.0 };
  }
  return { compatible: false, exact: false, score: 0.0 };
};

/**
 * Calculates match score between a donor organ and a recipient
 */
const calculateMatchScore = (organ, recipient) => {
  // 1. Organ Compatibility (30%)
  const organCompatScore = organ.organ_type === recipient.required_organ ? 30.0 : 0.0;
  if (organCompatScore === 0) return null; // Cannot match different organ types

  // 2. Blood Group Compatibility (30%)
  const bloodEval = checkBloodCompatibility(organ.blood_group, recipient.blood_group);
  if (!bloodEval.compatible) return null; // Incompatible blood group
  const bloodCompatScore = bloodEval.score;

  // 3. Urgency Score (20%)
  const urgencyMap = {
    'CRITICAL': 20.0,
    'HIGH': 15.0,
    'MEDIUM': 10.0,
    'LOW': 5.0
  };
  const urgencyScore = urgencyMap[recipient.urgency_level] || 10.0;

  // 4. Waiting Duration Score (10%)
  const daysWaiting = Math.max(0, Math.floor((new Date() - new Date(recipient.created_at)) / (1000 * 60 * 60 * 24)));
  const waitingScore = Math.min(10.0, daysWaiting * 0.2); // 10 points max at 50 days

  // 5. Location Score (10%)
  let locationScore = 2.0;
  const organLoc = organ.location ? organ.location.toLowerCase() : '';
  const recipientCity = recipient.city ? recipient.city.toLowerCase() : '';
  const recipientState = recipient.state ? recipient.state.toLowerCase() : '';
  const recipientHosp = recipient.hospital ? recipient.hospital.toLowerCase() : '';

  if (organLoc && (recipientCity || recipientHosp)) {
    if ((recipientCity && organLoc.includes(recipientCity)) || (recipientHosp && organLoc.includes(recipientHosp))) {
      locationScore = 10.0;
    } else if (recipientState && organLoc.includes(recipientState)) {
      locationScore = 6.0;
    }
  }

  const totalScore = parseFloat((organCompatScore + bloodCompatScore + urgencyScore + waitingScore + locationScore).toFixed(2));

  return {
    organId: organ.id,
    recipientId: recipient.id,
    matchScore: totalScore,
    organCompatibility: organCompatScore,
    bloodGroupCompatibility: bloodCompatScore,
    urgencyScore,
    waitingScore: parseFloat(waitingScore.toFixed(2)),
    locationScore,
    details: {
      organType: organ.organ_type,
      donorBlood: organ.blood_group,
      recipientBlood: recipient.blood_group,
      urgency: recipient.urgency_level,
      hospital: recipient.hospital || '',
      location: organ.location || ''
    }
  };
};

/**
 * Runs automatic organ matching algorithm across all available organs and waiting recipients
 */
const runAutomaticMatching = async () => {
  // Fetch all AVAILABLE donor organs
  const availableOrgans = await query(
    `SELECT do.*, d.first_name as donor_first_name, d.last_name as donor_last_name 
     FROM donor_organs do
     JOIN donors d ON do.donor_id = d.id
     WHERE do.status = 'AVAILABLE'`
  );

  // Fetch all WAITING recipients
  const waitingRecipients = await query(
    `SELECT r.* 
     FROM recipients r 
     WHERE r.status = 'WAITING' AND r.consent_status = 'ACCEPTED'`
  );

  const newMatches = [];

  for (const organ of availableOrgans) {
    for (const recipient of waitingRecipients) {
      const matchResult = calculateMatchScore(organ, recipient);
      if (matchResult && matchResult.matchScore >= 50.0) { // Minimum threshold 50%
        const existing = await query(
          'SELECT id FROM matches WHERE organ_id = ? AND recipient_id = ?',
          [organ.id, recipient.id]
        );

        if (existing.length === 0) {
          const notes = `Auto-generated match: Score ${matchResult.matchScore}% (${organ.blood_group} -> ${recipient.blood_group}, ${recipient.urgency_level} Urgency)`;

          const result = await query(
            `INSERT INTO matches (organ_id, recipient_id, match_score, organ_compatibility, 
                                blood_group_compatibility, urgency_score, waiting_score, location_score, status, notes, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, NOW())`,
            [
              matchResult.organId,
              matchResult.recipientId,
              matchResult.matchScore,
              matchResult.organCompatibility,
              matchResult.bloodGroupCompatibility,
              matchResult.urgencyScore,
              matchResult.waitingScore,
              matchResult.locationScore,
              notes
            ]
          );

          newMatches.push({
            id: result.insertId,
            ...matchResult,
            donorName: `${organ.donor_first_name} ${organ.donor_last_name}`,
            recipientName: `${recipient.first_name} ${recipient.last_name}`
          });
        }
      }
    }
  }

  return newMatches;
};

module.exports = {
  calculateMatchScore,
  runAutomaticMatching,
  checkBloodCompatibility
};
