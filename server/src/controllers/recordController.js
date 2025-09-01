const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');
const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendPaginatedResponse,
  sendNotFoundResponse,
  asyncHandler 
} = require('../utils/apiResponse');

// Get all health records for a patient
const getPatientRecords = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const patientId = req.params.patientId || req.user._id;

  // Authorization check - patients can only see their own records
  if (req.user.role === 'patient' && req.user._id.toString() !== patientId.toString()) {
    return sendErrorResponse(res, 'Access denied. You can only view your own records.', 403);
  }

  // Verify patient exists
  const patient = await User.findById(patientId);
  if (!patient || patient.role !== 'patient') {
    return sendNotFoundResponse(res, 'Patient');
  }

  // Get records with pagination
  const records = await HealthRecord.getPatientRecords(patientId, page, limit);
  const total = await HealthRecord.countDocuments({ patientId });

  sendPaginatedResponse(res, 'Health records retrieved successfully', records, {
    page,
    limit,
    total
  });
});

// Get a specific health record
const getRecordById = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  const record = await HealthRecord.findById(recordId)
    .populate('patientId', 'name phone')
    .populate('doctorId', 'name specialization');

  if (!record) {
    return sendNotFoundResponse(res, 'Health record');
  }

  // Authorization check
  if (req.user.role === 'patient' && req.user._id.toString() !== record.patientId._id.toString()) {
    return sendErrorResponse(res, 'Access denied. You can only view your own records.', 403);
  }

  if (req.user.role === 'doctor' && req.user._id.toString() !== record.doctorId?._id.toString()) {
    return sendErrorResponse(res, 'Access denied. You can only view records you created.', 403);
  }

  sendSuccessResponse(res, 'Health record retrieved successfully', record);
});

// Create a new health record (doctors only)
const createRecord = asyncHandler(async (req, res) => {
  const { 
    patientId, 
    doctorName, 
    diagnosis, 
    prescription, 
    symptoms, 
    vitalSigns, 
    notes,
    followUpDate,
    recordType 
  } = req.body;

  // Verify patient exists
  const patient = await User.findById(patientId);
  if (!patient || patient.role !== 'patient') {
    return sendErrorResponse(res, 'Invalid patient ID', 400);
  }

  // Create health record
  const recordData = {
    patientId,
    doctorName: doctorName || req.user.name,
    doctorId: req.user._id,
    diagnosis,
    prescription,
    ...(symptoms && { symptoms }),
    ...(vitalSigns && { vitalSigns }),
    ...(notes && { notes }),
    ...(followUpDate && { followUpDate }),
    ...(recordType && { recordType })
  };

  const record = new HealthRecord(recordData);
  await record.save();

  // Populate the response
  await record.populate('patientId', 'name phone');

  sendSuccessResponse(res, 'Health record created successfully', record, 201);
});

// Update a health record (doctors only)
const updateRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;
  const updates = req.body;

  // Find the record
  const record = await HealthRecord.findById(recordId);
  if (!record) {
    return sendNotFoundResponse(res, 'Health record');
  }

  // Authorization check - only the doctor who created it can update
  if (req.user._id.toString() !== record.doctorId?.toString()) {
    return sendErrorResponse(res, 'Access denied. You can only update records you created.', 403);
  }

  // Update the record
  const updatedRecord = await HealthRecord.findByIdAndUpdate(
    recordId,
    { 
      ...updates, 
      updatedAt: new Date() 
    },
    { 
      new: true, 
      runValidators: true 
    }
  ).populate('patientId', 'name phone');

  sendSuccessResponse(res, 'Health record updated successfully', updatedRecord);
});

// Delete a health record (doctors only)
const deleteRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  const record = await HealthRecord.findById(recordId);
  if (!record) {
    return sendNotFoundResponse(res, 'Health record');
  }

  // Authorization check - only the doctor who created it can delete
  if (req.user._id.toString() !== record.doctorId?.toString()) {
    return sendErrorResponse(res, 'Access denied. You can only delete records you created.', 403);
  }

  await HealthRecord.findByIdAndDelete(recordId);

  sendSuccessResponse(res, 'Health record deleted successfully');
});

// Get doctor's patient records
const getDoctorRecords = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const doctorId = req.user._id;

  const records = await HealthRecord.getDoctorRecords(doctorId, page, limit);
  const total = await HealthRecord.countDocuments({ doctorId });

  sendPaginatedResponse(res, 'Doctor records retrieved successfully', records, {
    page,
    limit,
    total
  });
});

// Search records by diagnosis or prescription
const searchRecords = asyncHandler(async (req, res) => {
  const { query, patientId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!query) {
    return sendErrorResponse(res, 'Search query is required', 400);
  }

  // Build search criteria
  const searchCriteria = {
    $or: [
      { diagnosis: { $regex: query, $options: 'i' } },
      { prescription: { $regex: query, $options: 'i' } },
      { doctorName: { $regex: query, $options: 'i' } },
      { symptoms: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  // Add patient filter if specified
  if (patientId) {
    // Authorization check for patients
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId.toString()) {
      return sendErrorResponse(res, 'Access denied. You can only search your own records.', 403);
    }
    searchCriteria.patientId = patientId;
  } else if (req.user.role === 'patient') {
    // If no patientId specified and user is patient, search only their records
    searchCriteria.patientId = req.user._id;
  } else if (req.user.role === 'doctor') {
    // If user is doctor, search only their created records
    searchCriteria.doctorId = req.user._id;
  }

  const skip = (page - 1) * limit;
  
  const records = await HealthRecord.find(searchCriteria)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('patientId', 'name phone')
    .populate('doctorId', 'name specialization')
    .lean();

  const total = await HealthRecord.countDocuments(searchCriteria);

  sendPaginatedResponse(res, 'Search results retrieved successfully', records, {
    page,
    limit,
    total
  });
});

// Get records by date range
const getRecordsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate, patientId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!startDate || !endDate) {
    return sendErrorResponse(res, 'Start date and end date are required', 400);
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return sendErrorResponse(res, 'Invalid date format', 400);
  }

  if (start > end) {
    return sendErrorResponse(res, 'Start date cannot be after end date', 400);
  }

  // Build query
  const query = {
    date: {
      $gte: start,
      $lte: end
    }
  };

  // Add patient filter and authorization
  if (patientId) {
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId.toString()) {
      return sendErrorResponse(res, 'Access denied. You can only view your own records.', 403);
    }
    query.patientId = patientId;
  } else if (req.user.role === 'patient') {
    query.patientId = req.user._id;
  } else if (req.user.role === 'doctor') {
    query.doctorId = req.user._id;
  }

  const skip = (page - 1) * limit;

  const records = await HealthRecord.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate('patientId', 'name phone')
    .populate('doctorId', 'name specialization')
    .lean();

  const total = await HealthRecord.countDocuments(query);

  sendPaginatedResponse(res, 'Records by date range retrieved successfully', records, {
    page,
    limit,
    total
  });
});

// Get record statistics
const getRecordStats = asyncHandler(async (req, res) => {
  const { patientId } = req.query;
  
  let matchStage = {};
  
  if (patientId) {
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId.toString()) {
      return sendErrorResponse(res, 'Access denied. You can only view your own statistics.', 403);
    }
    matchStage.patientId = patientId;
  } else if (req.user.role === 'patient') {
    matchStage.patientId = req.user._id;
  } else if (req.user.role === 'doctor') {
    matchStage.doctorId = req.user._id;
  }

  const stats = await HealthRecord.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        recordsByType: {
          $push: {
            type: '$recordType',
            count: 1
          }
        },
        recordsByMonth: {
          $push: {
            month: { $dateToString: { format: '%Y-%m', date: '$date' } },
            count: 1
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalRecords: 1,
        recordsByType: {
          $reduce: {
            input: '$recordsByType',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$value',
                { $arrayToObject: [[ { k: '$this.type', v: { $add: [ { $ifNull: [ '$value.$this.type', 0 ] }, 1 ] } } ]] }
              ]
            }
          }
        },
        recordsByMonth: {
          $reduce: {
            input: '$recordsByMonth',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$value',
                { $arrayToObject: [[ { k: '$this.month', v: { $add: [ { $ifNull: [ '$value.$this.month', 0 ] }, 1 ] } } ]] }
              ]
            }
          }
        }
      }
    }
  ]);

  const result = stats.length > 0 ? stats[0] : {
    totalRecords: 0,
    recordsByType: {},
    recordsByMonth: {}
  };

  sendSuccessResponse(res, 'Record statistics retrieved successfully', result);
});

// Bulk sync records (for offline functionality)
const bulkSyncRecords = asyncHandler(async (req, res) => {
  const { records } = req.body;

  if (!Array.isArray(records) || records.length === 0) {
    return sendErrorResponse(res, 'Records array is required', 400);
  }

  // Only patients can sync their own records
  if (req.user.role !== 'patient') {
    return sendErrorResponse(res, 'Only patients can sync records', 403);
  }

  const syncResults = {
    success: [],
    errors: []
  };

  for (const recordData of records) {
    try {
      // Ensure the record belongs to the authenticated patient
      recordData.patientId = req.user._id;
      recordData.syncStatus = 'synced';

      if (recordData._id) {
        // Update existing record
        const updatedRecord = await HealthRecord.findByIdAndUpdate(
          recordData._id,
          recordData,
          { new: true, runValidators: true }
        );
        syncResults.success.push({
          id: recordData._id,
          action: 'updated',
          record: updatedRecord
        });
      } else {
        // Create new record
        const newRecord = new HealthRecord(recordData);
        await newRecord.save();
        syncResults.success.push({
          id: newRecord._id,
          action: 'created',
          record: newRecord
        });
      }
    } catch (error) {
      syncResults.errors.push({
        record: recordData,
        error: error.message
      });
    }
  }

  sendSuccessResponse(res, 'Records sync completed', syncResults);
});

module.exports = {
  getPatientRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getDoctorRecords,
  searchRecords,
  getRecordsByDateRange,
  getRecordStats,
  bulkSyncRecords
};