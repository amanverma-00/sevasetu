const axios = require('axios');
const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  asyncHandler 
} = require('../utils/apiResponse');

// AI Service URL (Flask API)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

// Check symptoms using AI service
const checkSymptoms = asyncHandler(async (req, res) => {
  const { symptoms, age, gender, additionalInfo } = req.body;

  try {
    // Prepare data for AI service
    const aiRequestData = {
      symptoms,
      age: age || null,
      gender: gender || null,
      additional_info: additionalInfo || null,
      user_id: req.user ? req.user._id.toString() : null
    };

    // Call AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict`, aiRequestData, {
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': `symptoms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    });

    // Process AI response
    const aiResult = aiResponse.data;

    // Format response for frontend
    const formattedResponse = {
      symptoms: symptoms,
      prediction: {
        possibleConditions: aiResult.possible_conditions || aiResult.conditions || [],
        riskLevel: aiResult.risk_level || aiResult.severity || 'unknown',
        confidence: aiResult.confidence || 0,
        recommendations: aiResult.recommendations || aiResult.advice || [],
        shouldSeeDoctor: aiResult.should_see_doctor || aiResult.urgent || false,
        disclaimer: aiResult.disclaimer || "This is an AI-powered symptom checker and should not replace professional medical advice. Please consult a healthcare professional for proper diagnosis and treatment."
      },
      timestamp: new Date().toISOString(),
      requestId: aiResponse.headers['x-request-id'] || `req-${Date.now()}`
    };

    // Log the symptom check (for analytics/improvement)
    logSymptomCheck(req.user, symptoms, aiResult);

    sendSuccessResponse(res, 'Symptom analysis completed successfully', formattedResponse);

  } catch (error) {
    console.error('AI Service Error:', error.message);

    // Handle different types of errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return sendErrorResponse(res, 'Symptom checker service is currently unavailable. Please try again later.', 503);
    }

    if (error.response) {
      // AI service returned an error response
      const status = error.response.status;
      const message = error.response.data?.message || 'Error processing symptoms';
      
      if (status === 400) {
        return sendErrorResponse(res, `Invalid symptoms data: ${message}`, 400);
      } else if (status === 429) {
        return sendErrorResponse(res, 'Too many requests to symptom checker. Please try again later.', 429);
      } else {
        return sendErrorResponse(res, 'Error analyzing symptoms. Please try again.', 500);
      }
    }

    if (error.code === 'ECONNABORTED') {
      return sendErrorResponse(res, 'Symptom analysis is taking too long. Please try again.', 408);
    }

    // Fallback response with basic recommendations
    const fallbackResponse = generateFallbackResponse(symptoms);
    sendSuccessResponse(res, 'Symptom analysis completed with basic recommendations', fallbackResponse);
  }
});

// Get available symptoms list
const getAvailableSymptoms = asyncHandler(async (req, res) => {
  try {
    // Try to get symptoms from AI service
    const aiResponse = await axios.get(`${AI_SERVICE_URL}/symptoms`, {
      timeout: 10000
    });

    sendSuccessResponse(res, 'Available symptoms retrieved successfully', {
      symptoms: aiResponse.data.symptoms || aiResponse.data
    });

  } catch (error) {
    console.error('Failed to fetch symptoms from AI service:', error.message);
    
    // Fallback to predefined symptoms list
    const fallbackSymptoms = getFallbackSymptoms();
    
    sendSuccessResponse(res, 'Available symptoms retrieved successfully (cached)', {
      symptoms: fallbackSymptoms,
      source: 'fallback'
    });
  }
});

// Get symptom categories
const getSymptomCategories = asyncHandler(async (req, res) => {
  try {
    const aiResponse = await axios.get(`${AI_SERVICE_URL}/symptom-categories`, {
      timeout: 10000
    });

    sendSuccessResponse(res, 'Symptom categories retrieved successfully', {
      categories: aiResponse.data.categories || aiResponse.data
    });

  } catch (error) {
    console.error('Failed to fetch symptom categories from AI service:', error.message);
    
    // Fallback categories
    const fallbackCategories = getFallbackCategories();
    
    sendSuccessResponse(res, 'Symptom categories retrieved successfully (cached)', {
      categories: fallbackCategories,
      source: 'fallback'
    });
  }
});

// Health check for AI service
const checkAIServiceHealth = asyncHandler(async (req, res) => {
  try {
    const aiResponse = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 5000
    });

    sendSuccessResponse(res, 'AI service is healthy', {
      aiService: {
        status: 'healthy',
        version: aiResponse.data.version || 'unknown',
        uptime: aiResponse.data.uptime || null,
        lastUpdated: aiResponse.data.last_updated || null
      }
    });

  } catch (error) {
    console.error('AI service health check failed:', error.message);
    
    sendErrorResponse(res, 'AI service is unavailable', 503, {
      aiService: {
        status: 'unavailable',
        error: error.message,
        lastChecked: new Date().toISOString()
      }
    });
  }
});

// Helper function to log symptom checks (for analytics)
const logSymptomCheck = (user, symptoms, aiResult) => {
  try {
    // In a production environment, you might want to store this in a separate collection
    // or send to an analytics service
    console.log('Symptom Check Log:', {
      userId: user ? user._id : 'anonymous',
      userRole: user ? user.role : 'anonymous',
      symptoms: symptoms,
      aiConfidence: aiResult.confidence || 0,
      riskLevel: aiResult.risk_level || aiResult.severity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log symptom check:', error.message);
  }
};

// Fallback response when AI service is unavailable
const generateFallbackResponse = (symptoms) => {
  const commonSymptoms = ['fever', 'cough', 'headache', 'fatigue', 'nausea'];
  const hasCommonSymptoms = symptoms.some(symptom => 
    commonSymptoms.some(common => symptom.toLowerCase().includes(common.toLowerCase()))
  );

  return {
    symptoms: symptoms,
    prediction: {
      possibleConditions: hasCommonSymptoms ? 
        ['Common Cold', 'Viral Infection', 'Flu'] : 
        ['Various conditions possible'],
      riskLevel: hasCommonSymptoms ? 'low' : 'unknown',
      confidence: 0.3,
      recommendations: [
        'Rest and stay hydrated',
        'Monitor your symptoms',
        'Consult a healthcare professional if symptoms worsen',
        'Seek immediate medical attention if you experience severe symptoms'
      ],
      shouldSeeDoctor: symptoms.length > 3 || !hasCommonSymptoms,
      disclaimer: "This is a basic fallback analysis. For accurate diagnosis, please consult a healthcare professional."
    },
    timestamp: new Date().toISOString(),
    source: 'fallback',
    requestId: `fallback-${Date.now()}`
  };
};

// Fallback symptoms list
const getFallbackSymptoms = () => {
  return [
    // General symptoms
    'Fever', 'Fatigue', 'Headache', 'Dizziness', 'Weakness', 'Loss of appetite',
    'Sweating', 'Chills', 'Weight loss', 'Weight gain',
    
    // Respiratory symptoms
    'Cough', 'Shortness of breath', 'Chest pain', 'Sore throat', 'Runny nose',
    'Nasal congestion', 'Sneezing', 'Wheezing',
    
    // Gastrointestinal symptoms
    'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain',
    'Heartburn', 'Bloating', 'Loss of taste', 'Loss of smell',
    
    // Neurological symptoms
    'Confusion', 'Memory problems', 'Seizures', 'Numbness', 'Tingling',
    'Muscle weakness', 'Tremor',
    
    // Musculoskeletal symptoms
    'Joint pain', 'Muscle pain', 'Back pain', 'Stiffness', 'Swelling',
    
    // Skin symptoms
    'Rash', 'Itching', 'Skin discoloration', 'Bruising', 'Hair loss',
    
    // Other symptoms
    'Sleep problems', 'Mood changes', 'Anxiety', 'Depression', 'Irritability'
  ];
};

// Fallback symptom categories
const getFallbackCategories = () => {
  return {
    'General': ['Fever', 'Fatigue', 'Headache', 'Dizziness', 'Weakness'],
    'Respiratory': ['Cough', 'Shortness of breath', 'Chest pain', 'Sore throat'],
    'Gastrointestinal': ['Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain'],
    'Neurological': ['Confusion', 'Memory problems', 'Numbness', 'Tingling'],
    'Musculoskeletal': ['Joint pain', 'Muscle pain', 'Back pain', 'Stiffness'],
    'Skin': ['Rash', 'Itching', 'Skin discoloration', 'Bruising'],
    'Psychological': ['Sleep problems', 'Mood changes', 'Anxiety', 'Depression']
  };
};

module.exports = {
  checkSymptoms,
  getAvailableSymptoms,
  getSymptomCategories,
  checkAIServiceHealth
};