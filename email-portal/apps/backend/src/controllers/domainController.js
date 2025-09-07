const Domain = require('../models/Domain');
const EmailAccount = require('../models/EmailAccount');

// @desc    Get all domains
// @route   GET /api/domains
// @access  Private
exports.getDomains = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Only show active domains to non-admin users
    if (req.user.role !== 'admin') {
      query.isActive = true;
    }

    const total = await Domain.countDocuments(query);
    const domains = await Domain.find(query)
      .populate('createdBy', 'username email')
      .sort('name')
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: domains.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: domains
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single domain
// @route   GET /api/domains/:id
// @access  Private
exports.getDomain = async (req, res, next) => {
  try {
    const domain = await Domain.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!domain) {
      return res.status(404).json({
        success: false,
        error: 'Domain not found'
      });
    }

    res.status(200).json({
      success: true,
      data: domain
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create domain
// @route   POST /api/domains
// @access  Private/Admin
exports.createDomain = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const domain = await Domain.create({
      name,
      description,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: domain
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update domain
// @route   PUT /api/domains/:id
// @access  Private/Admin
exports.updateDomain = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;

    const domain = await Domain.findById(req.params.id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        error: 'Domain not found'
      });
    }

    // Update fields
    if (name !== undefined) domain.name = name;
    if (description !== undefined) domain.description = description;
    if (isActive !== undefined) domain.isActive = isActive;

    await domain.save();

    res.status(200).json({
      success: true,
      data: domain
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete domain
// @route   DELETE /api/domains/:id
// @access  Private/Admin
exports.deleteDomain = async (req, res, next) => {
  try {
    const domain = await Domain.findById(req.params.id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        error: 'Domain not found'
      });
    }

    // Check if domain has associated email accounts
    const emailCount = await EmailAccount.countDocuments({ domain: domain._id });
    
    if (emailCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete domain. ${emailCount} email accounts are associated with this domain.`
      });
    }

    await domain.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get domain statistics
// @route   GET /api/domains/stats
// @access  Private/Admin
exports.getDomainStats = async (req, res, next) => {
  try {
    const stats = await Domain.aggregate([
      {
        $lookup: {
          from: 'emailaccounts',
          localField: '_id',
          foreignField: 'domain',
          as: 'emails'
        }
      },
      {
        $project: {
          name: 1,
          isActive: 1,
          emailCount: { $size: '$emails' },
          createdAt: 1
        }
      },
      {
        $sort: { emailCount: -1 }
      }
    ]);

    const totalDomains = await Domain.countDocuments();
    const activeDomains = await Domain.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        totalDomains,
        activeDomains,
        domainStats: stats
      }
    });
  } catch (error) {
    next(error);
  }
};