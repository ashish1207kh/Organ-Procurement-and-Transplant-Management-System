const express = require('express');
const router = express.Router();
const { getHelpArticles } = require('../controllers/helpController');

// GET /api/help
router.get('/', getHelpArticles);

module.exports = router;
