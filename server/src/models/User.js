const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['patient', 'doctor', 'pharmacist'],
      message: 'Role must be either patient, doctor, or pharmacist'
    },
    lowercase: true
  },
  // Additional fields for different roles
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; },
    trim: true
  },
  licenseNumber: {
    type: String,
    required: function() { return this.role === 'doctor'; },
    trim: true
  },
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: function() { return this.role === 'pharmacist'; }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for user's full profile (without password)
userSchema.virtual('profile').get(function() {
  return {
    _id: this._id,
    name: this.name,
    phone: this.phone,
    role: this.role,
    specialization: this.specialization,
    licenseNumber: this.licenseNumber,
    pharmacyId: this.pharmacyId,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
});

// Static method to find user by phone with password
userSchema.statics.findByPhoneWithPassword = function(phone) {
  return this.findOne({ phone }).select('+password');
};

module.exports = mongoose.model('User', userSchema);