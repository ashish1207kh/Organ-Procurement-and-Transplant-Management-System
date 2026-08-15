const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticateToken);

// GET /api/recipients/waiting-rank (for current user)
router.get('/waiting-rank', recipientController.getWaitingRank);

// GET /api/recipients/:id/waiting-rank (for specific recipient ID)
router.get('/:id/waiting-rank', recipientController.getWaitingRank);

// GET /api/recipients/profile
router.get('/profile', authorizeRoles('RECIPIENT', 'ADMIN'), recipientController.getRecipientProfile);

// PUT /api/recipients/profile
router.put('/profile', authorizeRoles('RECIPIENT', 'ADMIN'), recipientController.updateRecipientProfile);

// GET /api/recipients/matches
router.get('/matches', authorizeRoles('RECIPIENT', 'ADMIN'), recipientController.getRecipientMatches);

module.exports = router;
