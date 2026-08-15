const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array()
    });
  }
  next();
};

// POST /api/auth/register/donor
router.post(
  '/register/donor',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('phone').notEmpty().withMessage('Phone number is required.'),
    body('bloodGroup').notEmpty().withMessage('Blood group is required.'),
    body('dateOfBirth').notEmpty().withMessage('Date of birth is required.')
  ],
  validate,
  authController.registerDonor
);

// POST /api/auth/register/recipient
router.post(
  '/register/recipient',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('phone').notEmpty().withMessage('Phone number is required.'),
    body('bloodGroup').notEmpty().withMessage('Blood group is required.'),
    body('requiredOrgan').notEmpty().withMessage('Required organ is required.'),
    body('hospital').notEmpty().withMessage('Hospital is required.')
  ],
  validate,
  authController.registerRecipient
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.')
  ],
  validate,
  authController.login
);

// POST /api/auth/admin-login
router.post(
  '/admin-login',
  [
    body('password').notEmpty().withMessage('Password is required.')
  ],
  validate,
  authController.adminLogin
);

// GET /api/auth/me
router.get('/me', authenticateToken, authController.getMe);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
