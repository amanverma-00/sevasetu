// routes/docs.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const apiDocs = {
    message: 'SevaSetu API Documentation',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user'
      },
      records: {
        'GET /api/records': 'Get health records (requires auth)',
        'POST /api/records': 'Create a new health record (requires auth)'
      },
      pharmacies: {
        'GET /api/pharmacies': 'Get list of pharmacies',
        'POST /api/pharmacies/inventory': 'Update pharmacy inventory (requires auth)'
      },
      users: {
        'GET /api/users/profile': 'Get user profile (requires auth)',
        'PUT /api/users/profile': 'Update user profile (requires auth)'
      },
      demo: {
        'POST /api/demo/generate-sample-data': 'Generate sample data (requires auth)'
      }
    }
  };
  
  res.json(apiDocs);
});

module.exports = router;