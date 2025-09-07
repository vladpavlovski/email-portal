const EmailAccount = require('../models/EmailAccount');
const Domain = require('../models/Domain');
const directAdmin = require('../services/directAdmin');
const { generatePassword } = require('../utils/passwordGenerator');

// @desc    Create new email account
// @route   POST /api/emails
// @access  Private
exports.createEmail = async (req, res, next) => {
  try {
    const { username, domainId } = req.body;

    // Validate username
    if (!username || !domainId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username and domain'
      });
    }

    // Check if domain exists and is active
    const domain = await Domain.findById(domainId);
    if (!domain) {
      return res.status(404).json({
        success: false,
        error: 'Domain not found'
      });
    }

    if (!domain.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Domain is not active'
      });
    }

    // Check if email already exists in our database
    const fullEmail = `${username}@${domain.name}`;
    const existingEmail = await EmailAccount.findOne({ fullEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email account already exists'
      });
    }

    // Check if email exists in DirectAdmin
    const emailExists = await directAdmin.checkEmailExists(username, domain.name);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'Email account already exists in mail server'
      });
    }

    // Generate secure password
    const password = generatePassword(parseInt(process.env.PASSWORD_LENGTH) || 16);
    const quota = parseInt(process.env.DEFAULT_EMAIL_QUOTA) || 1024;

    // Create email in DirectAdmin
    const directAdminResult = await directAdmin.createEmailAccount(
      username,
      domain.name,
      password,
      quota
    );

    if (!directAdminResult.success) {
      throw new Error(directAdminResult.message || 'Failed to create email in DirectAdmin');
    }

    // Save to database
    const emailAccount = await EmailAccount.create({
      username,
      domain: domainId,
      fullEmail,
      createdBy: req.user.id,
      quota
    });

    // Populate domain info
    await emailAccount.populate('domain', 'name');

    res.status(201).json({
      success: true,
      data: {
        id: emailAccount._id,
        email: emailAccount.fullEmail,
        username: emailAccount.username,
        domain: emailAccount.domain.name,
        password, // Only shown once, on creation
        quota: emailAccount.quota,
        createdAt: emailAccount.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all email accounts for logged in user
// @route   GET /api/emails
// @access  Private
exports.getMyEmails = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { createdBy: req.user.id };

    // Add search functionality
    if (req.query.search) {
      query.fullEmail = { $regex: req.query.search, $options: 'i' };
    }

    const total = await EmailAccount.countDocuments(query);
    const emails = await EmailAccount.find(query)
      .populate('domain', 'name')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: emails.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: emails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all email accounts (admin only)
// @route   GET /api/emails/all
// @access  Private/Admin
exports.getAllEmails = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Add filters
    if (req.query.user) {
      query.createdBy = req.query.user;
    }

    if (req.query.domain) {
      query.domain = req.query.domain;
    }

    if (req.query.search) {
      query.fullEmail = { $regex: req.query.search, $options: 'i' };
    }

    const total = await EmailAccount.countDocuments(query);
    const emails = await EmailAccount.find(query)
      .populate('domain', 'name')
      .populate('createdBy', 'username email')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: emails.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: emails
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single email account
// @route   GET /api/emails/:id
// @access  Private
exports.getEmail = async (req, res, next) => {
  try {
    const email = await EmailAccount.findById(req.params.id)
      .populate('domain', 'name')
      .populate('createdBy', 'username email');

    if (!email) {
      return res.status(404).json({
        success: false,
        error: 'Email account not found'
      });
    }

    // Check ownership (unless admin)
    if (email.createdBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource'
      });
    }

    res.status(200).json({
      success: true,
      data: email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete email account
// @route   DELETE /api/emails/:id
// @access  Private/Admin
exports.deleteEmail = async (req, res, next) => {
  try {
    const email = await EmailAccount.findById(req.params.id).populate('domain', 'name');

    if (!email) {
      return res.status(404).json({
        success: false,
        error: 'Email account not found'
      });
    }

    // Try to delete from DirectAdmin first
    try {
      await directAdmin.deleteEmailAccount(email.username, email.domain.name);
    } catch (daError) {
      console.error('DirectAdmin deletion failed:', daError);
      // Continue with database deletion even if DirectAdmin fails
    }

    // Update status to deleted instead of removing from database
    email.status = 'deleted';
    await email.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get email statistics
// @route   GET /api/emails/stats
// @access  Private
exports.getEmailStats = async (req, res, next) => {
  try {
    let query = {};
    
    // For non-admin users, only show their own stats
    if (req.user.role !== 'admin') {
      query.createdBy = req.user.id;
    }

    const totalEmails = await EmailAccount.countDocuments(query);
    const activeEmails = await EmailAccount.countDocuments({ ...query, status: 'active' });
    
    // Get emails by domain
    const emailsByDomain = await EmailAccount.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'domains',
          localField: '_id',
          foreignField: '_id',
          as: 'domain'
        }
      },
      {
        $unwind: '$domain'
      },
      {
        $project: {
          domain: '$domain.name',
          count: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmails,
        activeEmails,
        emailsByDomain
      }
    });
  } catch (error) {
    next(error);
  }
};