const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.get('/stats', getUserStats);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;