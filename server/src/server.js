require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');
const pharmacyRoutes = require('./routes/pharmacy');
const symptomRoutes = require('./routes/symptoms');
const videoRoutes = require('./routes/video');
const messagingRoutes = require('./routes/messaging');
const appointmentRoutes = require('./routes/appointments');

const app = express();

connectDB();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Healthcare API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Healthcare API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});