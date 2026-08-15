const { query } = require('../config/db');
const { createNotification, createAuditLog } = require('../services/notificationService');

// Get Donor Profile
const getDonorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const donors = await query('SELECT * FROM donors WHERE user_id = ?', [userId]);

    if (donors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found.'
      });
    }

    const donor = donors[0];
    const organs = await query('SELECT * FROM donor_organs WHERE donor_id = ?', [donor.id]);
    const consents = await query('SELECT * FROM consents WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    res.status(200).json({
      success: true,
      data: {
        donor,
        organs,
        consents
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update Donor Profile
const updateDonorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      firstName, lastName, phone, address, city, state,
      medicalHistory, currentMedications, allergies
    } = req.body;

    const donors = await query('SELECT id FROM donors WHERE user_id = ?', [userId]);
    if (donors.length === 0) {
      return res.status(404).json({ success: false, message: 'Donor profile not found.' });
    }

    const donorId = donors[0].id;

    await query(
      `UPDATE donors 
       SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, state = ?,
           medical_history = ?, current_medications = ?, allergies = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        firstName, lastName, phone, address, city, state,
        medicalHistory, currentMedications, allergies, donorId
      ]
    );

    await createAuditLog(userId, 'UPDATE_PROFILE', 'DONOR', donorId, 'Donor updated profile information.', req.ip);

    res.status(200).json({
      success: true,
      message: 'Donor profile updated successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// Add Organ to Donate
const addDonorOrgan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { organType, viabilityStatus, notes } = req.body;

    const donors = await query('SELECT * FROM donors WHERE user_id = ?', [userId]);
    if (donors.length === 0) {
      return res.status(404).json({ success: false, message: 'Donor record not found.' });
    }

    const donor = donors[0];

    // Check if donor consent is withdrawn
    if (donor.consent_status === 'WITHDRAWN') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register organ donation when consent is withdrawn.'
      });
    }

    const result = await query(
      `INSERT INTO donor_organs (donor_id, organ_type, blood_group, status, location, procurement_date, viability_hours, viability_status, created_at)
       VALUES (?, ?, ?, 'AVAILABLE', ?, NOW(), 24, ?, NOW())`,
      [donor.id, organType, donor.blood_group, `${donor.city}, ${donor.state}`, viabilityStatus || 'Optimal']
    );

    await createNotification(
      userId,
      'Organ Donation Pledged',
      `You have registered your pledge to donate: ${organType}.`,
      'SUCCESS'
    );
    await createAuditLog(userId, 'ADD_DONOR_ORGAN', 'DONOR_ORGAN', result.insertId, `Added organ donation record: ${organType}`, req.ip);

    res.status(201).json({
      success: true,
      message: `Organ pledge for ${organType} added successfully.`,
      data: { organId: result.insertId }
    });
  } catch (err) {
    next(err);
  }
};

// Get Organs Donated by current Donor
const getDonorOrgans = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const donors = await query('SELECT id FROM donors WHERE user_id = ?', [userId]);
    if (donors.length === 0) return res.status(404).json({ success: false, message: 'Donor profile not found.' });

    const organs = await query('SELECT * FROM donor_organs WHERE donor_id = ? ORDER BY created_at DESC', [donors[0].id]);

    res.status(200).json({
      success: true,
      data: organs
    });
  } catch (err) {
    next(err);
  }
};

// Get Donor Comprehensive Status
const getDonorStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const donors = await query('SELECT * FROM donors WHERE user_id = ?', [userId]);
    if (donors.length === 0) return res.status(404).json({ success: false, message: 'Donor not found.' });

    const donor = donors[0];
    const organs = await query('SELECT * FROM donor_organs WHERE donor_id = ?', [donor.id]);

    // Check matches or allocations linked to donor's organs
    let matches = [];
    let allocations = [];
    if (organs.length > 0) {
      const organIds = organs.map(o => o.id);
      const organIdPlaceholders = organIds.map(() => '?').join(',');
      
      matches = await query(
        `SELECT m.*, r.first_name as recipient_first_name, r.last_name as recipient_last_name 
         FROM matches m 
         JOIN recipients r ON m.recipient_id = r.id 
         WHERE m.organ_id IN (${organIdPlaceholders})`,
        organIds
      );

      allocations = await query(
        `SELECT a.*, r.first_name as recipient_first_name, r.last_name as recipient_last_name 
         FROM allocations a 
         JOIN recipients r ON a.recipient_id = r.id 
         WHERE a.organ_id IN (${organIdPlaceholders})`,
        organIds
      );
    }

    res.status(200).json({
      success: true,
      data: {
        donor,
        consentStatus: donor.consent_status,
        organs,
        matchesCount: matches.length,
        allocationsCount: allocations.length,
        allocations
      }
    });
  } catch (err) {
    next(err);
  }
};

// Withdraw Donation Consent before allocation
const withdrawConsent = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reason } = req.body;

    const donors = await query('SELECT id FROM donors WHERE user_id = ?', [userId]);
    if (donors.length === 0) return res.status(404).json({ success: false, message: 'Donor record not found.' });

    const donorId = donors[0].id;

    // Check if any organ has already been allocated or transplanted
    const allocatedOrgans = await query(
      "SELECT id FROM donor_organs WHERE donor_id = ? AND status IN ('ALLOCATED', 'TRANSPLANTED')",
      [donorId]
    );

    if (allocatedOrgans.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw consent. One or more pledged organs have already been allocated or transplanted.'
      });
    }

    // Update donor consent status
    await query("UPDATE donors SET consent_status = 'WITHDRAWN', updated_at = NOW() WHERE id = ?", [donorId]);

    // Update available organs status to CANCELLED
    await query("UPDATE donor_organs SET status = 'CANCELLED', updated_at = NOW() WHERE donor_id = ? AND status = 'AVAILABLE'", [donorId]);

    // Record consent withdrawal log
    await query(
      `INSERT INTO consents (user_id, user_type, consent_type, consent_status, consent_text, ip_address, withdrawn_at, created_at)
       VALUES (?, 'DONOR', 'WITHDRAWAL', 'WITHDRAWN', ?, ?, NOW(), NOW())`,
      [userId, reason || 'User requested consent withdrawal.', req.ip || '127.0.0.1']
    );

    await createNotification(
      userId,
      'Consent Withdrawn',
      'Your organ donation consent has been withdrawn. Unallocated pledged organs are cancelled.',
      'WARNING'
    );
    await createAuditLog(userId, 'WITHDRAW_CONSENT', 'DONOR', donorId, `Consent withdrawn. Reason: ${reason || 'Not specified'}`, req.ip);

    res.status(200).json({
      success: true,
      message: 'Organ donation consent successfully withdrawn.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDonorProfile,
  updateDonorProfile,
  addDonorOrgan,
  getDonorOrgans,
  getDonorStatus,
  withdrawConsent
};
