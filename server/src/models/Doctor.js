// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  qualifications: [{
    degree: String,
    university: String,
    year: Number
  }],
  experience: {
    type: Number, // in years
    default: 0
  },
  hospital: {
    name: String,
    address: String
  },
  consultationFee: {
    type: Number,
    default: 0
  },
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    slots: [{
      startTime: String,
      endTime: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }]
  }],
  languagesSpoken: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin who approved
  }
}, {
  timestamps: true
});


doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isApproved: 1 });
doctorSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Doctor', doctorSchema);