const { query, queryTransaction } = require('../config/db');
const { runAutomaticMatching } = require('../services/matchingService');
const { getOrganWaitingList } = require('../services/waitingListService');
const { createNotification, createAuditLog } = require('../services/notificationService');

// Admin Dashboard Summary & Recharts Statistics
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total counts
    const totalDonors = (await query('SELECT COUNT(*) as count FROM donors'))[0].count;
    const activeDonors = (await query("SELECT COUNT(*) as count FROM donors WHERE consent_status = 'ACCEPTED'"))[0].count;
    
    const totalRecipients = (await query('SELECT COUNT(*) as count FROM recipients'))[0].count;
    const waitingRecipients = (await query("SELECT COUNT(*) as count FROM recipients WHERE status = 'WAITING'"))[0].count;
    
    const availableOrgans = (await query("SELECT COUNT(*) as count FROM donor_organs WHERE status = 'AVAILABLE'"))[0].count;
    const allocatedOrgans = (await query("SELECT COUNT(*) as count FROM donor_organs WHERE status = 'ALLOCATED'"))[0].count;
    const completedTransplants = (await query("SELECT COUNT(*) as count FROM allocations WHERE status = 'TRANSPLANTED'"))[0].count;
    const pendingMatches = (await query("SELECT COUNT(*) as count FROM matches WHERE status = 'PENDING'"))[0].count;

    // 2. Organs Donated Breakdown (for Chart)
    const organsDonatedChart = await query(
      `SELECT organ_type as name, COUNT(*) as value 
       FROM donor_organs 
       GROUP BY organ_type ORDER BY value DESC`
    );

    // 3. Organs Required Breakdown (for Chart)
    const organsRequiredChart = await query(
      `SELECT required_organ as name, COUNT(*) as value 
       FROM recipients 
       GROUP BY required_organ ORDER BY value DESC`
    );

    // 4. Waiting List Breakdown by Organ
    const waitingByOrganChart = await query(
      `SELECT required_organ as name, COUNT(*) as value 
       FROM recipients 
       WHERE status = 'WAITING'
       GROUP BY required_organ ORDER BY value DESC`
    );

    // 5. Allocation Status Breakdown
    const allocationStatusChart = await query(
      `SELECT status as name, COUNT(*) as value 
       FROM donor_organs 
       GROUP BY status`
    );

    // Recent Activity / Audit Logs
    const recentLogs = await query(
      `SELECT a.*, u.email as user_email 
       FROM audit_logs a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC LIMIT 10`
    );

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalDonors,
          activeDonors,
          totalRecipients,
          waitingRecipients,
          availableOrgans,
          allocatedOrgans,
          completedTransplants,
          pendingMatches
        },
        charts: {
          organsDonated: organsDonatedChart,
          organsRequired: organsRequiredChart,
          waitingByOrgan: waitingByOrganChart,
          allocationStatus: allocationStatusChart
        },
        recentLogs
      }
    });
  } catch (err) {
    next(err);
  }
};

// Admin Donors Table with Search, Filter & Pagination
const getDonors = async (req, res, next) => {
  try {
    const { search, bloodGroup, organ, consentStatus, page = 1, limit = 10 } = req.query;
    let sql = `
      SELECT d.*, u.email, u.status as user_status,
             (SELECT GROUP_CONCAT(organ_type SEPARATOR ', ') FROM donor_organs WHERE donor_id = d.id) as organ_list
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (d.first_name LIKE ? OR d.last_name LIKE ? OR u.email LIKE ? OR d.city LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (bloodGroup) {
      sql += ` AND d.blood_group = ?`;
      params.push(bloodGroup);
    }

    if (consentStatus) {
      sql += ` AND d.consent_status = ?`;
      params.push(consentStatus);
    }

    sql += ` ORDER BY d.created_at DESC`;

    const donors = await query(sql, params);
    
    // Manual filter for organ if specified
    let filtered = donors;
    if (organ) {
      filtered = donors.filter(d => d.organ_list && d.organ_list.includes(organ));
    }

    const total = filtered.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
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

// Admin Recipients Table with Search, Filter & Pagination
const getRecipients = async (req, res, next) => {
  try {
    const { search, bloodGroup, requiredOrgan, urgency, status, page = 1, limit = 10 } = req.query;
    let sql = `
      SELECT r.*, u.email, u.status as user_status
      FROM recipients r
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (r.first_name LIKE ? OR r.last_name LIKE ? OR u.email LIKE ? OR r.hospital LIKE ? OR r.city LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (bloodGroup) {
      sql += ` AND r.blood_group = ?`;
      params.push(bloodGroup);
    }

    if (requiredOrgan) {
      sql += ` AND r.required_organ = ?`;
      params.push(requiredOrgan);
    }

    if (urgency) {
      sql += ` AND r.urgency_level = ?`;
      params.push(urgency);
    }

    if (status) {
      sql += ` AND r.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY r.created_at DESC`;

    const recipients = await query(sql, params);

    const formatted = recipients.map(r => ({
      ...r,
      age: calculateAge(r.date_of_birth)
    }));

    const total = formatted.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = formatted.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Admin Organ Inventory Management
const getOrgans = async (req, res, next) => {
  try {
    const { search, status, organType, bloodGroup } = req.query;
    let sql = `
      SELECT do.*, d.first_name as donor_first_name, d.last_name as donor_last_name, d.phone as donor_phone
      FROM donor_organs do
      JOIN donors d ON do.donor_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (do.location LIKE ? OR d.first_name LIKE ? OR d.last_name LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (status) {
      sql += ` AND do.status = ?`;
      params.push(status);
    }

    if (organType) {
      sql += ` AND do.organ_type = ?`;
      params.push(organType);
    }

    if (bloodGroup) {
      sql += ` AND do.blood_group = ?`;
      params.push(bloodGroup);
    }

    sql += ` ORDER BY do.created_at DESC`;

    const organs = await query(sql, params);

    res.status(200).json({
      success: true,
      data: organs
    });
  } catch (err) {
    next(err);
  }
};

// Update Organ Status by Admin
const updateOrganStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, viabilityStatus, location } = req.body;

    await query(
      `UPDATE donor_organs 
       SET status = COALESCE(?, status), 
           viability_status = COALESCE(?, viability_status),
           location = COALESCE(?, location),
           updated_at = NOW()
       WHERE id = ?`,
      [status, viabilityStatus, location, id]
    );

    await createAuditLog(req.user.id, 'UPDATE_ORGAN_STATUS', 'DONOR_ORGAN', id, `Admin updated organ #${id} status to ${status}`, req.ip);

    res.status(200).json({
      success: true,
      message: `Organ #${id} updated successfully.`
    });
  } catch (err) {
    next(err);
  }
};

// Admin Matches Endpoint & Auto Match trigger
const getMatches = async (req, res, next) => {
  try {
    const matches = await query(
      `SELECT m.*, 
              o.organ_type, o.blood_group as donor_blood_group, o.location as donor_location,
              d.first_name as donor_first_name, d.last_name as donor_last_name,
              r.first_name as recipient_first_name, r.last_name as recipient_last_name, 
              r.blood_group as recipient_blood_group, r.urgency_level, r.hospital
       FROM matches m
       JOIN donor_organs o ON m.organ_id = o.id
       JOIN donors d ON o.donor_id = d.id
       JOIN recipients r ON m.recipient_id = r.id
       ORDER BY m.match_score DESC`
    );

    res.status(200).json({
      success: true,
      data: matches
    });
  } catch (err) {
    next(err);
  }
};

// Trigger Automatic Organ Matching Calculation
const triggerAutoMatching = async (req, res, next) => {
  try {
    const newMatches = await runAutomaticMatching();

    await createAuditLog(req.user.id, 'RUN_MATCHING', 'MATCH', null, `Admin triggered automatic matching. Created ${newMatches.length} new matches.`, req.ip);

    res.status(200).json({
      success: true,
      message: `Matching execution complete. Generated ${newMatches.length} potential matches.`,
      data: newMatches
    });
  } catch (err) {
    next(err);
  }
};

// Update Match Status (APPROVE / REJECT)
const updateMatchStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // 'APPROVED' or 'REJECTED'

    const matches = await query('SELECT * FROM matches WHERE id = ?', [id]);
    if (matches.length === 0) return res.status(404).json({ success: false, message: 'Match record not found.' });

    const match = matches[0];

    await query(
      'UPDATE matches SET status = ?, notes = COALESCE(?, notes), updated_at = NOW() WHERE id = ?',
      [status, notes, id]
    );

    if (status === 'APPROVED') {
      // Update organ status to MATCHED and recipient status to MATCHED
      await query("UPDATE donor_organs SET status = 'MATCHED', updated_at = NOW() WHERE id = ?", [match.organ_id]);
      await query("UPDATE recipients SET status = 'MATCHED', updated_at = NOW() WHERE id = ?", [match.recipient_id]);

      // Notify recipient
      const recipientUser = await query('SELECT user_id FROM recipients WHERE id = ?', [match.recipient_id]);
      if (recipientUser.length > 0) {
        await createNotification(
          recipientUser[0].user_id,
          'Organ Match Approved',
          `Your match for organ #${match.organ_id} has been approved by the transplant administrator. Prepare for allocation review.`,
          'MATCH'
        );
      }
    }

    await createAuditLog(req.user.id, 'UPDATE_MATCH_STATUS', 'MATCH', id, `Match #${id} status set to ${status}`, req.ip);

    res.status(200).json({
      success: true,
      message: `Match #${id} updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
};

// Admin Allocations List & Workflow Management
const getAllocations = async (req, res, next) => {
  try {
    const allocations = await query(
      `SELECT a.*, 
              o.organ_type, o.location as organ_location,
              d.first_name as donor_first_name, d.last_name as donor_last_name, d.blood_group as donor_blood_group,
              r.first_name as recipient_first_name, r.last_name as recipient_last_name, r.hospital, r.blood_group as recipient_blood_group,
              admin_u.full_name as allocated_by_name
       FROM allocations a
       JOIN donor_organs o ON a.organ_id = o.id
       JOIN donors d ON a.donor_id = d.id
       JOIN recipients r ON a.recipient_id = r.id
       LEFT JOIN admin_users admin_u ON a.allocated_by = admin_u.user_id
       ORDER BY a.created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: allocations
    });
  } catch (err) {
    next(err);
  }
};

// Create Allocation Transaction
const createAllocation = async (req, res, next) => {
  try {
    const { organId, recipientId, matchId, notes } = req.body;
    const adminUserId = req.user.id;

    // Verify organ is available or matched
    const organs = await query('SELECT * FROM donor_organs WHERE id = ?', [organId]);
    if (organs.length === 0) return res.status(404).json({ success: false, message: 'Organ not found.' });

    const organ = organs[0];
    if (!['AVAILABLE', 'MATCHED', 'RESERVED'].includes(organ.status)) {
      return res.status(400).json({
        success: false,
        message: `Organ #${organId} cannot be allocated. Current status is ${organ.status}.`
      });
    }

    // Verify recipient
    const recipients = await query('SELECT * FROM recipients WHERE id = ?', [recipientId]);
    if (recipients.length === 0) return res.status(404).json({ success: false, message: 'Recipient not found.' });
    const recipient = recipients[0];

    let allocationId = null;

    await queryTransaction(async (tx) => {
      // 1. Create Allocation record
      const allocRes = await tx.query(
        `INSERT INTO allocations (organ_id, donor_id, recipient_id, match_id, allocated_by, allocation_date, status, notes, created_at)
         VALUES (?, ?, ?, ?, ?, NOW(), 'ALLOCATED', ?, NOW())`,
        [organId, organ.donor_id, recipientId, matchId || null, adminUserId, notes || 'Organ allocated by administrator.']
      );
      allocationId = allocRes.insertId;

      // 2. Update Organ status to ALLOCATED
      await tx.query("UPDATE donor_organs SET status = 'ALLOCATED', updated_at = NOW() WHERE id = ?", [organId]);

      // 3. Update Recipient status to ALLOCATED
      await tx.query("UPDATE recipients SET status = 'ALLOCATED', updated_at = NOW() WHERE id = ?", [recipientId]);

      // 4. Update Match status to ALLOCATED if matchId provided
      if (matchId) {
        await tx.query("UPDATE matches SET status = 'ALLOCATED', updated_at = NOW() WHERE id = ?", [matchId]);
      }
    });

    // Notify Recipient
    await createNotification(
      recipient.user_id,
      'Organ Allocated!',
      `An organ (${organ.organ_type}) has been officially allocated to you at ${recipient.hospital}. Contact your coordinator immediately.`,
      'ALLOCATION'
    );

    // Notify Donor
    const donorUsers = await query('SELECT user_id FROM donors WHERE id = ?', [organ.donor_id]);
    if (donorUsers.length > 0) {
      await createNotification(
        donorUsers[0].user_id,
        'Organ Allocation Progress',
        `Your pledged organ (${organ.organ_type}) has been allocated to a matched recipient. Thank you for your lifesaving pledge!`,
        'SUCCESS'
      );
    }

    await createAuditLog(adminUserId, 'CREATE_ALLOCATION', 'ALLOCATION', allocationId, `Allocated organ #${organId} to Recipient #${recipientId}`, req.ip);

    res.status(201).json({
      success: true,
      message: 'Organ allocation successfully completed.',
      data: { allocationId }
    });
  } catch (err) {
    next(err);
  }
};

// Update Allocation Status (e.g. ALLOCATED -> IN_TRANSIT -> TRANSPLANTED -> COMPLETED)
const updateAllocationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allocations = await query('SELECT * FROM allocations WHERE id = ?', [id]);
    if (allocations.length === 0) return res.status(404).json({ success: false, message: 'Allocation record not found.' });

    const alloc = allocations[0];

    await queryTransaction(async (tx) => {
      await tx.query(
        'UPDATE allocations SET status = ?, notes = COALESCE(?, notes), updated_at = NOW() WHERE id = ?',
        [status, notes, id]
      );

      if (status === 'TRANSPLANTED') {
        await tx.query("UPDATE donor_organs SET status = 'TRANSPLANTED', updated_at = NOW() WHERE id = ?", [alloc.organ_id]);
        await tx.query("UPDATE recipients SET status = 'TRANSPLANTED', updated_at = NOW() WHERE id = ?", [alloc.recipient_id]);
      } else if (status === 'CANCELLED') {
        await tx.query("UPDATE donor_organs SET status = 'AVAILABLE', updated_at = NOW() WHERE id = ?", [alloc.organ_id]);
        await tx.query("UPDATE recipients SET status = 'WAITING', updated_at = NOW() WHERE id = ?", [alloc.recipient_id]);
      }
    });

    const recipientUsers = await query('SELECT user_id FROM recipients WHERE id = ?', [alloc.recipient_id]);
    if (recipientUsers.length > 0) {
      await createNotification(
        recipientUsers[0].user_id,
        `Transplant Status: ${status}`,
        `Your transplant procedure status has been updated to: ${status}.`,
        status === 'TRANSPLANTED' ? 'SUCCESS' : 'INFO'
      );
    }

    await createAuditLog(req.user.id, 'UPDATE_ALLOCATION_STATUS', 'ALLOCATION', id, `Updated allocation #${id} status to ${status}`, req.ip);

    res.status(200).json({
      success: true,
      message: `Allocation #${id} status updated to ${status}.`
    });
  } catch (err) {
    next(err);
  }
};

// Admin Audit Logs
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await query(
      `SELECT a.*, u.email as user_email, u.role as user_role
       FROM audit_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC LIMIT 100`
    );

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getDonors,
  getRecipients,
  getOrgans,
  updateOrganStatus,
  getMatches,
  triggerAutoMatching,
  updateMatchStatus,
  getAllocations,
  createAllocation,
  updateAllocationStatus,
  getAuditLogs
};
