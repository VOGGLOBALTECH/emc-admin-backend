const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a facility name'],
    trim: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code']
    }
  },
  type: {
    type: String,
    enum: ['healthcare provider', 'pharmacy'],
    required: [true, 'Please specify facility type']
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'suspended'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Facility', facilitySchema); 