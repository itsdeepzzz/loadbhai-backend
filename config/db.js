const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Check if we need to fall back to in-memory DB
    if (!uri || uri.includes('127.0.0.1')) {
      try {
        console.log('⏳ Attempting to connect to local MongoDB...');
        await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/loadbhai');
        console.log(`✅ Local MongoDB Connected: ${mongoose.connection.host}`);
        return;
      } catch (err) {
        console.log('⚠️ Local MongoDB not found. Spinning up in-memory database for development...');
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
