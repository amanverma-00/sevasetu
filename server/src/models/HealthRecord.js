const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required'],
    index: true
  },
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxLength: [100, 'Doctor name cannot exceed 100 characters']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional - for tracking which doctor created the record
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
    index: true
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required'],
    trim: true,
    maxLength: [1000, 'Diagnosis cannot exceed 1000 characters']
  },
  prescription: {
    type: String,
    required: [true, 'Prescription is required'],
    trim: true,
    maxLength: [2000, 'Prescription cannot exceed 2000 characters']
  },
  // Additional medical details
  symptoms: [{
    type: String,
    trim: true
  }],
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number
  },
  notes: {
    type: String,
    trim: true,
    maxLength: [1000, 'Notes cannot exceed 1000 characters']
  },
  followUpDate: {
    type: Date
  },
  recordType: {
    type: String,
    enum: ['consultation', 'checkup', 'emergency', 'followup', 'prescription'],
    default: 'consultation'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  // For offline sync
  syncStatus: {
    type: String,
    enum: ['synced', 'pending', 'error'],
    default: 'synced'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
healthRecordSchema.index({ patientId: 1, date: -1 });
healthRecordSchema.index({ doctorId: 1, date: -1 });
healthRecordSchema.index({ recordType: 1, date: -1 });

// Virtual for formatted date
healthRecordSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Static method to get patient records with pagination
healthRecordSchema.statics.getPatientRecords = function(patientId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ patientId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('doctorId', 'name specialization')
    .lean();
};

// Static method to get doctor's patient records
healthRecordSchema.statics.getDoctorRecords = function(doctorId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ doctorId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('patientId', 'name phone')
    .lean();
};

module.exports = mongoose.model('HealthRecord', healthRecordSchema);