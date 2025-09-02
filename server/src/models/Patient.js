// models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  // For offline access to health records
  lastSynced: Date
}, {
  timestamps: true
});

patientSchema.index({ userId: 1 });

module.exports = mongoose.model('Patient', patientSchema);