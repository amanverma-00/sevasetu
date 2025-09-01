const mongoose = require('mongoose');


const connectDB = async () => {
  const dbURI = process.env.MONGODB_URI;
  if (!dbURI) {
    console.error('❌ MONGODB_URI environment variable is missing. Please set it in your .env file.');
    process.exit(1);
  }
  let retries = 3;
  while (retries) {
    try {
      const conn = await mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
      });

      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed through app termination');
        process.exit(0);
      });
      break;
    } catch (error) {
      console.error(`❌ Database connection failed: ${error.message}`);
      retries -= 1;
      if (!retries) {
        console.error('❌ Could not connect to MongoDB after multiple attempts. Exiting.');
        process.exit(1);
      } else {
        console.log(`🔄 Retrying MongoDB connection (${3 - retries}/3)...`);
        await new Promise(res => setTimeout(res, 3000));
      }
    }
  }
};

module.exports = connectDB;