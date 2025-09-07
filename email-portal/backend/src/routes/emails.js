const express = require('express');
const {
  createEmail,
  getMyEmails,
  getAllEmails,
  getEmail,
  deleteEmail,
  getEmailStats
} = require('../controllers/emailController');

const router = express.Router();

const { protect, authorize, canCreateEmails } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// User routes
router.route('/')
  .get(getMyEmails)
  .post(canCreateEmails, createEmail);

router.get('/stats', getEmailStats);

// Admin routes
router.get('/all', authorize('admin'), getAllEmails);

router.route('/:id')
  .get(getEmail)
  .delete(authorize('admin'), deleteEmail);

module.exports = router;