// models/Pharmacy.js - Enhanced version
const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  pharmacyName: {
    type: String,
    required: true,
    trim: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  contact: {
    phone: String,
    email: String
  },
  inventory: [{
    medicineName: {
      type: String,
      required: true
    },
    genericName: String,
    quantity: {
      type: Number,
      default: 0
    },
    price: Number,
    isAvailable: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  operatingHours: {
    open: String,
    close: String,
    days: [String]
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
pharmacySchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Pharmacy', pharmacySchema);