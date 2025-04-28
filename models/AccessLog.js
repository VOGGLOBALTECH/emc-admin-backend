const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['provider', 'pharmacy', 'admin'],
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['view', 'update', 'delete']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String
  }
});

// Index for better query performance
accessLogSchema.index({ timestamp: -1 });
accessLogSchema.index({ userId: 1, timestamp: -1 });
accessLogSchema.index({ patientId: 1, timestamp: -1 });

module.exports = mongoose.model('AccessLog', accessLogSchema); 