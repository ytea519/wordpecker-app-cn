import mongoose from 'mongoose';
import { environment } from './environment';

if (!environment.mongodbUrl) {
  throw new Error('Missing MongoDB configuration. Check MONGODB_URL in .env');
}

// MongoDB connection options
const mongoOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  retryReads: true,
};

// Connect to MongoDB with retry logic
export const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting to connect to MongoDB... (attempt ${i + 1}/${retries})`);
      await mongoose.connect(environment.mongodbUrl as string, mongoOptions);
      console.log('✅ Connected to MongoDB successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error instanceof Error ? error.message : String(error));
      
      if (i === retries - 1) {
        console.error('❌ Failed to connect to MongoDB after all retries');
        process.exit(1);
      }
      
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Close MongoDB connection
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}; 