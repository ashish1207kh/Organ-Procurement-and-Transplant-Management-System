const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

// GET /api/admin/dashboard
router.get('/dashboard', adminController.getDashboardStats);
router.get('/statistics', adminController.getDashboardStats);

// GET /api/admin/donors
router.get('/donors', adminController.getDonors);

// GET /api/admin/recipients
router.get('/recipients', adminController.getRecipients);

// GET /api/admin/organs
router.get('/organs', adminController.getOrgans);
router.put('/organs/:id', adminController.updateOrganStatus);

// GET & POST /api/admin/matches
router.get('/matches', adminController.getMatches);
router.post('/matches/run', adminController.triggerAutoMatching);
router.put('/matches/:id', adminController.updateMatchStatus);

// GET & POST & PUT /api/admin/allocations
router.get('/allocations', adminController.getAllocations);
router.post('/allocations', adminController.createAllocation);
router.put('/allocations/:id', adminController.updateAllocationStatus);

// GET /api/admin/audit-logs
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
