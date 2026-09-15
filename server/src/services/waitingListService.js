const { query } = require('../config/db');

// Urgency numerical weights for ranking
const URGENCY_WEIGHTS = {
  'CRITICAL': 4,
  'HIGH': 3,
  'MEDIUM': 2,
  'LOW': 1
};

/**
 * Calculates waiting rank for a specific recipient
 * Returns: { rank, totalWaiting, organ, status, score }
 */
const getRecipientWaitingRank = async (recipientId) => {
  // Fetch target recipient details
  const recipients = await query('SELECT * FROM recipients WHERE id = ?', [recipientId]);
  
  if (recipients.length === 0) {
    throw new Error(`Recipient with ID ${recipientId} not found`);
  }

  const target = recipients[0];
  const requiredOrgan = target.required_organ;

  // Fetch all waiting recipients for the same organ
  const allWaiting = await query(
    `SELECT id, first_name, last_name, blood_group, required_organ, urgency_level, status, created_at
     FROM recipients 
     WHERE required_organ = ? AND status IN ('WAITING', 'MATCHED')
     ORDER BY created_at ASC`,
    [requiredOrgan]
  );

  if (allWaiting.length === 0) {
    return {
      rank: 1,
      totalWaiting: 1,
      organ: requiredOrgan,
      status: target.status
    };
  }

  // Rank waiting recipients using project model:
  // Weighted Score = (UrgencyWeight * 1000000) + (1000000000 - timestamp)
  const rankedList = allWaiting.map(rec => {
    const urgencyScore = URGENCY_WEIGHTS[rec.urgency_level] || 1;
    const createdAtMs = new Date(rec.created_at).getTime();
    
    // Higher urgency first; if equal urgency, earlier creation timestamp (smaller MS) ranks first
    const score = (urgencyScore * 1e12) - createdAtMs;

    return {
      ...rec,
      calculatedScore: score
    };
  }).sort((a, b) => b.calculatedScore - a.calculatedScore);

  const position = rankedList.findIndex(r => r.id === parseInt(recipientId));
  const rank = position >= 0 ? position + 1 : 1;

  return {
    rank,
    totalWaiting: rankedList.length,
    organ: requiredOrgan,
    status: target.status
  };
};

const calculateAge = (dob) => {
  if (!dob) return 35;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 35;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? age : 35;
};

/**
 * Gets ranked waiting list for a specific organ (Admin usage)
 */
const getOrganWaitingList = async (organType) => {
  let sql = `
    SELECT r.id, r.first_name, r.last_name, r.blood_group, r.required_organ, 
           r.urgency_level, r.hospital, r.city, r.state, r.status, r.created_at,
           r.date_of_birth
    FROM recipients r
    WHERE r.status IN ('WAITING', 'MATCHED')
  `;
  
  const params = [];
  if (organType && organType !== 'ALL') {
    sql += ` AND r.required_organ = ?`;
    params.push(organType);
  }

  sql += ` ORDER BY r.created_at ASC`;

  const recipients = await query(sql, params);

  // Score & sort
  const scored = recipients.map(rec => {
    const urgencyWeight = URGENCY_WEIGHTS[rec.urgency_level] || 1;
    const daysWaiting = Math.floor((new Date() - new Date(rec.created_at)) / (1000 * 60 * 60 * 24));
    
    // Demo allocation formula
    const rankScore = (urgencyWeight * 25) + Math.min(daysWaiting, 50);

    return {
      ...rec,
      age: calculateAge(rec.date_of_birth),
      daysWaiting,
      rankScore
    };
  }).sort((a, b) => b.rankScore - a.rankScore);

  return scored.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

module.exports = {
  getRecipientWaitingRank,
  getOrganWaitingList
};
