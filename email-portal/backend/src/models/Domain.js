const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Domain name is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,}$/, 'Please provide a valid domain name']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: 200
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
domainSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Domain', domainSchema);