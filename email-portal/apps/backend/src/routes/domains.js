const express = require('express');
const {
  getDomains,
  getDomain,
  createDomain,
  updateDomain,
  deleteDomain,
  getDomainStats
} = require('../controllers/domainController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getDomains)
  .post(authorize('admin'), createDomain);

router.get('/stats', authorize('admin'), getDomainStats);

router.route('/:id')
  .get(getDomain)
  .put(authorize('admin'), updateDomain)
  .delete(authorize('admin'), deleteDomain);

module.exports = router;