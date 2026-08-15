const { query } = require('../config/db');

const createNotification = async (userId, title, message, type = 'INFO') => {
  try {
    await query(
      'INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())',
      [userId, title, message, type]
    );
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

const createAuditLog = async (userId, action, entityType, entityId, description, ipAddress = '127.0.0.1') => {
  try {
    await query(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, action, entityType, entityId, description, ipAddress]
    );
  } catch (err) {
    console.error('Failed to create audit log:', err.message);
  }
};

module.exports = {
  createNotification,
  createAuditLog
};
