const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticateToken);
router.use(authorizeRoles('DONOR', 'ADMIN'));

// GET /api/donors/profile
router.get('/profile', donorController.getDonorProfile);

// PUT /api/donors/profile
router.put('/profile', donorController.updateDonorProfile);

// POST /api/donors/organs
router.post('/organs', donorController.addDonorOrgan);

// GET /api/donors/organs
router.get('/organs', donorController.getDonorOrgans);

// GET /api/donors/status
router.get('/status', donorController.getDonorStatus);

// PUT /api/donors/consent/withdraw
router.put('/consent/withdraw', donorController.withdrawConsent);

module.exports = router;
