const { query } = require('../config/db');

// GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.'
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/notifications/read-all
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
      [userId]
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
