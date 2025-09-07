const mongoose = require('mongoose');

const emailAccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9._-]+$/, 'Username can only contain lowercase letters, numbers, dots, hyphens, and underscores']
  },
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain',
    required: [true, 'Domain is required']
  },
  fullEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quota: {
    type: Number,
    default: 1024 // MB
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  directAdminId: {
    type: String,
    select: false
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  }
});

// Create index for faster queries
emailAccountSchema.index({ createdBy: 1, createdAt: -1 });
emailAccountSchema.index({ domain: 1 });
emailAccountSchema.index({ fullEmail: 1 });

// Virtual to get domain name
emailAccountSchema.virtual('domainName', {
  ref: 'Domain',
  localField: 'domain',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('EmailAccount', emailAccountSchema);