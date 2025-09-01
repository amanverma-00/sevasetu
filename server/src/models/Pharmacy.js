const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    maxLength: [200, 'Medicine name cannot exceed 200 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['prescription', 'over-the-counter', 'ayurvedic', 'homeopathic'],
    default: 'prescription'
  },
  manufacturer: {
    type: String,
    trim: true
  },
  dosage: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  _id: false // Don't create separate _id for subdocuments
});

const pharmacySchema = new mongoose.Schema({
  pharmacyName: {
    type: String,
    required: [true, 'Pharmacy name is required'],
    trim: true,
    maxLength: [200, 'Pharmacy name cannot exceed 200 characters'],
    unique: true
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxLength: [300, 'Address cannot exceed 300 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    website: {
      type: String,
      trim: true
    }
  },
  inventory: [medicineSchema],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    trim: true,
    unique: true
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
pharmacySchema.index({ 'location.city': 1 });
pharmacySchema.index({ 'location.pincode': 1 });
pharmacySchema.index({ 'location.coordinates': '2dsphere' }); // For geospatial queries
pharmacySchema.index({ 'inventory.medicineName': 1 });
pharmacySchema.index({ pharmacyName: 'text', 'location.address': 'text' });

// Virtual for full address
pharmacySchema.virtual('fullAddress').get(function() {
  const { address, city, state, pincode } = this.location;
  return `${address}, ${city}, ${state} - ${pincode}`;
});

// Static method to find pharmacies by location
pharmacySchema.statics.findByLocation = function(city, limit = 10) {
  return this.find({ 
    'location.city': new RegExp(city, 'i'),
    isActive: true 
  })
  .select('pharmacyName location contactInfo inventory rating')
  .limit(limit)
  .lean();
};

// Static method to search medicines across pharmacies
pharmacySchema.statics.searchMedicine = function(medicineName, city) {
  const query = {
    'inventory.medicineName': new RegExp(medicineName, 'i'),
    'inventory.isAvailable': true,
    'inventory.quantity': { $gt: 0 },
    isActive: true
  };
  
  if (city) {
    query['location.city'] = new RegExp(city, 'i');
  }
  
  return this.find(query)
    .select('pharmacyName location contactInfo inventory.$')
    .lean();
};

// Instance method to update medicine quantity
pharmacySchema.methods.updateMedicineQuantity = function(medicineName, newQuantity) {
  const medicine = this.inventory.find(item => 
    item.medicineName.toLowerCase() === medicineName.toLowerCase()
  );
  
  if (medicine) {
    medicine.quantity = newQuantity;
    medicine.isAvailable = newQuantity > 0;
    return this.save();
  }
  
  throw new Error('Medicine not found in inventory');
};

// Instance method to add medicine to inventory
pharmacySchema.methods.addMedicine = function(medicineData) {
  // Check if medicine already exists
  const existingMedicine = this.inventory.find(item => 
    item.medicineName.toLowerCase() === medicineData.medicineName.toLowerCase()
  );
  
  if (existingMedicine) {
    // Update existing medicine
    Object.assign(existingMedicine, medicineData);
  } else {
    // Add new medicine
    this.inventory.push(medicineData);
  }
  
  return this.save();
};

module.exports = mongoose.model('Pharmacy', pharmacySchema);