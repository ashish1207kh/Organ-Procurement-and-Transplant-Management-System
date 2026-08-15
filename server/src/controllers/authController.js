const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, queryTransaction } = require('../config/db');
const { createNotification, createAuditLog } = require('../services/notificationService');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'optm_secure_jwt_secret_key_2026_super_secret';
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: '24h' }
  );
};

// Register Donor
const registerDonor = async (req, res, next) => {
  try {
    const {
      email, password, firstName, lastName, phone, dateOfBirth,
      gender, bloodGroup, address, city, state, medicalHistory,
      currentMedications, allergies, organWillingToDonate, consent
    } = req.body;

    if (!consent) {
      return res.status(400).json({
        success: false,
        message: 'Informed consent is required for donor registration.'
      });
    }

    // Check duplicate email
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let resultUser, resultDonor;

    await queryTransaction(async (tx) => {
      // Insert user
      const userRes = await tx.query(
        'INSERT INTO users (email, password_hash, role, status, created_at) VALUES (?, ?, "DONOR", "ACTIVE", NOW())',
        [email, passwordHash]
      );
      const userId = userRes.insertId;

      // Insert donor
      const donorRes = await tx.query(
        `INSERT INTO donors (user_id, first_name, last_name, phone, date_of_birth, gender, 
                             blood_group, address, city, state, medical_history, current_medications, 
                             allergies, consent_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACCEPTED', NOW())`,
        [
          userId, firstName, lastName, phone, dateOfBirth, gender,
          bloodGroup, address, city, state, medicalHistory || '', currentMedications || '',
          allergies || ''
        ]
      );
      const donorId = donorRes.insertId;

      // Insert organ willing to donate if provided
      if (organWillingToDonate) {
        const organsList = Array.isArray(organWillingToDonate) ? organWillingToDonate : [organWillingToDonate];
        for (const organType of organsList) {
          await tx.query(
            `INSERT INTO donor_organs (donor_id, organ_type, blood_group, status, location, procurement_date, viability_hours, viability_status, created_at)
             VALUES (?, ?, ?, 'AVAILABLE', ?, NOW(), 24, 'Optimal', NOW())`,
            [donorId, organType, bloodGroup, `${city}, ${state}`]
          );
        }
      }

      // Record consent
      const consentText = 'I voluntarily consent to donate my selected organs for transplantation upon medical and legal evaluation.';
      await tx.query(
        `INSERT INTO consents (user_id, user_type, consent_type, consent_status, consent_text, ip_address, accepted_at, created_at)
         VALUES (?, 'DONOR', 'ORGAN_DONATION_TERMS', 'ACCEPTED', ?, ?, NOW(), NOW())`,
        [userId, consentText, req.ip || '127.0.0.1']
      );

      resultUser = { id: userId, email, role: 'DONOR' };
      resultDonor = { id: donorId, firstName, lastName, bloodGroup };
    });

    // Create welcome notification & audit log
    await createNotification(
      resultUser.id,
      'Registration Complete',
      'Thank you for your kind act. Your donor registration has been completed.',
      'SUCCESS'
    );
    await createAuditLog(
      resultUser.id,
      'REGISTER_DONOR',
      'DONOR',
      resultDonor.id,
      `Donor ${firstName} ${lastName} registered for organ donation.`,
      req.ip
    );

    const token = generateToken(resultUser);

    res.status(201).json({
      success: true,
      message: 'Thank you for your kind act. Your donor registration has been completed.',
      data: {
        token,
        user: resultUser,
        donor: resultDonor
      }
    });
  } catch (err) {
    next(err);
  }
};

// Register Recipient
const registerRecipient = async (req, res, next) => {
  try {
    const {
      email, password, firstName, lastName, phone, dateOfBirth,
      gender, bloodGroup, requiredOrgan, medicalHistory, currentMedications,
      allergies, hospital, city, state, urgencyLevel, consent
    } = req.body;

    if (!consent) {
      return res.status(400).json({
        success: false,
        message: 'Consent to terms & waiting list enrollment is required.'
      });
    }

    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let resultUser, resultRecipient;

    await queryTransaction(async (tx) => {
      const userRes = await tx.query(
        'INSERT INTO users (email, password_hash, role, status, created_at) VALUES (?, ?, "RECIPIENT", "ACTIVE", NOW())',
        [email, passwordHash]
      );
      const userId = userRes.insertId;

      const recipientRes = await tx.query(
        `INSERT INTO recipients (user_id, first_name, last_name, phone, date_of_birth, gender,
                                blood_group, required_organ, medical_history, current_medications,
                                allergies, hospital, city, state, urgency_level, status, consent_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'WAITING', 'ACCEPTED', NOW())`,
        [
          userId, firstName, lastName, phone, dateOfBirth, gender,
          bloodGroup, requiredOrgan, medicalHistory || '', currentMedications || '',
          allergies || '', hospital, city, state, urgencyLevel || 'MEDIUM'
        ]
      );
      const recipientId = recipientRes.insertId;

      const consentText = 'I agree to be enrolled in the OPTM recipient waiting list and consent to organ matching evaluation.';
      await tx.query(
        `INSERT INTO consents (user_id, user_type, consent_type, consent_status, consent_text, ip_address, accepted_at, created_at)
         VALUES (?, 'RECIPIENT', 'TRANSPLANT_RECEIVER_TERMS', 'ACCEPTED', ?, ?, NOW(), NOW())`,
        [userId, consentText, req.ip || '127.0.0.1']
      );

      resultUser = { id: userId, email, role: 'RECIPIENT' };
      resultRecipient = { id: recipientId, firstName, lastName, requiredOrgan, bloodGroup };
    });

    await createNotification(
      resultUser.id,
      'Registration Successful',
      'Signup completed. Please log in to view your waiting-list position.',
      'SUCCESS'
    );
    await createAuditLog(
      resultUser.id,
      'REGISTER_RECIPIENT',
      'RECIPIENT',
      resultRecipient.id,
      `Recipient ${firstName} ${lastName} registered for ${requiredOrgan}.`,
      req.ip
    );

    const token = generateToken(resultUser);

    res.status(201).json({
      success: true,
      message: 'Signup completed. Please log in.',
      data: {
        token,
        user: resultUser,
        recipient: resultRecipient
      }
    });
  } catch (err) {
    next(err);
  }
};

// Login Donor or Recipient
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated or suspended. Please contact admin.'
      });
    }

    let profileData = null;
    if (user.role === 'DONOR') {
      const donors = await query('SELECT * FROM donors WHERE user_id = ?', [user.id]);
      if (donors.length > 0) profileData = donors[0];
    } else if (user.role === 'RECIPIENT') {
      const recipients = await query('SELECT * FROM recipients WHERE user_id = ?', [user.id]);
      if (recipients.length > 0) profileData = recipients[0];
    }

    const token = generateToken(user);

    await createAuditLog(user.id, 'USER_LOGIN', 'USER', user.id, `User ${email} logged in.`, req.ip);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status
        },
        profile: profileData
      }
    });
  } catch (err) {
    next(err);
  }
};

// Login Admin
const adminLogin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const loginIdentifier = email || username;

    const users = await query(
      `SELECT u.*, a.username, a.full_name 
       FROM users u 
       JOIN admin_users a ON u.id = a.user_id 
       WHERE u.email = ? OR a.username = ?`,
      [loginIdentifier, loginIdentifier]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.'
      });
    }

    const adminUser = users[0];
    const isMatch = await bcrypt.compare(password, adminUser.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrator credentials.'
      });
    }

    const token = generateToken(adminUser);

    await createAuditLog(adminUser.id, 'ADMIN_LOGIN', 'ADMIN', adminUser.id, `Admin ${adminUser.username} logged in.`, req.ip);

    res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      data: {
        token,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
          fullName: adminUser.full_name,
          role: 'ADMIN'
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get current user profile (/me)
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'DONOR') {
      const donors = await query('SELECT * FROM donors WHERE user_id = ?', [user.id]);
      if (donors.length > 0) profile = donors[0];
    } else if (user.role === 'RECIPIENT') {
      const recipients = await query('SELECT * FROM recipients WHERE user_id = ?', [user.id]);
      if (recipients.length > 0) profile = recipients[0];
    } else if (user.role === 'ADMIN') {
      const admins = await query('SELECT * FROM admin_users WHERE user_id = ?', [user.id]);
      if (admins.length > 0) profile = admins[0];
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (err) {
    next(err);
  }
};

// Logout
const logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

module.exports = {
  registerDonor,
  registerRecipient,
  login,
  adminLogin,
  getMe,
  logout
};
