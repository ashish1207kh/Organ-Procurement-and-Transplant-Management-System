const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authorization token required.'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'optm_secure_jwt_secret_key_2026_super_secret';
    const decoded = jwt.verify(token, jwtSecret);

    // Verify user exists and active
    const users = await query('SELECT id, email, role, status FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0 || users[0].status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token or inactive account status.'
      });
    }

    req.user = users[0];
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired authorization token.'
    });
  }
};

module.exports = { authenticateToken };
