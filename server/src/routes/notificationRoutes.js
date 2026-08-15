const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET /api/notifications
router.get('/', notificationController.getNotifications);

// PUT /api/notifications/read-all
router.put('/read-all', notificationController.markAllAsRead);

// PUT /api/notifications/:id/read
router.put('/:id/read', notificationController.markAsRead);

module.exports = router;
