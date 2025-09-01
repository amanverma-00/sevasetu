const Pharmacy = require('../models/Pharmacy');
const User = require('../models/User');
const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendPaginatedResponse,
  sendNotFoundResponse,
  sendConflictResponse,
  asyncHandler 
} = require('../utils/apiResponse');

// Get all pharmacies with pagination and filtering
const getAllPharmacies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { city, search } = req.query;

  let query = { isActive: true };

  // Filter by city
  if (city) {
    query['location.city'] = new RegExp(city, 'i');
  }

  // Search by name or address
  if (search) {
    query.$or = [
      { pharmacyName: new RegExp(search, 'i') },
      { 'location.address': new RegExp(search, 'i') }
    ];
  }

  const skip = (page - 1) * limit;

  const pharmacies = await Pharmacy.find(query)
    .select('pharmacyName location contactInfo operatingHours rating inventory')
    .sort({ rating: -1, pharmacyName: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Filter inventory to show only available medicines
  pharmacies.forEach(pharmacy => {
    pharmacy.inventory = pharmacy.inventory
      .filter(medicine => medicine.isAvailable && medicine.quantity > 0)
      .slice(0, 10); // Show only top 10 medicines
  });

  const total = await Pharmacy.countDocuments(query);

  sendPaginatedResponse(res, 'Pharmacies retrieved successfully', pharmacies, {
    page,
    limit,
    total
  });
});

// Get pharmacy by ID
const getPharmacyById = asyncHandler(async (req, res) => {
  const { pharmacyId } = req.params;

  const pharmacy = await Pharmacy.findById(pharmacyId)
    .select('-__v')
    .lean();

  if (!pharmacy) {
    return sendNotFoundResponse(res, 'Pharmacy');
  }

  // Filter inventory to show only available medicines
  pharmacy.inventory = pharmacy.inventory.filter(
    medicine => medicine.isAvailable && medicine.quantity > 0
  );

  sendSuccessResponse(res, 'Pharmacy details retrieved successfully', pharmacy);
});

// Create a new pharmacy (Admin functionality)
const createPharmacy = asyncHandler(async (req, res) => {
  const {
    pharmacyName,
    location,
    contactInfo,
    operatingHours,
    licenseNumber,
    inventory = []
  } = req.body;

  // Check if pharmacy with same name or license already exists
  const existingPharmacy = await Pharmacy.findOne({
    $or: [
      { pharmacyName },
      { licenseNumber }
    ]
  });

  if (existingPharmacy) {
    return sendConflictResponse(res, 'Pharmacy with this name or license number already exists');
  }

  const pharmacy = new Pharmacy({
    pharmacyName,
    location,
    contactInfo,
    operatingHours,
    licenseNumber,
    inventory
  });

  await pharmacy.save();

  sendSuccessResponse(res, 'Pharmacy created successfully', pharmacy, 201);
});

// Update pharmacy information
const updatePharmacy = asyncHandler(async (req, res) => {
  const { pharmacyId } = req.params;
  const updates = req.body;

  // For pharmacists, ensure they can only update their own pharmacy
  if (req.user.role === 'pharmacist') {
    const user = await User.findById(req.user._id);
    if (!user.pharmacyId || user.pharmacyId.toString() !== pharmacyId) {
      return sendErrorResponse(res, 'Access denied. You can only update your own pharmacy.', 403);
    }
  }

  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    return sendNotFoundResponse(res, 'Pharmacy');
  }

  // Update pharmacy
  const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
    pharmacyId,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  sendSuccessResponse(res, 'Pharmacy updated successfully', updatedPharmacy);
});

// Update pharmacy inventory (Pharmacists only)
const updateInventory = asyncHandler(async (req, res) => {
  const { medicineName, quantity, price, expiryDate, category, manufacturer, dosage, description } = req.body;

  // Get pharmacist's pharmacy
  const user = await User.findById(req.user._id);
  if (!user.pharmacyId) {
    return sendErrorResponse(res, 'No pharmacy associated with your account', 400);
  }

  const pharmacy = await Pharmacy.findById(user.pharmacyId);
  if (!pharmacy) {
    return sendNotFoundResponse(res, 'Pharmacy');
  }

  try {
    // Prepare medicine data
    const medicineData = {
      medicineName,
      quantity,
      price,
      expiryDate,
      category,
      isAvailable: quantity > 0,
      ...(manufacturer && { manufacturer }),
      ...(dosage && { dosage }),
      ...(description && { description })
    };

    // Use pharmacy method to add/update medicine
    await pharmacy.addMedicine(medicineData);

    sendSuccessResponse(res, 'Inventory updated successfully', {
      medicineName,
      quantity,
      isAvailable: quantity > 0
    });

  } catch (error) {
    return sendErrorResponse(res, error.message, 400);
  }
});

// Search medicines across pharmacies
const searchMedicines = asyncHandler(async (req, res) => {
  const { medicine, city } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!medicine) {
    return sendErrorResponse(res, 'Medicine name is required', 400);
  }

  const pharmacies = await Pharmacy.searchMedicine(medicine, city);

  // Paginate results
  const total = pharmacies.length;
  const skip = (page - 1) * limit;
  const paginatedPharmacies = pharmacies.slice(skip, skip + limit);

  // Format response to show only relevant medicine info
  const results = paginatedPharmacies.map(pharmacy => ({
    pharmacyId: pharmacy._id,
    pharmacyName: pharmacy.pharmacyName,
    location: pharmacy.location,
    contactInfo: pharmacy.contactInfo,
    medicine: pharmacy.inventory[0] // searchMedicine returns only matching medicine
  }));

  sendPaginatedResponse(res, 'Medicine search results retrieved successfully', results, {
    page,
    limit,
    total
  });
});

// Get pharmacy inventory
const getPharmacyInventory = asyncHandler(async (req, res) => {
  const { pharmacyId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const { category, search, available } = req.query;

  // For pharmacists, ensure they can only view their own pharmacy
  if (req.user.role === 'pharmacist') {
    const user = await User.findById(req.user._id);
    if (!user.pharmacyId || user.pharmacyId.toString() !== pharmacyId) {
      return sendErrorResponse(res, 'Access denied. You can only view your own pharmacy inventory.', 403);
    }
  }

  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    return sendNotFoundResponse(res, 'Pharmacy');
  }

  let inventory = pharmacy.inventory;

  // Filter by category
  if (category) {
    inventory = inventory.filter(medicine => medicine.category === category);
  }

  // Filter by availability
  if (available !== undefined) {
    const isAvailable = available === 'true';
    inventory = inventory.filter(medicine => medicine.isAvailable === isAvailable);
  }

  // Search filter
  if (search) {
    inventory = inventory.filter(medicine => 
      medicine.medicineName.toLowerCase().includes(search.toLowerCase()) ||
      (medicine.manufacturer && medicine.manufacturer.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Pagination
  const total = inventory.length;
  const skip = (page - 1) * limit;
  const paginatedInventory = inventory.slice(skip, skip + limit);

  sendPaginatedResponse(res, 'Pharmacy inventory retrieved successfully', paginatedInventory, {
    page,
    limit,
    total
  });
});

// Delete medicine from inventory
const deleteMedicine = asyncHandler(async (req, res) => {
  const { medicineId } = req.params;

  // Get pharmacist's pharmacy
  const user = await User.findById(req.user._id);
  if (!user.pharmacyId) {
    return sendErrorResponse(res, 'No pharmacy associated with your account', 400);
  }

  const pharmacy = await Pharmacy.findById(user.pharmacyId);
  if (!pharmacy) {
    return sendNotFoundResponse(res, 'Pharmacy');
  }

  // Find and remove medicine
  const medicineIndex = pharmacy.inventory.findIndex(medicine => 
    medicine._id.toString() === medicineId
  );

  if (medicineIndex === -1) {
    return sendNotFoundResponse(res, 'Medicine');
  }

  pharmacy.inventory.splice(medicineIndex, 1);
  await pharmacy.save();

  sendSuccessResponse(res, 'Medicine removed from inventory successfully');
});

// Get pharmacy statistics
const getPharmacyStats = asyncHandler(async (req, res) => {
  let pharmacyId = req.params.pharmacyId;

  // For pharmacists, use their own pharmacy
  if (req.user.role === 'pharmacist') {
    const user = await User.findById(req.user._id);
    pharmacyId = user.pharmacyId;
  }

  if (!pharmacyId) {
    return sendErrorResponse(res, 'Pharmacy ID is required', 400);
  }

  const pharmacy = await Pharmacy.findById(pharmacyId);
  if (!pharmacy) {
    return sendNotFoundResponse(res, 'Pharmacy');
  }

  const inventory = pharmacy.inventory;
  
  const stats = {
    totalMedicines: inventory.length,
    availableMedicines: inventory.filter(med => med.isAvailable && med.quantity > 0).length,
    outOfStock: inventory.filter(med => med.quantity === 0).length,
    lowStock: inventory.filter(med => med.quantity > 0 && med.quantity <= 10).length,
    expiringSoon: inventory.filter(med => {
      const expiryDate = new Date(med.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate <= thirtyDaysFromNow;
    }).length,
    categoriesBreakdown: inventory.reduce((acc, med) => {
      acc[med.category] = (acc[med.category] || 0) + 1;
      return acc;
    }, {})
  };

  sendSuccessResponse(res, 'Pharmacy statistics retrieved successfully', stats);
});

module.exports = {
  getAllPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  updateInventory,
  searchMedicines,
  getPharmacyInventory,
  deleteMedicine,
  getPharmacyStats
};