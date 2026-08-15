const { query } = require('../config/db');
const { getRecipientWaitingRank } = require('../services/waitingListService');
const { createAuditLog } = require('../services/notificationService');

// Get Recipient Profile
const getRecipientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipients = await query('SELECT * FROM recipients WHERE user_id = ?', [userId]);

    if (recipients.length === 0) {
      return res.status(404).json({ success: false, message: 'Recipient profile not found.' });
    }

    const recipient = recipients[0];
    const rankInfo = await getRecipientWaitingRank(recipient.id);

    res.status(200).json({
      success: true,
      data: {
        recipient,
        waitingList: rankInfo
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update Recipient Profile
const updateRecipientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      firstName, lastName, phone, hospital, city, state,
      medicalHistory, currentMedications, allergies
    } = req.body;

    const recipients = await query('SELECT id FROM recipients WHERE user_id = ?', [userId]);
    if (recipients.length === 0) {
      return res.status(404).json({ success: false, message: 'Recipient profile not found.' });
    }

    const recipientId = recipients[0].id;

    await query(
      `UPDATE recipients 
       SET first_name = ?, last_name = ?, phone = ?, hospital = ?, city = ?, state = ?,
           medical_history = ?, current_medications = ?, allergies = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        firstName, lastName, phone, hospital, city, state,
        medicalHistory, currentMedications, allergies, recipientId
      ]
    );

    await createAuditLog(userId, 'UPDATE_PROFILE', 'RECIPIENT', recipientId, 'Recipient updated profile details.', req.ip);

    res.status(200).json({
      success: true,
      message: 'Recipient profile updated successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/recipients/:id/waiting-rank OR /api/recipients/waiting-rank (for logged-in recipient)
const getWaitingRank = async (req, res, next) => {
  try {
    let recipientId = req.params.id;

    if (!recipientId || recipientId === 'me' || recipientId === 'waiting-rank') {
      const recipients = await query('SELECT id FROM recipients WHERE user_id = ?', [req.user.id]);
      if (recipients.length === 0) {
        return res.status(404).json({ success: false, message: 'Recipient record not found for logged in user.' });
      }
      recipientId = recipients[0].id;
    }

    const rankResult = await getRecipientWaitingRank(recipientId);

    res.status(200).json({
      success: true,
      rank: rankResult.rank,
      totalWaiting: rankResult.totalWaiting,
      organ: rankResult.organ,
      status: rankResult.status,
      data: rankResult
    });
  } catch (err) {
    next(err);
  }
};

// Get Recipient Matches
const getRecipientMatches = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipients = await query('SELECT id FROM recipients WHERE user_id = ?', [userId]);
    if (recipients.length === 0) return res.status(404).json({ success: false, message: 'Recipient not found.' });

    const recipientId = recipients[0].id;

    const matches = await query(
      `SELECT m.*, o.organ_type, o.blood_group as donor_blood_group, o.location as organ_location, o.viability_status
       FROM matches m
       JOIN donor_organs o ON m.organ_id = o.id
       WHERE m.recipient_id = ?
       ORDER BY m.match_score DESC`,
      [recipientId]
    );

    const allocations = await query(
      `SELECT a.*, o.organ_type, o.location as organ_location
       FROM allocations a
       JOIN donor_organs o ON a.organ_id = o.id
       WHERE a.recipient_id = ?
       ORDER BY a.allocation_date DESC`,
      [recipientId]
    );

    res.status(200).json({
      success: true,
      data: {
        matches,
        allocations
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecipientProfile,
  updateRecipientProfile,
  getWaitingRank,
  getRecipientMatches
};
