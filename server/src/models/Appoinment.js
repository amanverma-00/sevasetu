const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  channelName: {
    type: String,
    required: true,
    unique: true
  },
  symptoms: String,
  notes: String,
  duration: {
    type: Number,
    default: 30 // minutes
  }
}, {
  timestamps: true
});

// Index for efficient querying
appointmentSchema.index({ patientId: 1, scheduledTime: 1 });
appointmentSchema.index({ doctorId: 1, scheduledTime: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);