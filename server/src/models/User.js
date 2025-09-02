// models/User.js - Enhanced version
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor', 'pharmacist', 'admin'],
    default: 'patient'
  },
  // Common fields
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  // Role-specific reference
  doctorProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  patientProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en' // For multilingual support
  }
}, {
  timestamps: true
});

userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);