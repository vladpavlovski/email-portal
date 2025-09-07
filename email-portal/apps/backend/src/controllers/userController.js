const User = require('../models/User');
const EmailAccount = require('../models/EmailAccount');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Add search functionality
    if (req.query.search) {
      query.$or = [
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    // Get email count for each user
    const userIds = users.map(user => user._id);
    const emailCounts = await EmailAccount.aggregate([
      { $match: { createdBy: { $in: userIds } } },
      { $group: { _id: '$createdBy', count: { $sum: 1 } } }
    ]);

    const emailCountMap = {};
    emailCounts.forEach(item => {
      emailCountMap[item._id.toString()] = item.count;
    });

    const usersWithStats = users.map(user => ({
      ...user.toObject(),
      emailCount: emailCountMap[user._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's email count
    const emailCount = await EmailAccount.countDocuments({ createdBy: user._id });

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        emailCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { isActive, canCreateEmails, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent admin from disabling themselves
    if (user._id.toString() === req.user.id && (isActive === false || role !== 'admin')) {
      return res.status(400).json({
        success: false,
        error: 'You cannot disable your own account or change your admin role'
      });
    }

    // Update fields
    if (isActive !== undefined) user.isActive = isActive;
    if (canCreateEmails !== undefined) user.canCreateEmails = canCreateEmails;
    if (role !== undefined) user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account'
      });
    }

    // Check if user has created email accounts
    const emailCount = await EmailAccount.countDocuments({ createdBy: user._id });
    
    if (emailCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete user. User has created ${emailCount} email accounts.`
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top users by email creation
    const topUsers = await EmailAccount.aggregate([
      {
        $group: {
          _id: '$createdBy',
          emailCount: { $sum: 1 }
        }
      },
      {
        $sort: { emailCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          username: '$user.username',
          email: '$user.email',
          emailCount: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        usersByRole,
        topUsers
      }
    });
  } catch (error) {
    next(error);
  }
};